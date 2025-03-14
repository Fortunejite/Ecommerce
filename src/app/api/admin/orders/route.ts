import { auth } from '@/auth';
import Order from '@/models/Order.model';
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

    if (!user.isAdmin)
      return NextResponse.json(
        { message: 'Insufficient Permission' },
        { status: 403 },
      );

    const skip = (page - 1) * limit;
    const query = {
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
