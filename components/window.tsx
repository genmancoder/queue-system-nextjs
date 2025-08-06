
"use client"

import { useState, useEffect } from 'react'



type Queue = {
    ticketNumber: number
    firstName: string
    lastName: string
}

type WindowProps = {
    title: string;
    windowId: number;
}


export function Window({ title, windowId }: WindowProps) {

    const [current, setCurrent] = useState<Queue | null>(null)
    const [pending, setPending] = useState<Queue[]>([])


    const fetchCurrent = async () => {
        const res = await fetch('/api/queue/current/'+windowId)
        if (res.ok) {
            const data = await res.json()
            setCurrent(data)
        } else {
            setCurrent(null)
        }
    }

    console.log("win id ", windowId);

    const fetchPending = async () => {
        const res = await fetch('/api/queue/pending/'+windowId)
        if (res.ok) {
            const data = await res.json()
            console.log(data)
            setPending(data)
        }

    }

    const refreshData = () => {
        fetchCurrent()
        fetchPending()
    }

    useEffect(() => {
        refreshData()

        const interval = setInterval(refreshData, 5000) // Refresh every 5 seconds

        return () => clearInterval(interval) // Clean up on unmount
    }, [])


    const onquee = pending?.slice(0, 2)
    console.log(onquee?.length)

    return (
        <div className="border rounded-md p-8 min-h-[428px] w-[250px] bg-white shadow">
            <div className="font-bold mb-10">
                <p className="text-lg text-center">{title}</p>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-center pb-5 font-semibold">Now Serving</p>
                <div className="flex justify-center">
                    {current ? (
                        <p className="underline font-bold text-3xl italic text-blue-700">{current.ticketNumber}</p>
                    ) : (
                        <p> - - - </p>
                    )}

                </div>
            </div>
            <div className="flex flex-col justify-center mt-8 mb-4">
                <p className="text-center pb-5 font-semibold">On Queue</p>
                <div className="flex flex-col justify-center items-center">

                    {onquee?.length > 0 ? (
                        onquee.map((p) => (
                            <p key={p.ticketNumber} className="font-bold text-2xl ">{p.ticketNumber}</p>
                        ))
                    ) : (
                        <p className="font-bold-">No pending tickets.</p>
                    )}


                </div>
            </div>
            <div className="border-t-2 flex justify-center p-4">
                <p>Pending: <span>{pending?.length}</span></p>
            </div>
        </div>
    )
}
