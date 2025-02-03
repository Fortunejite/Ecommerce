import { auth } from '@/auth';
import User from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { user } = session;
    const { favourite } = await User.findById(user._id);
    return NextResponse.json(favourite);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const { user } = session;
    await User.findByIdAndUpdate(user._id, {
      $push: { favourite: body },
    });
    return NextResponse.json({ message: 'Successfull' });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
