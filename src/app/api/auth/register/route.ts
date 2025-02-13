import Cart from '@/models/Cart';
import User from '@/models/User.model';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long').trim(),

  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, "Phone number can't be more than 15 digits")
    .regex(/^\d+$/, 'Phone number must contain only numbers'),

  email: z.string().email('Invalid email format').toLowerCase(),

  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const credentials = userSchema.parse(body);
    const availableUser = await User.findOne({ email: credentials.email });
    if (availableUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 },
      );
    }
    const user = new User(credentials);
    await user.save();
    const cart = new Cart({
      user: user._id,
    });
    await cart.save();
    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
