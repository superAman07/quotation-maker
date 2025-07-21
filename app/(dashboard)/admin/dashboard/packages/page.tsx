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
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2, Route } from "lucide-react"
import type { Package } from "@/lib/types"
import Link from "next/link" 
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
 
const mockPackages: Package[] = [
  {
    id: 1,
    name: "Golden Triangle Tour",
    description: "Delhi, Agra, Jaipur - Classic India tour covering the most iconic destinations",
    durationDays: 7,
    basePricePerPerson: 25000,
    totalNights: 6,
  },
  {
    id: 2,
    name: "Kerala Backwaters Experience",
    description: "Explore the serene backwaters of Kerala with houseboat stays",
    durationDays: 5,
    basePricePerPerson: 18000,
    totalNights: 4,
  },
  {
    id: 3,
    name: "Goa Beach Holiday",
    description: "Relax on pristine beaches with water sports and nightlife",
    durationDays: 4,
    basePricePerPerson: 12000,
    totalNights: 3,
  },
]

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationDays: "",
    basePricePerPerson: "",
    totalNights: "",
  })

  const handleCreate = () => {
    const newPackage: Package = {
      id: Math.max(...packages.map((p) => p.id)) + 1,
      name: formData.name,
      description: formData.description || undefined,
      durationDays: Number.parseInt(formData.durationDays),
      basePricePerPerson: Number.parseFloat(formData.basePricePerPerson),
      totalNights: Number.parseInt(formData.totalNights),
    }
    setPackages([...packages, newPackage])
    setFormData({ name: "", description: "", durationDays: "", basePricePerPerson: "", totalNights: "" })
    setIsCreateOpen(false)
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      durationDays: pkg.durationDays.toString(),
      basePricePerPerson: pkg.basePricePerPerson.toString(),
      totalNights: pkg.totalNights.toString(),
    })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingPackage) return

    setPackages(
      packages.map((p) =>
        p.id === editingPackage.id
          ? {
              ...p,
              name: formData.name,
              description: formData.description || undefined,
              durationDays: Number.parseInt(formData.durationDays),
              basePricePerPerson: Number.parseFloat(formData.basePricePerPerson),
              totalNights: Number.parseInt(formData.totalNights),
            }
          : p,
      ),
    )
    setIsEditOpen(false)
    setEditingPackage(null)
    setFormData({ name: "", description: "", durationDays: "", basePricePerPerson: "", totalNights: "" })
  }

  const handleDelete = (id: number) => {
    setPackages(packages.filter((p) => p.id !== id))
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        {/* <SidebarTrigger className="-ml-1" /> */}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Packages</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Travel Packages</h1>
            <p className="text-muted-foreground">Manage pre-built travel packages</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Package</DialogTitle>
                <DialogDescription>Add a new travel package to your catalog.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter package name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter package description"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="durationDays">Duration (Days) *</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      placeholder="7"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="totalNights">Total Nights *</Label>
                    <Input
                      id="totalNights"
                      type="number"
                      value={formData.totalNights}
                      onChange={(e) => setFormData({ ...formData, totalNights: e.target.value })}
                      placeholder="6"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="basePricePerPerson">Base Price (₹) *</Label>
                    <Input
                      id="basePricePerPerson"
                      type="number"
                      value={formData.basePricePerPerson}
                      onChange={(e) => setFormData({ ...formData, basePricePerPerson: e.target.value })}
                      placeholder="25000"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={
                    !formData.name || !formData.durationDays || !formData.totalNights || !formData.basePricePerPerson
                  }
                >
                  Create Package
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {pkg.durationDays}D/{pkg.totalNights}N
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>₹{pkg.basePricePerPerson.toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{pkg.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/packages/${pkg.id}/itinerary`}>
                          <Route className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)}>
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
                              This will permanently delete the package "{pkg.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(pkg.id)}>Delete</AlertDialogAction>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Package</DialogTitle>
              <DialogDescription>Update package information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Package Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter package name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter package description"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-durationDays">Duration (Days) *</Label>
                  <Input
                    id="edit-durationDays"
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    placeholder="7"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-totalNights">Total Nights *</Label>
                  <Input
                    id="edit-totalNights"
                    type="number"
                    value={formData.totalNights}
                    onChange={(e) => setFormData({ ...formData, totalNights: e.target.value })}
                    placeholder="6"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-basePricePerPerson">Base Price (₹) *</Label>
                  <Input
                    id="edit-basePricePerPerson"
                    type="number"
                    value={formData.basePricePerPerson}
                    onChange={(e) => setFormData({ ...formData, basePricePerPerson: e.target.value })}
                    placeholder="25000"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={
                  !formData.name || !formData.durationDays || !formData.totalNights || !formData.basePricePerPerson
                }
              >
                Update Package
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
