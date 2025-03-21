import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

import '@/models/Product.model'

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { user } = session;
    const { favourite } = await User.findById(user._id).populate('favourite');
    return NextResponse.json(favourite);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { productId } = await request.json();

    const { user } = session;
    const { favourite } = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { favourite: productId },
      },
      { new: true },
    ).populate('favourite');
    return NextResponse.json(favourite);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
