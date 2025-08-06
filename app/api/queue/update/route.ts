import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {

    const updated = await prisma.queue.updateMany({
        data: { windowId: 2 },
    })

    return NextResponse.json({ updatedCount: updated.count })
}
