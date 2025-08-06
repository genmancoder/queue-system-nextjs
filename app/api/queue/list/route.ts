import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const queue = await prisma.queue.findMany({    
    where: {
      deletedAt: null, // exclude soft-deleted entries
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(queue)
}
