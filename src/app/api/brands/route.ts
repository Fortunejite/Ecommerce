import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const brands = await Brand.find().sort({ name: 1 });
    return NextResponse.json(brands);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const { user } = session;

    if (!user || !user.isAdmin)
      return NextResponse.json(
        { message: 'Insufficient Permission' },
        { status: 403 },
      );
    const brand = new Brand({ name: body });
    await brand.save();
    return NextResponse.json({ message: 'Success' });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
