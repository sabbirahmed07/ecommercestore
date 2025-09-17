'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import Link from 'next/link';
import Image from 'next/image';
import { CartItem } from '@/types';

const PlaceOrderTable = ({ cartItems }: { cartItems: CartItem[] }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.slug}>
              <TableCell>
                <Link
                  href={`product/${item.slug}`}
                  className='flex items-center'
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                  />
                  <span className='px-2'>{item.name}</span>
                </Link>
              </TableCell>
              <TableCell className='px-2'>{item.qty}</TableCell>
              <TableCell className='text-right'>${item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PlaceOrderTable;
