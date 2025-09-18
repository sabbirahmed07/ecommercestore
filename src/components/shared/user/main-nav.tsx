'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLink = {
  title: string;
  href: string;
};

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
}

const MainNav: React.FC<MainNavProps> = ({ links, className, ...props }) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
