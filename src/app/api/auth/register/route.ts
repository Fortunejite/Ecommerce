import User from '@/models/User.model';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const credentials = await request.json();
    const availableUser = await User.findOne({ email: credentials.email });
    if (availableUser) {
      return NextResponse.json(
        { msg: 'Email already exists' },
        { status: 400 },
      );
    }
    const user = new User(credentials);
    await user.save();
    return NextResponse.json({ msg: 'signup successful' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ msg: e }, { status: 500 });
  }
}
