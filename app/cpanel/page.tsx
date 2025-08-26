'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { 
    Plus, 
    Users, 
    Settings, 
    LogOut,
    User,
    Shield
} from 'lucide-react'

type QueeWindow = {
    id: number
    windowTitle: string
    windowDescription: string
}

export default function Cpanel() {
    const [windows, setWindows] = useState<QueeWindow[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const [form, setForm] = useState({
        windowTitle: '',
        windowDescription: '',
    })

    const [error, setError] = useState('')

    useEffect(() => {
        checkAuth()
        fetchWindow()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me')
            if (response.ok) {
                const data = await response.json()
                setCurrentUser(data.user)
                if (data.user.role !== 'admin') {
                    router.push('/login')
                    return
                }
            } else {
                router.push('/login')
                return
            }
        } catch (error) {
            router.push('/login')
            return
        } finally {
            setIsLoading(false)
        }
    }

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
        fetchWindow()
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Settings className="h-8 w-8 text-blue-600" />
                            <h1 className="text-xl font-semibold text-gray-900">Control Panel</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome, {currentUser?.fullName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Link href="/admin/users" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                                <p className="text-sm text-gray-600">Manage users and permissions</p>
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Settings className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Window Management</h3>
                                <p className="text-sm text-gray-600">Create and manage service windows</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">System Status</h3>
                                <p className="text-sm text-gray-600">Monitor system health</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Window Management Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Window Management</h2>
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Window</span>
                        </button>
                    </div>

                    {/* Windows List */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Window
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {windows.map((window) => (
                                    <tr key={window.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {window.windowTitle}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {window.windowDescription}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                href={`/queue/${window.id}`}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                View Queue
                                            </Link>
                                            <button className="text-gray-600 hover:text-gray-900">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Window Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Window</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Window Title
                            </label>
                            <input
                                type="text"
                                name="windowTitle"
                                value={form.windowTitle}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter window title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                name="windowDescription"
                                value={form.windowDescription}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter window description"
                            />
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={addWindow}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Add Window
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
