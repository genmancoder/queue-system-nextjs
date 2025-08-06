import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const pending = await prisma.queue.findMany({
    where: { status: 'waiting', deletedAt: null, },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(pending)
}
