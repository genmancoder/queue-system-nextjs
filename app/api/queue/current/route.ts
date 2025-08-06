import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const current = await prisma.queue.findFirst({
    where: { status: 'called', deletedAt: null, },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(current)
}
