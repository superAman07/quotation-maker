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
import { Edit, Plus, Trash2 } from "lucide-react"
import type { FlightRoute } from "@/lib/types"
import axios from "axios"

// Mock data
const mockFlightRoutes: FlightRoute[] = [
  {
    id: 1,
    origin: "Delhi",
    destination: "Mumbai",
    baseFare: 8500,
    airline: "Air India",
  },
  {
    id: 2,
    origin: "Mumbai",
    destination: "Goa",
    baseFare: 6200,
    airline: "IndiGo",
  },
  {
    id: 3,
    origin: "Delhi",
    destination: "Jaipur",
    baseFare: 4800,
    airline: "SpiceJet",
  },
]

export default function FlightRoutesPage() {
  const [flightRoutes, setFlightRoutes] = useState<FlightRoute[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<FlightRoute | null>(null)
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    baseFare: "",
    airline: "",
    imageUrl: "",
  })

  useEffect(() => {
    async function fetchData() {
      const flightRoutes = await axios.get('/api/admin/flight-routes')
      setFlightRoutes(flightRoutes.data.routes);
    }
    fetchData();
  }, [])

  const handleCreate = async () => {
    const res = await axios.post('/api/admin/flight-routes', {
      ...formData,
      baseFare: parseFloat(formData.baseFare),
    });
    setFlightRoutes([...flightRoutes, res.data])
    setFormData({ origin: "", destination: "", baseFare: "", airline: "", imageUrl: "" })
    setIsCreateOpen(false)
  }

  const handleEdit = (route: FlightRoute) => {
    setEditingRoute(route)
    setFormData({
      origin: route.origin,
      destination: route.destination,
      baseFare: route.baseFare.toString(),
      airline: route.airline || "",
      imageUrl: route.imageUrl || "",
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingRoute) return

    const res = await axios.put(`/api/admin/flight-routes/${editingRoute.id}`, {
      ...formData,
      baseFare: parseFloat(formData.baseFare),
    });
    const updated = res.data.flightRoute;
    setFlightRoutes(flightRoutes.map(r => r.id === updated.id ? updated : r));
    setIsEditOpen(false);
    setEditingRoute(null);
    setFormData({ origin: "", destination: "", baseFare: "", airline: "", imageUrl: "" });
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/admin/flight-routes/${id}`);
    setFlightRoutes(flightRoutes.filter(r => r.id !== id));
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white text-gray-700">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flight Routes</h1>
          <p className="text-muted-foreground">Manage flight routes and fares</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Flight Route
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-700">
            <DialogHeader>
              <DialogTitle>Create New Flight Route</DialogTitle>
              <DialogDescription>Add a new flight route with fare information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="origin">Origin *</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g., Delhi"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g., Mumbai"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="baseFare">Base Fare (₹) *</Label>
                  <Input
                    id="baseFare"
                    type="number"
                    value={formData.baseFare}
                    onChange={(e) => setFormData({ ...formData, baseFare: e.target.value })}
                    placeholder="8500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="airline">Airline</Label>
                  <Input
                    id="airline"
                    value={formData.airline}
                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                    placeholder="e.g., Air India"
                  />
                </div>
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
              <Button onClick={handleCreate} disabled={!formData.origin || !formData.destination || !formData.baseFare}>
                Create Route
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Airline</TableHead>
              <TableHead>Base Fare</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flightRoutes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">
                  {route.origin} → {route.destination}
                </TableCell>
                <TableCell>{route.airline || "N/A"}</TableCell>
                <TableCell>{typeof route.baseFare === "number"
                  ? `₹${route.baseFare.toLocaleString()}`
                  : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(route)}>
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
                            This will permanently delete the flight route "{route.origin} → {route.destination}". This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(route.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>Edit Flight Route</DialogTitle>
            <DialogDescription>Update flight route information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-origin">Origin *</Label>
                <Input
                  id="edit-origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g., Delhi"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-destination">Destination *</Label>
                <Input
                  id="edit-destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g., Mumbai"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-baseFare">Base Fare (₹) *</Label>
                <Input
                  id="edit-baseFare"
                  type="number"
                  value={formData.baseFare}
                  onChange={(e) => setFormData({ ...formData, baseFare: e.target.value })}
                  placeholder="8500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-airline">Airline</Label>
                <Input
                  id="edit-airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  placeholder="e.g., Air India"
                />
              </div>
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
            <Button onClick={handleUpdate} disabled={!formData.origin || !formData.destination || !formData.baseFare}>
              Update Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
