import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order.model';
import { NextRequest, NextResponse } from 'next/server';

import '@/models/Product.model'
import '@/models/User.model'

export async function PATCH(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    await dbConnect();

    const { id } = await params;
    const session = await auth();

    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    if (!id) {
      return NextResponse.json(
        { message: 'Tracking ID is required' },
        { status: 400 },
      );
    }

    const { user } = session;

    if (!user.isAdmin)
      return NextResponse.json(
        { message: 'Insufficient Permission' },
        { status: 403 },
      );

    const { status } = await request.json();
    const order = await Order.findOneAndUpdate(
      { trackingId: id },
      { status },
      {
        new: true,
      },
    )
      .populate('user')
      .populate('cartItems.product');
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('PATCH /admin/orders/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
