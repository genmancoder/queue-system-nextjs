'use client'
import { useState, useEffect } from 'react'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import Link from 'next/link'

type QueeWindow = {
    id: number
    windowTitle: string
    windowDescription: string
}



export default function Cpanel() {
    const [windows, setWindows] = useState<QueeWindow[]>([])

    const [open, setOpen] = useState(false);

    const showAddDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    const [form, setForm] = useState({
        windowTitle: '',
        windowDescription: '',
    })

    const [error, setError] = useState<string>('')

    const fetchWindow = async () => {
        const res = await fetch('/api/window/list')
        if (res.ok) {
            const data = await res.json()
            setWindows(data)
            console.log(data)
        }
    }



    const validateForm = () => {
        const { windowTitle, windowDescription } = form

        if (!windowTitle || !windowDescription) {
            return 'All fields are required.'
        }
        return ''
    }

    const resetForm = () => {
        setForm({
            windowTitle: '',
            windowDescription: '',
        });
        // setTicket(null);
    };


    const addWindow = async () => {

        const errorMsg = validateForm()
        if (errorMsg) {
            setError(errorMsg)
            return
        }

        const res = await fetch('/api/window/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        console.log(res)
        toast("Window has been created.")
        resetForm();
    }
    const refreshData = () => {
        fetchWindow()
    }

    useEffect(() => {
        refreshData()

        const interval = setInterval(refreshData, 5000) // Refresh every 5 seconds

        return () => clearInterval(interval) // Clean up on unmount
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 text-center bg-white p-5 scroll-auto rounded-md mb-8">
            <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>
            <a className="bg-blue-500 text-white px-6 py-3 rounded mr-2 cursor-pointer" href="/">Queue</a>
            <button onClick={showAddDialog} className="bg-green-600 text-white px-6 py-3 rounded mr-2 cursor-pointer">
                Add Window
            </button>

            <Dialog open={open} onOpenChange={setOpen} >
                <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Window Details</DialogTitle>

                        <div>
                            <input
                                type="text"
                                name="windowTitle"
                                placeholder="Window Title"
                                value={form.windowTitle}
                                onChange={handleChange}
                                className="border p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                name="windowDescription"
                                placeholder="Description"
                                value={form.windowDescription}
                                onChange={handleChange}
                                className="border p-2 mb-2 w-full"
                            />

                            {error && <p className="text-red-600 mb-4">{error}</p>}
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <button onClick={addWindow} className="bg-green-600 text-white px-4 py-2 rounded">
                            Submit
                        </button>
                        <button onClick={closeDialog} className="bg-red-600 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <hr className="my-10" />

            <h3 className="text-2xl font-semibold mb-4">Window List</h3>
            <div className="">
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Id</th>
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {windows?.length > 0 ? (
                            windows?.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-2 border">{p.id}</td>
                                    <td className="p-2 border">{p.windowTitle}</td>
                                    <td className="p-2 border">{p.windowDescription}</td>
                                    <td className="p-2 border">
                                        <Link href={`/admin/${p.id}`}>
                                            <span className='text-blue-500'>Open</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="p-4 text-gray-500">
                                    No windows avaialable
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
