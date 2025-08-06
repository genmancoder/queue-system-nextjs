import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  // Find first waiting ticket
  const next = await prisma.queue.findFirst({
    where: { status: 'waiting' },
    orderBy: { id: 'asc' },
  })

  if (!next) {
    return NextResponse.json({ message: 'No one in queue' }, { status: 404 })
  }

  // Mark all previous 'called' as 'served'
  await prisma.queue.updateMany({
    where: { status: 'called' },
    data: { status: 'served' },
  })

  // Mark this ticket as currently 'called'
  const updated = await prisma.queue.update({
    where: { id: next.id },
    data: { status: 'called' },
  })

  return NextResponse.json(updated)
}
