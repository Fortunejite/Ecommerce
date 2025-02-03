import Order from '@/models/Order.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: 'Order ID is required' },
        { status: 400 },
      );
    }

    const order = await Order.findById(id).populate('user').populate('Product');
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('GET /orders/[id] error:', error);
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
        { message: 'Order ID is required' },
        { status: 400 },
      );
    }
    const body = await request.json();
    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('GET /orders/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}