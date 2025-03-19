import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product.model';
import { SortOrder } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const name = searchParams.get('name');
    const brands = searchParams.get('brands');
    const concentration = searchParams.get('concentration');
    const fragranceFamily = searchParams.get('fragranceFamily');
    const gender = searchParams.get('gender');
    const size = searchParams.get('size');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Build a price filter object if needed
    const priceQuery: Record<string, number> = {};
    if (minPrice) priceQuery.$gte = Number(minPrice);
    if (maxPrice) priceQuery.$lte = Number(maxPrice);

    // Construct the filter query
    const query = {
      ...(name && { name }),
      ...(brands && { brand: { $in: brands.split(',') } }),
      ...(concentration && {
        concentration: { $in: concentration.split(',') },
      }),
      ...(fragranceFamily && {
        fragranceFamily: { $in: fragranceFamily.split(',') },
      }),
      ...(gender && { gender: { $in: gender.split(',') } }),
      ...(size && { size: { $in: size.split(',') } }),
      ...(Object.keys(priceQuery).length && { price: priceQuery }),
    };

    // Sorting: map sort query to schema attribute
    const sort = searchParams.get('sort');
    const order = searchParams.get('order') || 'asc';
    const sortMap: Record<string, string> = {
      alpha: 'name',
      price: 'price',
      date: 'createdAt',
    };
    const sortAttribute = sortMap[sort || ''] || 'sales';
    const sortQuery = { [sortAttribute]: order as SortOrder };

    // Execute query and count in parallel
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate('brand'),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
