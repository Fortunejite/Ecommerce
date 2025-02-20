import { auth } from '@/auth';
import { calculateTotalAmount } from '@/lib/cartUtils';
import { handleMongooseError } from '@/lib/errorHandler';
import Cart, { ICart } from '@/models/Cart.model';
import Order from '@/models/Order.model';
import { IProduct } from '@/models/Product.model';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  try {
    // pagination
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;

    // filter
    const status = request.nextUrl.searchParams.get('status');

    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { user } = session;
    const { isAdmin } = user;

    const skip = (page - 1) * limit;
    const query = {
      ...(!isAdmin && { user: user._id }),
      ...(status && { status }),
    };

    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .populate('cartItems.product'),
      Order.countDocuments(query).exec(),
    ]);
    return NextResponse.json({ orders, totalCount });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { user } = session;
  const body = await request.json();
  const { paymentMethod, paymentReference, shipmentInfo } = body;
  const cart = (await Cart.findOne({ user: user._id }).populate(
    'items.product',
  )) as ICart;
  const cartItems = cart.items.map((item) => ({
    product: (item.product as IProduct)._id,
    quantity: item.quantity,
    price: (item.product as IProduct).price,
  }));
  const totalAmount = calculateTotalAmount(cart.items);

  try {
    const newOrder = new Order({
      user: user._id,
      cartItems,
      totalAmount,
      paymentMethod,
      paymentReference,
      shipmentInfo,
    });
    await newOrder.save();
    await Cart.findOneAndUpdate({ user: user._id }, { $set: { items: [] } });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: handleMongooseError(e as Error) },
      { status: 500 },
    );
  }
}
