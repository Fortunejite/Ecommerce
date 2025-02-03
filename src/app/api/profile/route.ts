import { auth } from '@/auth';
import User from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { user } = session;

    const profile = await User.findById(user._id);
    return NextResponse.json(profile);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { user } = session;
    const body = await request.json();

    const profile = await User.findByIdAndUpdate(user._id, body);
    return NextResponse.json(profile);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
