import Product from '@/models/Product.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userQuery = searchParams.get('q');

  if (!userQuery) {
    return NextResponse.json(
      { message: 'No search query was provided' },
      { status: 400 },
    );
  }

  try {
    const regex = new RegExp('^' + userQuery, 'i');

    const results = await Product.find({ name: { $regex: regex } }).limit(5);

    // const results = await Product.aggregate([
    //   {
    //     $search: {
    //       autocomplete: {
    //         query: userQuery,
    //         path: 'name',
    //         fuzzy: {
    //           maxEdits: 1,
    //           prefixLength: 2,
    //         },
    //       },
    //     },
    //   },
    //   { $limit: 10 },
    //   {
    //     $project: {
    //       name: 1,
    //       score: { $meta: 'searchScore' },
    //     },
    //   },
    // ]);

    return NextResponse.json(results);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
