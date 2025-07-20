"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2 } from "lucide-react"
import type { VehicleType, VehicleCategory } from "@/lib/types"

// Mock data
const mockVehicles: VehicleType[] = [
  {
    id: 1,
    type: "Sedan",
    category: "INTERCITY" as VehicleCategory,
    ratePerDay: 2500,
    ratePerKm: 12,
  },
  {
    id: 2,
    type: "SUV",
    category: "INTERCITY" as VehicleCategory,
    ratePerDay: 4000,
    ratePerKm: 18,
  },
  {
    id: 3,
    type: "Auto Rickshaw",
    category: "LOCAL" as VehicleCategory,
    ratePerKm: 8,
  },
  {
    id: 4,
    type: "Taxi",
    category: "LOCAL" as VehicleCategory,
    ratePerKm: 15,
  },
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleType[]>(mockVehicles)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<VehicleType | null>(null)
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    ratePerDay: "",
    ratePerKm: "",
  })

  const handleCreate = () => {
    const newVehicle: VehicleType = {
      id: Math.max(...vehicles.map((v) => v.id)) + 1,
      type: formData.type,
      category: formData.category as VehicleCategory,
      ratePerDay: formData.ratePerDay ? Number.parseFloat(formData.ratePerDay) : undefined,
      ratePerKm: formData.ratePerKm ? Number.parseFloat(formData.ratePerKm) : undefined,
    }
    setVehicles([...vehicles, newVehicle])
    setFormData({ type: "", category: "", ratePerDay: "", ratePerKm: "" })
    setIsCreateOpen(false)
  }

  const handleEdit = (vehicle: VehicleType) => {
    setEditingVehicle(vehicle)
    setFormData({
      type: vehicle.type,
      category: vehicle.category,
      ratePerDay: vehicle.ratePerDay?.toString() || "",
      ratePerKm: vehicle.ratePerKm?.toString() || "",
    })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingVehicle) return

    setVehicles(
      vehicles.map((v) =>
        v.id === editingVehicle.id
          ? {
              ...v,
              type: formData.type,
              category: formData.category as VehicleCategory,
              ratePerDay: formData.ratePerDay ? Number.parseFloat(formData.ratePerDay) : undefined,
              ratePerKm: formData.ratePerKm ? Number.parseFloat(formData.ratePerKm) : undefined,
            }
          : v,
      ),
    )
    setIsEditOpen(false)
    setEditingVehicle(null)
    setFormData({ type: "", category: "", ratePerDay: "", ratePerKm: "" })
  }

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage vehicle types and rates</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Vehicle Type</DialogTitle>
              <DialogDescription>Add a new vehicle type with pricing information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Sedan, SUV, Auto Rickshaw"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERCITY">Intercity</SelectItem>
                    <SelectItem value="LOCAL">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ratePerDay">Rate per Day (₹)</Label>
                  <Input
                    id="ratePerDay"
                    type="number"
                    value={formData.ratePerDay}
                    onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
                    placeholder="2500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ratePerKm">Rate per KM (₹)</Label>
                  <Input
                    id="ratePerKm"
                    type="number"
                    value={formData.ratePerKm}
                    onChange={(e) => setFormData({ ...formData, ratePerKm: e.target.value })}
                    placeholder="12"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.type || !formData.category}>
                Create Vehicle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rate per Day</TableHead>
              <TableHead>Rate per KM</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.type}</TableCell>
                <TableCell>
                  <Badge variant={vehicle.category === "INTERCITY" ? "default" : "secondary"}>{vehicle.category}</Badge>
                </TableCell>
                <TableCell>{vehicle.ratePerDay ? `₹${vehicle.ratePerDay.toLocaleString()}` : "N/A"}</TableCell>
                <TableCell>{vehicle.ratePerKm ? `₹${vehicle.ratePerKm}` : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the vehicle type "{vehicle.type}". This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(vehicle.id)}>Delete</AlertDialogAction>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle Type</DialogTitle>
            <DialogDescription>Update vehicle type information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Vehicle Type *</Label>
              <Input
                id="edit-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Sedan, SUV, Auto Rickshaw"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERCITY">Intercity</SelectItem>
                  <SelectItem value="LOCAL">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-ratePerDay">Rate per Day (₹)</Label>
                <Input
                  id="edit-ratePerDay"
                  type="number"
                  value={formData.ratePerDay}
                  onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
                  placeholder="2500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-ratePerKm">Rate per KM (₹)</Label>
                <Input
                  id="edit-ratePerKm"
                  type="number"
                  value={formData.ratePerKm}
                  onChange={(e) => setFormData({ ...formData, ratePerKm: e.target.value })}
                  placeholder="12"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.type || !formData.category}>
              Update Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
