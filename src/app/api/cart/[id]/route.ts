import { auth } from '@/auth';
import Cart from '@/models/Cart';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 },
      );
    }
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { user } = session;

    const { items } = await Cart.findOneAndUpdate(
      { user: user._id },
      { $pull: { items: { product: id } } },
      { new: true },
    ).populate('items');
    return NextResponse.json(items);
  } catch (error) {
    console.error('DELETE /cart/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 },
      );
    }
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { quantity } = await request.json();

    const { user } = session;
    const { items } = await Cart.findOneAndUpdate(
      { user: user._id, 'items.product': id },
      {
        $set: { 'items.$.quantity': quantity },
      },
      { new: true },
    ).populate('items');
    return NextResponse.json(items);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
