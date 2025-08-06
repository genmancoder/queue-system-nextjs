import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export async function POST(req: Request) {
    const body = await req.json()
    const { windowTitle, windowDescription } = body  
      

    const newWindow = await prisma.window.create({
        data: {
            windowTitle,
            windowDescription
        },
    })

    console.log(newWindow)

    return NextResponse.json(newWindow)
}
