import dbConnect from '@/lib/mongodb';
import User from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
  
    const user = await User.findById(params.id);
    return NextResponse.json({ data: user }, { status: 200 });

  } catch(e) {
    console.log(e)
    return NextResponse.json({ data: null }, { status: 500 });
  }
}
