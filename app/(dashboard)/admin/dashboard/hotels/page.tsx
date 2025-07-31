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
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2, Star, DollarSign } from "lucide-react"
import type { Hotel, Venue } from "@/lib/types"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import axios from "axios"
import { useSearchParams } from "next/navigation"

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  // const [venues, setVenues] = useState<Venue[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    starRating: "",
    amenities: "",
    imageUrl: "",
    destinationId: "",
  })
  const searchParams = useSearchParams();
  const countryId = searchParams.get("countryId");

  useEffect(() => {
  async function fetchDestinations() {
    if (!countryId) return;
    const res = await axios.get(`/api/admin/destinations?countryId=${countryId}`);
    setDestinations(res.data.destinations);
  }
  fetchDestinations();
}, [countryId]);

  useEffect(() => {
    async function fetchData() {
      // const venuesRes = await axios.get("/api/admin/venues");
      // console.log("Fetched venues:", venuesRes.data.venues);
      // setVenues(venuesRes.data);

      if (!countryId) return;
      const res = await axios.get(`/api/admin/hotels?countryId=${countryId}`);
      setHotels(res.data.hotels);
    }
    fetchData();
  }, []);

  const handleCreate = async () => {
    const res = await axios.post("/api/admin/hotels", {
      ...formData,
      countryId: countryId,
    });
    setHotels([...hotels, res.data.hotel]);
    setFormData({ name: "", starRating: "", amenities: "", imageUrl: "", destinationId: "" });
    setIsCreateOpen(false);
  }

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      starRating: hotel.starRating?.toString() || "",
      amenities: hotel.amenities || "",
      imageUrl: hotel.imageUrl || "",
      destinationId: hotel.destinationId?.toString() || "",
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingHotel) return
    const res = await axios.put(`/api/admin/hotels/${editingHotel.id}`, formData);
    const updated = res.data.hotel;
    setHotels(hotels.map((h) => h.id === updated.id ? updated : h));
    setIsEditOpen(false);
    setEditingHotel(null);
    setFormData({ name: "", starRating: "", amenities: "", imageUrl: "", destinationId: "" });
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/admin/hotels/${id}`);
    setHotels(hotels.filter(h => h.id !== id));
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        {/* <SidebarTrigger className="-ml-1" /> */}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Hotels</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 text-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Hotels</h1>
            <p className="text-muted-foreground">Manage hotel catalog and accommodations</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white text-gray-700">
              <DialogHeader>
                <DialogTitle>Create New Hotel</DialogTitle>
                <DialogDescription>Add a new hotel to your catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter hotel name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* <div className="grid gap-2 ">
                    <Label htmlFor="venue">Venue *</Label>
                    <Select
                      value={formData.venueId}
                      onValueChange={(value) => setFormData({ ...formData, venueId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select venue" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-700">
                        {venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id.toString()}>
                            {venue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> */}
                  <div className="grid gap-2">
                    <Label htmlFor="destinationId">Destination *</Label>
                    <Select
                      value={formData.destinationId}
                      onValueChange={(value) => setFormData({ ...formData, destinationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-700">
                        {destinations.map((destination) => (
                          <SelectItem key={destination.id} value={destination.id.toString()}>
                            {destination.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="starRating">Star Rating</Label>
                    <Select
                      value={formData.starRating}
                      onValueChange={(value) => setFormData({ ...formData, starRating: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-700">
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <Textarea
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="Enter hotel amenities (comma separated)"
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
                  Create Hotel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel Name</TableHead>
                {/* <TableHead>Venue</TableHead> */}
                <TableHead>Rating</TableHead>
                <TableHead>Amenities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  {/* <TableCell>{hotel.venue?.name}</TableCell> */}
                  <TableCell>{renderStars(hotel.starRating)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities
                        ?.split(",")
                        .slice(0, 3)
                        .map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity.trim()}
                          </Badge>
                        ))}
                      {hotel.amenities && hotel.amenities.split(",").length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hotel.amenities.split(",").length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/dashboard/hotels/${hotel.id}/rates`}>
                          <DollarSign className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(hotel)}>
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
                              This will permanently delete the hotel "{hotel.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(hotel.id)}>Delete</AlertDialogAction>
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
              <DialogTitle>Edit Hotel</DialogTitle>
              <DialogDescription>Update hotel information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Hotel Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter hotel name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="grid gap-2">
                  <Label htmlFor="edit-venue">Venue *</Label>
                  <Select
                    value={formData.venueId}
                    onValueChange={(value) => setFormData({ ...formData, venueId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700">
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id.toString()}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="edit-starRating">Star Rating</Label>
                  <Select
                    value={formData.starRating}
                    onValueChange={(value) => setFormData({ ...formData, starRating: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700">
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-amenities">Amenities</Label>
                <Textarea
                  id="edit-amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Enter hotel amenities (comma separated)"
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
                Update Hotel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
