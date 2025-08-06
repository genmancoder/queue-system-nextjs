import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: { windowId: string } }
) {
  const params = await context.params;
  const windowId = Number(await params.windowId)

  if (isNaN(windowId)) {
    return NextResponse.json({ error: 'Invalid window ID' }, { status: 400 })
  }

  const pending = await prisma.queue.findMany({
    where: {
      status: 'waiting',
      deletedAt: null,
      windowId: windowId,
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(pending)
}
