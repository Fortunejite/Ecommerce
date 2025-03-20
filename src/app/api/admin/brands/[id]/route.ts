import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand.model';
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
        { message: 'Brand ID is required' },
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

    const { name } = await request.json();
    const brand = await Brand.findByIdAndUpdate(id, {name}, {
      new: true,
    });
    if (!brand) {
      return NextResponse.json(
        { message: 'Brand not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(brand);
  } catch (error) {
    console.error('GET /brands/[id] error:', error);
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
        { message: 'Brand ID is required' },
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

    await Brand.findByIdAndDelete(id);
    return NextResponse.json(id);
  } catch (error) {
    console.error('DELETE /brand/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
