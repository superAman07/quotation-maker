"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Edit, Plus, Trash2 } from "lucide-react"
// import type { Destination } from "@/lib/types"

// Define the Destination type
type Destination = {
  id: number
  name: string
  state?: string
  country?: string
  description?: string
  imageUrl?: string
}
 
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

// Mock data - replace with actual API calls
const mockDestinations: Destination[] = [
  {
    id: 1,
    name: "Goa",
    state: "Goa",
    country: "India",
    description: "Beautiful beaches and Portuguese heritage",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Kerala",
    state: "Kerala",
    country: "India",
    description: "God's own country with backwaters and spices",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Rajasthan",
    state: "Rajasthan",
    country: "India",
    description: "Land of kings with magnificent palaces",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    country: "",
    description: "",
    imageUrl: "",
  })

  const handleCreate = () => {
    const newDestination: Destination = {
      id: Math.max(...destinations.map((d) => d.id)) + 1,
      ...formData,
    }
    setDestinations([...destinations, newDestination])
    setFormData({ name: "", state: "", country: "", description: "", imageUrl: "" })
    setIsCreateOpen(false)
  }

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name,
      state: destination.state || "",
      country: destination.country || "",
      description: destination.description || "",
      imageUrl: destination.imageUrl || "",
    })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingDestination) return

    setDestinations(
      destinations.map((d) => (d.id === editingDestination.id ? { ...editingDestination, ...formData } : d)),
    )
    setIsEditOpen(false)
    setEditingDestination(null)
    setFormData({ name: "", state: "", country: "", description: "", imageUrl: "" })
  }

  const handleDelete = (id: number) => {
    setDestinations(destinations.filter((d) => d.id !== id))
  }

  // Replace the return statement with:
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-700">Destinations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-700">Destinations</h1>
            <p className="text-muted-foreground text-gray-700">Manage travel destinations</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="text-gray-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-700">Create New Destination</DialogTitle>
                <DialogDescription className="text-gray-700">Add a new travel destination to your catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2 ">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter destination name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter destination description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!formData.name}>
                  Create Destination
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border-b-black rounded-lg">
          <Table className="text-gray-700">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell className="font-medium">{destination.name}</TableCell>
                  <TableCell>{[destination.state, destination.country].filter(Boolean).join(", ")}</TableCell>
                  <TableCell className="max-w-xs truncate">{destination.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(destination)}>
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
                              This will permanently delete the destination "{destination.name}". This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(destination.id)}>Delete</AlertDialogAction>
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
              <DialogTitle>Edit Destination</DialogTitle>
              <DialogDescription>Update destination information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter destination name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Enter state"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Enter country"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter destination description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-imageUrl">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={!formData.name}>
                Update Destination
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
