"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import axios from "axios"

interface Country {
    id: string
    name: string
    flag: string
    currency: string
    currencyCode: string
    conversionRate: number
}

interface Transfer {
    id: string
    type: string
    priceInINR: number
    countryId: string
    createdAt: string
    updatedAt: string
    country?: Country
}

export default function TransfersDashboard() {
    const [transfers, setTransfers] = useState<Transfer[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null)
    const [formData, setFormData] = useState({
        type: "",
        priceInINR: "",
        countryId: "",
    })

    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [conversionRate, setConversionRate] = useState(1);
    const [currencyCode, setCurrencyCode] = useState("INR");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("selectedCountry");
            setSelectedCountry(stored ? JSON.parse(stored) : null);
        }
    }, []);

    useEffect(() => {
        if (selectedCountry?.id) {
            axios.get(`/api/admin/country-currency?countryId=${selectedCountry.id}`)
                .then(res => {
                    const currencyData = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
                    setConversionRate(currencyData?.conversionRate || 1);
                    setCurrencyCode(currencyData?.currencyCode || "INR");
                });
        }
    }, [selectedCountry]);

    useEffect(() => {
        const stored = localStorage.getItem("selectedCountry")
        if (stored) {
            const country = JSON.parse(stored);
            setFormData((prev) => ({ ...prev, countryId: country.id }));
        }
    }, [isModalOpen])

    useEffect(() => {
        async function fetchTransfers() {
            if (selectedCountry?.id) {
                const res = await axios.get(`/api/admin/transfer?countryId=${selectedCountry.id}`);
                setTransfers(res.data);
            }
        }
        fetchTransfers()
    }, [selectedCountry])

    const filteredTransfers = transfers.filter((transfer) =>
        transfer.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAddTransfer = () => {
        setEditingTransfer(null);
        setFormData({
            type: "",
            priceInINR: "",
            countryId: selectedCountry?.id || "",
        });
        setIsModalOpen(true);
    };

    const handleEditTransfer = (transfer: Transfer) => {
        setEditingTransfer(transfer)
        setFormData({
            type: transfer.type,
            priceInINR: transfer.priceInINR.toString(),
            countryId: transfer.countryId,
        })
        setIsModalOpen(true)
    }

    const handleSaveTransfer = async () => {
        if (!formData.type || !formData.priceInINR || !formData.countryId) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" })
            return
        }

        const transferData = {
            type: formData.type,
            priceInINR: Number.parseFloat(formData.priceInINR),
            countryId: formData.countryId,
        }

        try {
            if (editingTransfer) {
                await axios.put(`/api/admin/transfer/${editingTransfer.id}`, transferData)
                toast({ title: "Transfer Updated", description: "Transfer has been successfully updated.", className: "bg-green-50 border-green-200 text-green-800" })
            } else {
                await axios.post("/api/admin/transfer", transferData)
                toast({ title: "Transfer Added", description: "New transfer has been successfully added.", className: "bg-green-50 border-green-200 text-green-800" })
            }
            const res = await axios.get("/api/admin/transfer")
            setTransfers(res.data)
            setIsModalOpen(false)
            setFormData({ type: "", priceInINR: "", countryId: "" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to save transfer.", variant: "destructive" })
        }
    }

    const handleDeleteTransfer = async (id: string) => {
        try {
            await axios.delete(`/api/admin/transfer/${id}`)
            toast({ title: "Transfer Deleted", description: "Transfer has been successfully deleted.", className: "bg-red-50 border-red-200 text-red-800" })
            const res = await axios.get("/api/admin/transfer")
            setTransfers(res.data)
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete transfer.", variant: "destructive" })
        }
    }

    const convertedPrice = selectedCountry && formData.priceInINR ? (Number(formData.priceInINR) * conversionRate).toFixed(2) : "0.00";

    return (
        <div className="min-h-screen text-gray-600 bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-yellow-400 to-purple-700 text-transparent bg-clip-text mb-2">Transfer Management</h1>
                    <p className="bg-gradient-to-r from-blue-500 via-yellow-400 to-purple-700 text-transparent bg-clip-text">Manage your travel transfer services efficiently</p>
                </div>

                {/* Controls */}
                <div className="bg-gray-100 rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative flex-1 bg-white max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search transfers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={handleAddTransfer}
                                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Transfer
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white text-gray-600">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {editingTransfer ? "Edit Transfer" : "Add New Transfer"}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div>
                                        <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                            Transfer Type
                                        </Label>
                                        <Input
                                            id="type"
                                            placeholder="e.g., Airport to Hotel"
                                            value={formData.type}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                                            className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                            Price (INR)
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="2500"
                                            value={formData.priceInINR}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, priceInINR: e.target.value }))}
                                            className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                            Country
                                        </Label>
                                        {selectedCountry ? (
                                            <div className="flex items-center gap-2 mt-1 p-2 rounded bg-gray-50 border border-gray-200">
                                                <span className="text-lg">{selectedCountry.flag}</span>
                                                <span>{selectedCountry.name}</span>
                                                <span className="text-gray-500">({currencyCode})</span>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">No country selected</div>
                                        )}
                                    </div>
                                    {selectedCountry && formData.priceInINR && (
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-800">
                                                <span className="font-medium">Converted Price:</span> {selectedCountry.currencyCode}{" "}
                                                {convertedPrice}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            onClick={handleSaveTransfer}
                                            className="flex-1 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all duration-200"
                                        >
                                            {editingTransfer ? "Update" : "Save"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded shadow-xl overflow-hidden">
                    <div className="h-96 overflow-hidden">
                        <div className="h-full overflow-y-auto">
                            <table className="w-full">
                                <thead
                                    className="sticky top-0 z-10"
                                    style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
                                >
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Transfer Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Country</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Created</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Updated</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredTransfers.length === 0 ? (
    <tr>
      <td colSpan={6} className="py-10 text-center text-gray-500">
        No transfers found for this country.
      </td>
    </tr>
  ) : (
                                    (filteredTransfers.map((transfer, index) => {
                                        const converted = transfer.priceInINR && conversionRate
                                            ? (transfer.priceInINR * conversionRate).toLocaleString(undefined, { maximumFractionDigits: 2 })
                                            : "0";
                                        return (
                                            <tr
                                                key={transfer.id}
                                                className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{transfer.type}</div>
                                                </td>
                                                {/* Price */}
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-900">
                                                        <div className="font-semibold">₹{transfer.priceInINR.toLocaleString()}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {currencyCode} {converted}
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Country */}
                                                <td className="px-6 py-4">
                                                    {transfer.country && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{transfer.country.flag}</span>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{transfer.country.name}</div>
                                                                <div className="text-sm text-gray-500">{currencyCode}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{new Date(transfer.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-gray-600">{new Date(transfer.updatedAt).toLocaleDateString()}</td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleEditTransfer(transfer)}
                                                            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleDeleteTransfer(transfer.id)}
                                                            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Transfers</p>
                                <p className="text-3xl font-bold text-gray-900">{transfers.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Avg. Price (INR)</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{Math.round(transfers.reduce((sum, t) => sum + t.priceInINR, 0) / transfers.length).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">💰</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
