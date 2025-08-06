import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// DELETE /api/queue
export async function DELETE() {
  await prisma.queue.updateMany({
    where: {
      deletedAt: null, // only affect active items
    },
    data: {
      deletedAt: new Date(), // mark as deleted
    },
  });

  return NextResponse.json({ message: "Queue successfully cleared." });
}
