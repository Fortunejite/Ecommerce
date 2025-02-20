import { errorHandler } from '@/lib/errorHandler';
import Cart from '@/models/Cart.model';
import User from '@/models/User.model';
import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

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
        { message: { email: 'Email already exists' } },
        { status: 400 },
      );
    }

    const user = new User(credentials);
    await user.save();

    const cart = new Cart({ user: user._id });
    await cart.save();

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (error) {
    // Handle Zod validation errors gracefully.
    if (error instanceof ZodError) {
      const errors = error.errors.reduce((acc, curr) => {
        // Join the path in case of nested fields.
        const field = curr.path.join('.') || 'field';
        acc[field] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      return NextResponse.json({ message: errors }, { status: 400 });
    }

    // Use the centralized error handler for other error types.
    const message = errorHandler(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
