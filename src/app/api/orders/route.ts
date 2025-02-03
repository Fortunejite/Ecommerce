import { handleMongooseError } from '@/lib/errorHandler';
import Order from '@/models/Order.model';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  try {
    // pagination
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;

    // filter
    const status = request.nextUrl.searchParams.get('status');

    const skip = (page - 1) * limit;
    const query = {
      ...(status && { status }),
    };

    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
    return NextResponse.json(orders);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const newOrder = new Order(body);
    await newOrder.save();
    return NextResponse.json(
      { message: 'Order created successfully' },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: handleMongooseError(e as Error) },
      { status: 400 },
    );
  }
}
