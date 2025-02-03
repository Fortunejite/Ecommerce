import User from '@/models/User.model';
import { hash } from 'bcrypt';
import { ZodError, object, string } from 'zod';
import { NextResponse } from 'next/server';

const userObject = object({
  email: string().email({ message: 'Invalid email address' }),
  username: string()
    .min(3, { message: 'Username must be a minimum of 3 characters' })
    .max(20, { message: 'Username must be a maximum of 20 characters' }),
  password: string().min(6, {
    message: 'Password must be a minimum of 6 characters',
  }),
  firstName: string().min(0, 'First Name is required'),
  lastName: string().min(0, 'Last Name is required'),
});

export async function POST(request: Request) {
  try {
    const credentials = await request.json();
    const { email, password, firstName, lastName } =
      userObject.parse(credentials);
    const availableUser = await User.findOne({ email });
    if (availableUser) {
      return NextResponse.json(
        { msg: 'Email already exists' },
        { status: 409 },
      );
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    await user.save();
    return NextResponse.json({ msg: 'signup successful' }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ msg: e.issues[0].message }, { status: 409 });
    }
    return NextResponse.json({ msg: e }, { status: 409 });
  }
}
