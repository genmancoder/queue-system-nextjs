
"use client"

import { useState, useEffect } from 'react'
import { Window } from '../window'



type QueeWindow = {
    id: number
    windowTitle: string
    windowDescription: string
}


export function DisplayArea() {

    const [windows, setWindows] = useState<QueeWindow[]>([])

    const fetchWindows = async () => {
        const res = await fetch('/api/window/list')
        if (res.ok) {
            const data = await res.json()
            console.log(data)
            setWindows(data)
        }

    }

    const refreshData = () => {
        fetchWindows()
    }

    useEffect(() => {
        refreshData()

        const interval = setInterval(refreshData, 5000) // Refresh every 5 seconds

        return () => clearInterval(interval) // Clean up on unmount
    }, [])


    return (
        <div className="flex  gap-[16px] row-start-2 items-center sm:items-start">

            {windows?.length > 0 ? (
                windows?.map((p) => (
                    <Window key={p.id} title={p.windowTitle} windowId={p.id} />
                ))
            ) : (
                <p>No windows avaialable</p>
            )}

            
        </div>
    )
}
