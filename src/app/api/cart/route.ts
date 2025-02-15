import { auth } from '@/auth';
import Cart from '@/models/Cart.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { user } = session;
    const { items } = await Cart.findOne({ user: user._id }).populate('items.product');
    return NextResponse.json(items);
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

    const { productId, quantity } = await request.json();

    const { user } = session;
    const { items } = await Cart.findOneAndUpdate(
      { user: user._id },
      {
        $push: { items: { product: productId, quantity: quantity || 1 } },
      },
      { new: true },
    ).populate('items.product');
    return NextResponse.json(items);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
