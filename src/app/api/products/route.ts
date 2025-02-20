import { handleMongooseError } from '@/lib/errorHandler';
import Product from '@/models/Product.model';
import { SortOrder } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  try {
    // pagination
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;

    // filter
    const name = request.nextUrl.searchParams.get('name');
    const tags = request.nextUrl.searchParams.get('tags');
    const category = request.nextUrl.searchParams.get('category');
    const minPrice = request.nextUrl.searchParams.get('minPrice');
    const maxPrice = request.nextUrl.searchParams.get('maxPrice');
    const rating = Number(request.nextUrl.searchParams.get('ratings'));

    const skip = (page - 1) * limit;
    const query = {
      ...(name && { name }),
      ...(tags && { tags: { $in: tags.split(',') } }),
      ...(category && { category: { $in: category.split(',') } }),
      ...(minPrice && { price: { $gte: minPrice } }),
      ...(maxPrice && { price: { $lte: maxPrice } }),
      ...(rating && { rating: { $gte: rating } }),
    };
    const sort = {
      ...(rating && { rating: -1 }),
      ...((minPrice || maxPrice) && { price: -1 }),
      createdAt: -1,
    } as { [key: string]: SortOrder };

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('tags')
        .populate('category'),
      Product.countDocuments(query).exec(),
    ]);
    return NextResponse.json({ products, totalCount });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const newProduct = new Product(body);
    await newProduct.save();
    return NextResponse.json(
      { message: 'Product created successfully' },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: handleMongooseError(e as Error) },
      { status: 400 },
    );
  }
}
