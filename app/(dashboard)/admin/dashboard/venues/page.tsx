"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Edit, Plus, Trash2 } from "lucide-react"
import type { Venue, Destination } from "@/lib/types" 
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import axios from "axios"

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [destinations,setDestinations] = useState<Destination[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    coordinates: "",
    description: "",
    imageUrl: "",
    destinationId: "",
  })

  useEffect(() => {
    async function fetchData() {
      const venuesRes = await axios.get("/api/admin/venues");
      setVenues(venuesRes.data); // or .data if your API returns array directly

      const destinationsRes = await axios.get("/api/admin/destinations");
      setDestinations(destinationsRes.data.destinations);
    }
    fetchData();
  }, []);

  const handleCreate = async () => {
    const res = await axios.post("/api/admin/venues", formData);
    setVenues([...venues, res.data.venue]); // or res.data if API returns venue directly
    setFormData({ name: "", address: "", coordinates: "", description: "", imageUrl: "", destinationId: "" });
    setIsCreateOpen(false);
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue)
    setFormData({
      name: venue.name,
      address: venue.address || "",
      coordinates: venue.coordinates || "",
      description: venue.description || "",
      imageUrl: venue.imageUrl || "",
      destinationId: venue.destinationId.toString(),
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingVenue) return;
    const res = await axios.put(`/api/admin/venues/${editingVenue.id}`, formData);
    const updated = res.data.venue;  
    setVenues(venues.map(v => v.id === updated.id ? updated : v));
    setIsEditOpen(false);
    setEditingVenue(null);
    setFormData({ name: "", address: "", coordinates: "", description: "", imageUrl: "", destinationId: "" });
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/admin/venues/${id}`);
    setVenues(venues.filter(v => v.id !== id));
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center text-gray-700 gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Venues</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 text-gray-700 p-4 md:p-8 pt-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Venues</h1>
              <p className="text-muted-foreground">Manage venues within destinations</p>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Venue
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white text-gray-700">
                <DialogHeader>
                  <DialogTitle>Create New Venue</DialogTitle>
                  <DialogDescription>Add a new venue to a destination.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div className="grid gap-2 bg-white text-gray-700">
                    <Label htmlFor="destination">Destination *</Label>
                    <Select
                      value={formData.destinationId}
                      onValueChange={(value) => setFormData({ ...formData, destinationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent className="text-gray-700 bg-white">
                        {destinations.map((destination) => (
                          <SelectItem key={destination.id} value={destination.id.toString()}>
                            {destination.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter venue address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coordinates">Coordinates</Label>
                    <Input
                      id="coordinates"
                      value={formData.coordinates}
                      onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                      placeholder="e.g., 15.5557° N, 73.7516° E"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter venue description"
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
                  <Button onClick={handleCreate} disabled={!formData.name || !formData.destinationId}>
                    Create Venue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>{venue.destination?.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{venue.address}</TableCell>
                    <TableCell className="max-w-xs truncate">{venue.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(venue)}>
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
                                This will permanently delete the venue "{venue.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(venue.id)}>Delete</AlertDialogAction>
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
            <DialogContent className="max-w-2xl bg-white text-gray-700">
              <DialogHeader>
                <DialogTitle>Edit Venue</DialogTitle>
                <DialogDescription>Update venue information.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter venue name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-destination">Destination *</Label>
                  <Select
                    value={formData.destinationId}
                    onValueChange={(value) => setFormData({ ...formData, destinationId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id.toString()}>
                          {destination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter venue address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-coordinates">Coordinates</Label>
                  <Input
                    id="edit-coordinates"
                    value={formData.coordinates}
                    onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                    placeholder="e.g., 15.5557° N, 73.7516° E"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter venue description"
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
                <Button onClick={handleUpdate} disabled={!formData.name || !formData.destinationId}>
                  Update Venue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
