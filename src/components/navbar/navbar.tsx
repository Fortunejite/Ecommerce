'use client';

import { X, ShoppingBag, PersonStanding } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const icons = [
  { name: 'cart', url: '/cart', icon: <ShoppingBag /> },
  { name: 'profle', url: '/profile', icon: <PersonStanding /> },
];

const navigations = [
  { name: 'Home', url: '/home' },
  { name: 'Shop', url: '/shop' },
  { name: 'Product', url: '/product' },
];

const Navbar = () => (
  <nav>
    <X />
    <div className='logo'>
      <Image
        src='images/logo.svg'
        alt='Belle Multipurpose Html Template'
        width={100}
        height={100}
      />
    </div>

    <div className="navigations">
      {navigations.map((item) => <Link key={item.name} href={item.url}>{item.name}</Link>)}
    </div>

    <div className='icons'>
      {icons.map((link) => (
        <Link key={link.name} href={link.url}>
          {link.icon}
        </Link>
      ))}
    </div>
  </nav>
);

export default Navbar;
