import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { windowId: string } }
) {
  const { windowId } = params;
  const id = Number(params.windowId);

  if (!windowId) {
    return NextResponse.json({ error: 'Missing window id.' }, { status: 400 });
  }

  const windows = await prisma.window.findFirst({
    where: {
      id: id,
      deletedAt: null,
    },
  });

  if (!windows) {
    return NextResponse.json({ error: 'Windows not found' }, { status: 404 });
  }

  return NextResponse.json(windows);
}
