import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product.model';
import { NextRequest, NextResponse } from 'next/server';

import '@/models/Brand.model'

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // pagination
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;

    const skip = (page - 1) * limit;
    const products = await Product.find({ discount: { $gt: 0 } })
      .sort({ discount: -1 })
      .skip(skip)
      .limit(limit)
      .populate('brand');
    return NextResponse.json(products);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
