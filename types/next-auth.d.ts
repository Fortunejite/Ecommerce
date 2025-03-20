/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      email: string;
      name: string;
      avatar?: string | null;
      isAdmin: boolean;
    };
  }

  interface User {
    _id: string;
    email: string;
    name: string;
    password?: string;
    avatar?: string | null;
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id: string;
    email: string;
    name: string;
    avatar?: string | null;
    isAdmin: boolean;
  }
}
