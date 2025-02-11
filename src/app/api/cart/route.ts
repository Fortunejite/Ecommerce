import { auth } from '@/auth';
import User from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { user } = session;
    const { cart } = await User.findById(user._id);
    return NextResponse.json(cart);
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

    const { productId } = await request.json();

    const { user } = session;
    const { cart } = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { cart: productId },
      },
      { new: true },
    ).populate('cart');
    return NextResponse.json(cart);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
