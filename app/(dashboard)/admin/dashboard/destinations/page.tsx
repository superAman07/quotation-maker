"use client"

import { useEffect, useState } from "react"
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
import { Edit, Plus, Trash2, MapPin, Globe, ImageIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import axios from "axios"
import { useSearchParams } from "next/navigation"

type Destination = {
  id: number
  name: string
  state?: string
  description?: string
  imageUrl?: string
}

// Custom Toast Component (as requested by user)
const Toast = ({
  message,
  type,
  onClose,
}: { message: string; type: "success" | "error" | "info"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#3B82F6"

  return (
    <div
      className="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-top-2"
      style={{ backgroundColor: bgColor }}
    >
      {message}
    </div>
  )
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    description: "",
    imageUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
  const searchParams = useSearchParams()
  const countryId = searchParams.get("countryId")

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type })
  }

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get(`/api/admin/destinations?countryId=${countryId}`)
        setDestinations(res.data.destinations)
      } catch {
        setDestinations([])
        showToast("Failed to load destinations", "error")
      } finally {
        setLoading(false)
      }
    }
    if (countryId) fetchDestinations()
  }, [countryId])

  const handleCreate = async () => {
    try {
      const res = await axios.post("/api/admin/destinations", {
        ...formData,
        countryId,
      })
      if (res.status === 201) {
        setDestinations([...destinations, res.data])
        setFormData({ name: "", state: "", description: "", imageUrl: "" })
        setIsCreateOpen(false)
        showToast("Destination created successfully!", "success")
      }
    } catch {
      showToast("Failed to create destination", "error")
    }
  }

  const handleEdit = async (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name,
      state: destination.state || "",
      description: destination.description || "",
      imageUrl: destination.imageUrl || "",
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/api/admin/destinations/${editingDestination?.id}`, formData)
      const updated = await res.data
      if (res.status !== 200) {
        showToast("Failed to update destination", "error")
        return
      }
      setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
      setIsEditOpen(false)
      setEditingDestination(null)
      setFormData({ name: "", state: "", description: "", imageUrl: "" })
      showToast("Destination updated successfully!", "success")
    } catch {
      showToast("Failed to update destination", "error")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`/api/admin/destinations/${id}`)
      if (res.status !== 200) {
        showToast("Failed to delete destination", "error")
        return
      }
      setDestinations((prev) => prev.filter((d) => d.id !== id))
      showToast("Destination deleted successfully!", "success")
    } catch {
      showToast("Failed to delete destination", "error")
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-700 font-medium">Destinations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header> */}

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Destinations</h1>
                <p className="text-slate-600">Manage your travel destinations with ease</p>
              </div>
            </div>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-0 shadow-2xl max-w-2xl">
              <DialogHeader className="pb-6 text-gray-600">
                <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  Create New Destination
                </DialogTitle>
                <DialogDescription className="text-slate-600 text-base">
                  Add a new travel destination to your catalog and inspire travelers.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Destination Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter destination name"
                    className="border-slate-300 text-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="state" className="text-slate-700 font-medium">
                    State/Province
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Enter state or province"
                    className="border-slate-300 text-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description" className="text-slate-700 font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what makes this destination special..."
                    className="border-slate-300 text-gray-600 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="imageUrl" className="text-slate-700 font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image URL <span className="text-gray-400"> (Optional)</span>
                  </Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                    className="border-slate-300 text-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <DialogFooter className="pt-6 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-slate-300 cursor-pointer text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!formData.name}
                  className="cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  Create Destination
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 text-slate-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-lg">Loading destinations...</span>
              </div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No destinations found</h3>
              <p className="text-slate-500">Start by adding your first destination</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <TableHead className="font-semibold text-slate-700">Destination</TableHead>
                  <TableHead className="font-semibold text-slate-700">Location</TableHead>
                  <TableHead className="font-semibold text-slate-700">Description</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination, index) => (
                  <TableRow
                    key={destination.id}
                    className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                  >
                    <TableCell className="font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {destination.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {destination.state && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                          <MapPin className="h-3 w-3" />
                          {destination.state}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs text-slate-600">
                      <div className="truncate">{destination.description}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(destination)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border-0 shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold text-slate-800">
                                Delete Destination?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-600 text-base">
                                This will permanently delete "{destination.name}" from your destinations. This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-3">
                              <AlertDialogCancel className="border-slate-300 text-slate-700 hover:bg-slate-50">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(destination.id)}
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-white border-0 shadow-2xl max-w-2xl">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Edit className="h-6 w-6 text-orange-600" />
                Edit Destination
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-base">
                Update destination information and details.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label htmlFor="edit-name" className="text-slate-700 font-medium">
                  Destination Name *
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter destination name"
                  className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-state" className="text-slate-700 font-medium">
                  State/Province
                </Label>
                <Input
                  id="edit-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter state or province"
                  className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-description" className="text-slate-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what makes this destination special..."
                  className="border-slate-300 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-imageUrl" className="text-slate-700 font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image URL
                </Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Enter image URL"
                  className="border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <DialogFooter className="pt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!formData.name}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
              >
                Update Destination
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}



// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Edit, Plus, Trash2 } from "lucide-react"
// type Destination = {
//   id: number
//   name: string
//   state?: string 
//   description?: string
//   imageUrl?: string
// }

// import { Separator } from "@/components/ui/separator"
// import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
// import axios from "axios"
// import { useSearchParams } from "next/navigation"


// export default function DestinationsPage() {
//   const [destinations, setDestinations] = useState<Destination[]>([])
//   const [isCreateOpen, setIsCreateOpen] = useState(false)
//   const [isEditOpen, setIsEditOpen] = useState(false)
//   const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
//   const [formData, setFormData] = useState({
//     name: "",
//     state: "", 
//     description: "",
//     imageUrl: "",
//   })
//   const [loading, setLoading] = useState(true);

//   const searchParams = useSearchParams();
//   const countryId = searchParams.get("countryId");

//   useEffect(() => {
//     const fetchDestinations = async () => {
//       try {
//         const res = await axios.get(`/api/admin/destinations?countryId=${countryId}`);
//         setDestinations(res.data.destinations);
//       } catch {
//         setDestinations([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (countryId) fetchDestinations();
//   }, [countryId]);

//   const handleCreate = async () => {
//     const res = await axios.post("/api/admin/destinations", {
//       ...formData,
//       countryId,
//     })
//     if (res.status === 201) {
//       setDestinations([...destinations, res.data]);
//       setFormData({ name: "", state: "", description: "", imageUrl: "" });
//       setIsCreateOpen(false);
//     }
//   }

//   const handleEdit = async (destination: Destination) => {
//     setEditingDestination(destination);
//     setFormData({
//       name: destination.name,
//       state: destination.state || "",
//       description: destination.description || "",
//       imageUrl: destination.imageUrl || "",
//     });
//     setIsEditOpen(true);
//   }

//   const handleUpdate = async () => {
//     const res = await axios.put(`/api/admin/destinations/${editingDestination?.id}`, formData)
//     const updated = await res.data;
//     if (res.status !== 200) {
//       console.error("Failed to update destination");
//       return;
//     }
//     setDestinations(prev => prev.map(d => d.id === updated.id ? updated : d));
//     setIsEditOpen(false);
//     setEditingDestination(null);
//     setFormData({ name: "", state: "", country: "", description: "", imageUrl: "" });
//   }

//   const handleDelete = async (id: number) => {
//     const res = await axios.delete(`/api/admin/destinations/${id}`)
//     if (res.status !== 200) {
//       console.error("Failed to delete destination");
//       return;
//     }
//     setDestinations(prev => prev.filter(d => d.id !== id));
//   }

//   return (
//     <>
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbPage className="text-gray-700">Destinations</BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//       </header>

//       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-gray-700">Destinations</h1>
//             <p className="text-muted-foreground text-gray-700">Manage travel destinations</p>
//           </div>

//           <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//             <DialogTrigger asChild>
//               <Button className="text-gray-700">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Destination
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="bg-white text-gray-700">
//               <DialogHeader>
//                 <DialogTitle className="text-gray-700">Create New Destination</DialogTitle>
//                 <DialogDescription className="text-gray-700">Add a new travel destination to your catalog.</DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid gap-2 ">
//                   <Label htmlFor="name">Name *</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="Enter destination name"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="state">State</Label>
//                     <Input
//                       id="state"
//                       value={formData.state}
//                       onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                       placeholder="Enter state"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     placeholder="Enter destination description"
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="imageUrl">Image URL</Label>
//                   <Input
//                     id="imageUrl"
//                     value={formData.imageUrl}
//                     onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
//                     placeholder="Enter image URL"
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleCreate} disabled={!formData.name}>
//                   Create Destination
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="border-b-black rounded-lg">
//           {loading ? (
//             <div className="text-center py-10 text-gray-500">Loading destinations...</div>
//           ) : (
//             <Table className="text-gray-700">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Location</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {destinations.map((destination) => (
//                   <TableRow key={destination.id}>
//                     <TableCell className="font-medium">{destination.name}</TableCell> 
//                     <TableCell>{destination.state}</TableCell>
//                     <TableCell className="max-w-xs truncate">{destination.description}</TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button variant="outline" size="sm" onClick={() => handleEdit(destination)}>
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="outline" size="sm">
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent className="bg-white text-gray-700">
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This will permanently delete the destination "{destination.name}". This action cannot be
//                                 undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction onClick={() => handleDelete(destination.id)}>Delete</AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </div>

//         {/* Edit Dialog */}
//         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
//           <DialogContent className="bg-white text-gray-700">
//             <DialogHeader>
//               <DialogTitle>Edit Destination</DialogTitle>
//               <DialogDescription>Update destination information.</DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-name">Name *</Label>
//                 <Input
//                   id="edit-name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   placeholder="Enter destination name"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="edit-state">State</Label>
//                   <Input
//                     id="edit-state"
//                     value={formData.state}
//                     onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                     placeholder="Enter state"
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="edit-country">Country</Label>
//                   <Input
//                     id="edit-country"
//                     value={formData.country}
//                     onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//                     placeholder="Enter country"
//                   />
//                 </div>
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-description">Description</Label>
//                 <Textarea
//                   id="edit-description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   placeholder="Enter destination description"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-imageUrl">Image URL</Label>
//                 <Input
//                   id="edit-imageUrl"
//                   value={formData.imageUrl}
//                   onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
//                   placeholder="Enter image URL"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsEditOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleUpdate} disabled={!formData.name}>
//                 Update Destination
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   )
// }
