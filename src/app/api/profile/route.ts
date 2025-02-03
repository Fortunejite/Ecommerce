import dbConnect from '@/lib/mongodb';
import User from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
  
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
  
    const users = await User.find().skip(skip).limit(limit);
    return NextResponse.json({ data: users }, { status: 200 });
    
  } catch(e) {
    console.log(e)
    return NextResponse.json({ data: null }, { status: 500 });
  }
}
