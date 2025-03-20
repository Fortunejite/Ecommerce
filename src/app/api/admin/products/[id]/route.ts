import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    await dbConnect();

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
    if (!session.user.isAdmin)
      return NextResponse.json(
        { message: 'Insufficient Permission' },
        { status: 403 },
      );

    const body = await request.json();
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /products/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: tParams },
) {
  try {
    await dbConnect();

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
    if (!session.user.isAdmin)
      return NextResponse.json(
        { message: 'Insufficient Permission' },
        { status: 403 },
      );

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted sucessfully' });
  } catch (error) {
    console.error('DELETE /products/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
