import { auth } from '@/auth';
import Tag from '@/models/Tag.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const tags = await Tag.find();
    return NextResponse.json(tags);
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const tag = new Tag({ name: body });
    await tag.save();
    return NextResponse.json({ message: 'Success' });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
