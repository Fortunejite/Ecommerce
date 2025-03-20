import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = request.nextUrl;
  const userQuery = searchParams.get('q');

  if (!userQuery) {
    return NextResponse.json(
      { message: 'No search query was provided' },
      { status: 400 },
    );
  }

  try {
    const results = await Product.aggregate([
      {
        $search: {
          autocomplete: {
            query: userQuery,
            path: 'name',
            fuzzy: {
              maxEdits: 1,
              prefixLength: 2,
            },
          },
        },
      },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          mainPic: 1,
          discount: 1,
          price: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ]);

    return NextResponse.json(results);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
