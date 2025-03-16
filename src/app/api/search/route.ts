import Product from '@/models/Product.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userQuery = searchParams.get('q');
  // Pagination
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  if (!userQuery) {
    return NextResponse.json(
      { message: 'No search query was provided' },
      { status: 400 },
    );
  }

  try {
    const regex = new RegExp('^' + userQuery, 'i');

    const [results, totalCount] = await Promise.all([
      Product.find({ name: { $regex: regex } })
        .limit(limit)
        .skip(skip)
        .populate('brand'),
      Product.countDocuments({ name: { $regex: regex } }),
    ]);
    return NextResponse.json({ results, totalCount });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
