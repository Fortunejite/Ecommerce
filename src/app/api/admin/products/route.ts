import { auth } from '@/auth';
import { handleMongooseError } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await auth();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!session.user.isAdmin)
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  const body = await request.json();

  try {
    const newProduct = new Product(body);
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: handleMongooseError(e as Error) },
      { status: 400 },
    );
  }
}
