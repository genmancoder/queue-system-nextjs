import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  context: { params: { windowId: string } }
) {
  const params = await context.params;

  const windowId = Number(await params.windowId)

  if (isNaN(windowId)) {
    return NextResponse.json({ error: 'Invalid window ID' }, { status: 400 })
  }

  const current = await prisma.queue.findFirst({
    where: {
      status: 'called',
      deletedAt: null,
      windowId: windowId,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(current)
}
