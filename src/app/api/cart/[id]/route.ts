import { auth } from '@/auth';
import User from '@/models/User.model';
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

    const { cart } = await User.findByIdAndUpdate(
      user._id,
      { $pull: { cart: id } },
      { new: true },
    ).populate('cart');
    return NextResponse.json(cart);
  } catch (error) {
    console.error('DELETE /cart/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
