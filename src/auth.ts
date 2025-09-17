import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialProviders from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 69 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProviders({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        //find a user
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          //correct passowrd?
          if (isMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }
        //if not matched
        return null;
      },
    }),
  ],

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      //if there is an update, set the user name
      if (trigger === 'updated') {
        session.user.name = user.name;
      }

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      //assign user fields to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        //if user has no name
        if (user.name === 'NO_NAME') {
          token.name = user.email.split('@')[0];

          //update the database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              //delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              //assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      //handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/admin/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
      ];
      //get path name from request object
      const { pathname } = request.nextUrl;

      //check if user is not authenticated and accessing a protected route
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      //check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        //generate session cart id
        const sessionCartId = crypto.randomUUID();

        //clone req headers
        const newRequestHeader = new Headers(request.headers);

        //create new response and add the new headers;
        const response = NextResponse.next({
          request: {
            headers: newRequestHeader,
          },
        });

        //set newly generated sessioncartid in the response cookies
        response.cookies.set('sessionCartId', sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
