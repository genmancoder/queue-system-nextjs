import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { windowId } = await req.json()

  if (!windowId || isNaN(windowId)) {
    return NextResponse.json({ error: 'Invalid window ID' }, { status: 400 })
  }
  // 1. Find last called ticket
  const lastCalled = await prisma.queue.findFirst({
    where: { status: 'called', deletedAt: null, windowId: Number(windowId)},
    orderBy: { id: 'desc' },
  })

  if (lastCalled) {
    await prisma.queue.update({
      where: { id: lastCalled.id },
      data: { status: 'served' },
    })
  }

  // 2. Find the next waiting ticket
  const next = await prisma.queue.findFirst({
    where: { status: 'waiting', deletedAt: null,windowId: Number(windowId) },
    orderBy: { id: 'asc' },
  })

  if (!next) {
    return NextResponse.json({ message: 'No one in queue' }, { status: 404 })
  }

  // 3. Call next
  const updated = await prisma.queue.update({
    where: { id: next.id},
    data: { status: 'called', deletedAt: null, },
  })

  return NextResponse.json(updated)
}
