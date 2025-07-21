"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react"
import type { HotelRateCard } from "@/lib/types"
import Link from "next/link"
import axios from "axios"

export default function HotelRatesPage({ params }: { params: { hotelId: string } }) {
  const hotelId = Number.parseInt(params.hotelId)
  const [rateCards, setRateCards] = useState<HotelRateCard[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingRate, setEditingRate] = useState<HotelRateCard | null>(null)
  const [formData, setFormData] = useState({
    roomType: "",
    season: "",
    rate: "",
  })

  useEffect(() => {
    async function fetchRates() {
      const res = await axios.get(`/api/admin/hotels/${hotelId}/rates`);
      setRateCards(res.data.rates);
    }
    fetchRates();
  }, [hotelId]);
  const handleCreate = async () => {
    const res = await axios.post(`/api/admin/hotels/${hotelId}/rates`, formData);
    setRateCards([...rateCards, res.data.rate]); 
    setFormData({ roomType: "", season: "", rate: "" });
    setIsCreateOpen(false);
  };

  const handleEdit = (rateCard: HotelRateCard) => {
    setEditingRate(rateCard)
    setFormData({
      roomType: rateCard.roomType,
      season: rateCard.season,
      rate: rateCard.rate.toString(),
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingRate) return;
    const res = await axios.put(`/api/admin/hotels/${hotelId}/rates/${editingRate.id}`, formData);
    const updated = res.data.rate;
    setRateCards(rateCards.map(r => r.id === updated.id ? updated : r));
    setIsEditOpen(false);
    setEditingRate(null);
    setFormData({ roomType: "", season: "", rate: "" });
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/admin/hotels/${hotelId}/rates/${id}`);
    setRateCards(rateCards.filter(r => r.id !== id));
  };

  return (
    <div className="p-6 bg-white text-gray-700">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/dashboard/hotels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotels
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Hotel Rate Cards</h1>
          <p className="text-muted-foreground">Manage room rates by season</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">Hotel ID: {hotelId}</div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2 text-gray-700" />
              Add Rate Card
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-700">
            <DialogHeader>
              <DialogTitle>Create New Rate Card</DialogTitle>
              <DialogDescription>Add a new room rate for different seasons.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Input
                  id="roomType"
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  placeholder="e.g., Deluxe Room, Suite, Standard Room"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="season">Season *</Label>
                <Input
                  id="season"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="e.g., Peak Season, Off Season, Monsoon"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rate">Rate (₹) *</Label>
                <Input
                  id="rate"
                  type="number"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="Enter rate per night"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.roomType || !formData.season || !formData.rate}>
                Create Rate Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Rate (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rateCards.map((rateCard) => (
              <TableRow key={rateCard.id}>
                <TableCell className="font-medium">{rateCard.roomType}</TableCell>
                <TableCell>{rateCard.season}</TableCell>
                <TableCell>₹{rateCard.rate.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(rateCard)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white text-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this rate card. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(rateCard.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white text-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Rate Card</DialogTitle>
            <DialogDescription>Update room rate information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-roomType">Room Type *</Label>
              <Input
                id="edit-roomType"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                placeholder="e.g., Deluxe Room, Suite, Standard Room"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-season">Season *</Label>
              <Input
                id="edit-season"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                placeholder="e.g., Peak Season, Off Season, Monsoon"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rate">Rate (₹) *</Label>
              <Input
                id="edit-rate"
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                placeholder="Enter rate per night"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.roomType || !formData.season || !formData.rate}>
              Update Rate Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
