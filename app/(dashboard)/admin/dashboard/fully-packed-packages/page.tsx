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
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FullyPackedPackage {
  id: number;
  name: string;
  description?: string;
  destination: {
    id: number;
    name: string;
  };
  mealPlan?: string;
  vehicleUsed?: string;
  localVehicleUsed?: string;
  flightCostPerPerson?: number;
  landCostPerPerson?: number;
  totalNights?: number;
  accommodations: Array<{
    id: number;
    location: string;
    hotelName: string;
    nights: number;
  }>;
  itinerary: Array<{
    id: number;
    dayTitle: string;
    description: string;
  }>;
  inclusions: Array<{
    id: number;
    item: string;
  }>;
  exclusions: Array<{
    id: number;
    item: string;
  }>;
}

interface Destination {
  id: number;
  name: string;
  state?: string;
  country?: string;
}

export default function FullyPackedPackagesPage() {
  const [packages, setPackages] = useState<FullyPackedPackage[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [flightRoutes, setFlightRoutes] = useState<{
    id: number;
    origin: string;
    destination: string;
    baseFare: number;
    airline: string;
    imageUrl: string;
  }[]>([])
  const [mealPlans, setMealPlans] = useState<{ id: number; code: string; description: string }[]>([])
  const [vehicles, setVehicles] = useState<{ id: number; name: string; type?: string }[]>([])
  const [hotels, setHotels] = useState<{
    id: number;
    name: string;
    starRating?: number;
    amenities?: string;
    imageUrl?: string;
    venueId?: number;
    venue?: {
      id: number;
      name: string;
      address: string;
      coordinates?: string;
      description?: string;
      imageUrl?: string;
      destinationId?: number;
    };
  }[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<FullyPackedPackage | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destinationId: "",
    destinationCustom: "",
    mealPlan: "",
    mealPlanCustom: "",
    vehicleUsed: "",
    vehicleUsedCustom: "",
    localVehicleUsed: "",
    localVehicleUsedCustom: "",
    flightCostPerPerson: "",
    landCostPerPerson: "",
    totalNights: "",
    accommodations: [{ location: "", hotelName: "", hotelNameCustom: "", nights: 1 }],
    itinerary: [{ dayTitle: "", description: "" }],
    inclusions: [{ item: "" }],
    exclusions: [{ item: "" }],
  })

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await axios.get('/api/admin/fully-packed-packages');
        setPackages(res.data);
      } catch (error) {
        console.error('Failed to fetch fully packed packages:', error);
        setPackages([]);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await axios.get('/api/admin/destinations');
        setDestinations(res.data.destinations);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        setDestinations([]);
      }
    }
    fetchDestinations();
  }, []);

  useEffect(() => {
    async function fetchFlightRoutes() {
      try {
        const res = await axios.get('/api/admin/flight-routes');
        setFlightRoutes(res.data.routes);
      } catch (error) {
        console.error('Failed to fetch flight routes:', error);
        setFlightRoutes([]);
      }
    }
    fetchFlightRoutes();
  }, []);

  useEffect(() => {
    async function fetchMealPlans() {
      try {
        const res = await axios.get('/api/admin/meal-plans');
        setMealPlans(res.data);
      } catch (error) {
        console.error('Failed to fetch meal plans:', error);
        setMealPlans([]);
      }
    }
    fetchMealPlans();
  }, []);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await axios.get('/api/admin/vehicle-types');
        setVehicles(res.data);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        setVehicles([]);
      }
    }
    fetchVehicles();
  }, []);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await axios.get('/api/admin/hotels');
        setHotels(res.data.hotels);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
        setHotels([]);
      }
    }
    fetchHotels();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await axios.post('/api/admin/fully-packed-packages', {
        ...formData,
        destinationId: parseInt(formData.destinationId),
        flightCostPerPerson: parseFloat(formData.flightCostPerPerson) || 0,
        landCostPerPerson: parseFloat(formData.landCostPerPerson) || 0,
        totalNights: parseInt(formData.totalNights) || 0,
        accommodations: formData.accommodations.filter(acc => acc.location && acc.hotelName),
        itinerary: formData.itinerary.filter(item => item.dayTitle && item.description),
        inclusions: formData.inclusions.filter(item => item.item),
        exclusions: formData.exclusions.filter(item => item.item),
      });
      setPackages([...packages, res.data]);
      resetForm();
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Failed to create fully packed package:', error);
      alert('Failed to create package. Please try again.');
    }
  };

  const handleEdit = (pkg: FullyPackedPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      destinationId: pkg.destination.id.toString(),
      destinationCustom: "",
      mealPlan: pkg.mealPlan || "",
      mealPlanCustom: "",
      vehicleUsed: pkg.vehicleUsed || "",
      vehicleUsedCustom: "",
      localVehicleUsed: pkg.localVehicleUsed || "",
      localVehicleUsedCustom: "",
      flightCostPerPerson: pkg.flightCostPerPerson?.toString() || "",
      landCostPerPerson: pkg.landCostPerPerson?.toString() || "",
      totalNights: pkg.totalNights?.toString() || "",
      accommodations: pkg.accommodations.length > 0 ? pkg.accommodations.map(acc => ({
        location: acc.location,
        hotelName: acc.hotelName,
        hotelNameCustom: "",
        nights: acc.nights,
      })) : [{ location: "", hotelName: "", hotelNameCustom: "", nights: 1 }],
      itinerary: pkg.itinerary.length > 0 ? pkg.itinerary.map(item => ({
        dayTitle: item.dayTitle,
        description: item.description,
      })) : [{ dayTitle: "", description: "" }],
      inclusions: pkg.inclusions.length > 0 ? pkg.inclusions.map(item => ({
        item: item.item,
      })) : [{ item: "" }],
      exclusions: pkg.exclusions.length > 0 ? pkg.exclusions.map(item => ({
        item: item.item,
      })) : [{ item: "" }],
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingPackage) return;
    try {
      const res = await axios.put(`/api/admin/fully-packed-packages/${editingPackage.id}`, {
        ...formData,
        destinationId: parseInt(formData.destinationId),
        flightCostPerPerson: parseFloat(formData.flightCostPerPerson) || 0,
        landCostPerPerson: parseFloat(formData.landCostPerPerson) || 0,
        totalNights: parseInt(formData.totalNights) || 0,
        accommodations: formData.accommodations.filter(acc => acc.location && acc.hotelName),
        itinerary: formData.itinerary.filter(item => item.dayTitle && item.description),
        inclusions: formData.inclusions.filter(item => item.item),
        exclusions: formData.exclusions.filter(item => item.item),
      });
      const updated = res.data;
      setPackages(packages.map((p) => p.id === updated.id ? updated : p));
      setIsEditOpen(false);
      setEditingPackage(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update fully packed package:', error);
      alert('Failed to update package. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/fully-packed-packages/${id}`);
      setPackages(packages.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete fully packed package:', error);
      alert('Failed to delete package. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      destinationId: "",
      destinationCustom: "",
      mealPlan: "",
      mealPlanCustom: "",
      vehicleUsed: "",
      vehicleUsedCustom: "",
      localVehicleUsed: "",
      localVehicleUsedCustom: "",
      flightCostPerPerson: "",
      landCostPerPerson: "",
      totalNights: "",
      accommodations: [{ location: "", hotelName: "", hotelNameCustom: "", nights: 1 }],
      itinerary: [{ dayTitle: "", description: "" }],
      inclusions: [{ item: "" }],
      exclusions: [{ item: "" }],
    });
  };

  const addAccommodation = () => {
    setFormData(prev => ({
      ...prev,
      accommodations: [...prev.accommodations, { location: "", hotelName: "", hotelNameCustom: "", nights: 1 }]
    }));
  };

  const removeAccommodation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter((_, i) => i !== index)
    }));
  };

  const updateAccommodation = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updatedAccommodations = prev.accommodations.map((acc, i) =>
        i === index ? { ...acc, [field]: value } : acc
      );
      
      // Auto-calculate total nights if nights field is updated
      if (field === 'nights') {
        const totalNights = updatedAccommodations.reduce((sum, acc) => sum + (acc.nights || 0), 0);
        return {
          ...prev,
          accommodations: updatedAccommodations,
          totalNights: totalNights.toString()
        };
      }
      
      return {
        ...prev,
        accommodations: updatedAccommodations
      };
    });
  };

  const addItineraryItem = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { dayTitle: "", description: "" }]
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const updateItineraryItem = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addInclusion = () => {
    setFormData(prev => ({
      ...prev,
      inclusions: [...prev.inclusions, { item: "" }]
    }));
  };

  const removeInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const updateInclusion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.map((item, i) =>
        i === index ? { ...item, item: value } : item
      )
    }));
  };

  const addExclusion = () => {
    setFormData(prev => ({
      ...prev,
      exclusions: [...prev.exclusions, { item: "" }]
    }));
  };

  const removeExclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  const updateExclusion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.map((item, i) =>
        i === index ? { ...item, item: value } : item
      )
    }));
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white text-gray-700">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Fully Packed Packages</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white text-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fully Packed Packages</h1>
            <p className="text-muted-foreground">Manage complete quotation templates for destinations</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Fully Packed Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-white text-gray-700 overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Fully Packed Package</DialogTitle>
                <DialogDescription>Add a complete quotation template for a destination.</DialogDescription>
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
                <div className="grid gap-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <select
                    id="destination"
                    value={formData.destinationId}
                    onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                    className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select destination...</option>
                    {destinations.map(dest => (
                      <option key={dest.id} value={dest.id}>
                        {dest.name} {dest.state ? `(${dest.state})` : ''}
                      </option>
                    ))}
                    <option value="__custom">Other (Add new)</option>
                  </select>
                  {formData.destinationId === "__custom" && (
                    <Input
                      value={formData.destinationCustom || ""}
                      onChange={(e) => setFormData({ ...formData, destinationCustom: e.target.value })}
                      placeholder="Enter custom destination"
                      className="mt-1 focus:ring-green-500 focus:border-green-500"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mealPlan">Meal Plan</Label>
                    <select
                      id="mealPlan"
                      value={formData.mealPlan}
                      onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                      className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select meal plan...</option>
                      {mealPlans.map(plan => (
                        <option key={plan.id} value={plan.code}>
                          {plan.code} {plan.description ? `- ${plan.description}` : ""}
                        </option>
                      ))}
                      <option value="__custom">Other (Add new)</option>
                    </select>
                    {formData.mealPlan === "__custom" && (
                      <Input
                        value={formData.mealPlanCustom || ""}
                        onChange={(e) => setFormData({ ...formData, mealPlanCustom: e.target.value })}
                        placeholder="Enter custom meal plan"
                        className="mt-1 focus:ring-green-500 focus:border-green-500"
                      />
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleUsed">Airline/Flight Route</Label>
                    <select
                      id="vehicleUsed"
                      value={formData.vehicleUsed}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selectedRoute = flightRoutes.find(route => route.id === selectedId);
                        setFormData({
                          ...formData,
                          vehicleUsed: e.target.value,
                          flightCostPerPerson: selectedRoute ? selectedRoute.baseFare.toString() : "0",
                        });
                      }}
                      className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select airline...</option>
                      {flightRoutes.map(route => (
                        <option key={route.id} value={route.id}>
                          {route.airline} ({route.origin} → {route.destination})
                        </option>
                      ))}
                      <option value="__custom">Other (Add new)</option>
                    </select>
                    {formData.vehicleUsed === "__custom" && (
                      <Input
                        value={formData.vehicleUsedCustom || ""}
                        onChange={(e) => setFormData({ ...formData, vehicleUsedCustom: e.target.value })}
                        placeholder="Enter custom airline"
                        className="mt-1 focus:ring-green-500 focus:border-green-500"
                      />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="localVehicleUsed">Local Vehicle</Label>
                    <select
                      id="localVehicleUsed"
                      value={formData.localVehicleUsed}
                      onChange={(e) => setFormData({ ...formData, localVehicleUsed: e.target.value })}
                      className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select local vehicle...</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.name}>
                          {vehicle.name} {vehicle.type ? `${vehicle.type}` : ""}
                        </option>
                      ))}
                      <option value="__custom">Other (Add new)</option>
                    </select>
                    {formData.localVehicleUsed === "__custom" && (
                      <Input
                        value={formData.localVehicleUsedCustom || ""}
                        onChange={(e) => setFormData({ ...formData, localVehicleUsedCustom: e.target.value })}
                        placeholder="Enter custom local vehicle"
                        className="mt-1 focus:ring-green-500 focus:border-green-500"
                      />
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="flightCostPerPerson">Flight Cost (₹)</Label>
                    <Input
                      id="flightCostPerPerson"
                      type="number"
                      value={formData.flightCostPerPerson}
                      onChange={(e) => setFormData({ ...formData, flightCostPerPerson: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="landCostPerPerson">Land Cost (₹)</Label>
                    <Input
                      id="landCostPerPerson"
                      type="number"
                      value={formData.landCostPerPerson}
                      onChange={(e) => setFormData({ ...formData, landCostPerPerson: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="totalNights">Total Nights</Label>
                  <Input
                    id="totalNights"
                    type="number"
                    value={formData.totalNights}
                    onChange={(e) => setFormData({ ...formData, totalNights: e.target.value })}
                    placeholder="0"
                  />
                  {(() => {
                    const accommodationNights = formData.accommodations.reduce((sum, acc) => sum + (acc.nights || 0), 0);
                    const totalNights = parseInt(formData.totalNights) || 0;
                    if (accommodationNights > 0 && accommodationNights !== totalNights) {
                      return (
                        <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 font-medium">
                          Warning: Total nights ({totalNights}) do not match accommodation nights ({accommodationNights}). Please review!
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Accommodations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Accommodations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.accommodations.map((acc, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={acc.location}
                            onChange={(e) => updateAccommodation(index, 'location', e.target.value)}
                            placeholder="e.g. Leh, Ladakh"
                          />
                        </div>
                        <div>
                          <Label>Hotel Name</Label>
                          <select
                            value={acc.hotelName}
                            onChange={(e) => {
                              const selectedHotel = hotels.find(h => h.name === e.target.value);
                              if (e.target.value !== "__custom" && selectedHotel?.venue?.address) {
                                setFormData(prev => ({
                                  ...prev,
                                  accommodations: prev.accommodations.map((accommodation, i) =>
                                    i === index
                                      ? { ...accommodation, hotelName: e.target.value, location: selectedHotel.venue?.address || "" }
                                      : accommodation
                                  )
                                }));
                              } else if (e.target.value === "__custom") {
                                setFormData(prev => ({
                                  ...prev,
                                  accommodations: prev.accommodations.map((accommodation, i) =>
                                    i === index
                                      ? { ...accommodation, hotelName: e.target.value, location: '' }
                                      : accommodation
                                  )
                                }));
                              } else {
                                updateAccommodation(index, 'hotelName', e.target.value);
                              }
                            }}
                            className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="">Select hotel...</option>
                            {hotels.map(hotel => (
                              <option key={hotel.id} value={hotel.name}>
                                {hotel.name}
                                {hotel.venue?.name && ` - ${hotel.venue.name}`}
                              </option>
                            ))}
                            <option value="__custom">Other (Add new)</option>
                          </select>
                          {acc.hotelName === "__custom" && (
                            <Input
                              value={acc.hotelNameCustom || ""}
                              onChange={(e) => updateAccommodation(index, 'hotelNameCustom', e.target.value)}
                              placeholder="Enter custom hotel name"
                              className="mt-1 focus:ring-green-500 focus:border-green-500"
                            />
                          )}
                        </div>
                        <div>
                          <Label>Nights</Label>
                          <Input
                            type="number"
                            value={acc.nights}
                            onChange={(e) => updateAccommodation(index, 'nights', parseInt(e.target.value) || 1)}
                            min="1"
                          />
                        </div>
                        {formData.accommodations.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeAccommodation(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addAccommodation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Accommodation
                    </Button>
                  </CardContent>
                </Card>

                {/* Itinerary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.itinerary.map((item, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg">
                        <div>
                          <Label>Day Title</Label>
                          <Input
                            value={item.dayTitle}
                            onChange={(e) => updateItineraryItem(index, 'dayTitle', e.target.value)}
                            placeholder="e.g. Day 1: Arrival in Leh"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                            placeholder="Enter day description"
                            rows={3}
                          />
                        </div>
                        {formData.itinerary.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeItineraryItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addItineraryItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Itinerary Item
                    </Button>
                  </CardContent>
                </Card>

                {/* Inclusions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Inclusions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.inclusions.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item.item}
                          onChange={(e) => updateInclusion(index, e.target.value)}
                          placeholder="Enter inclusion item"
                        />
                        {formData.inclusions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeInclusion(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addInclusion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Inclusion
                    </Button>
                  </CardContent>
                </Card>

                {/* Exclusions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exclusions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.exclusions.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item.item}
                          onChange={(e) => updateExclusion(index, e.target.value)}
                          placeholder="Enter exclusion item"
                        />
                        {formData.exclusions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeExclusion(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addExclusion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exclusion
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!formData.name || !formData.destinationId}
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
                <TableHead>Destination</TableHead>
                <TableHead>Land Cost</TableHead>
                <TableHead>Flight Cost</TableHead>
                <TableHead>Nights</TableHead>
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
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {pkg.destination.name}
                    </div>
                  </TableCell>
                  <TableCell>₹{pkg.landCostPerPerson?.toLocaleString() || '0'}</TableCell>
                  <TableCell>₹{pkg.flightCostPerPerson?.toLocaleString() || '0'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {pkg.totalNights || 0}N
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{pkg.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)}>
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
                              This will permanently delete the fully packed package "{pkg.name}". This action cannot be undone.
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
          <DialogContent className="max-w-4xl max-h-[90vh] bg-white text-gray-700 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Fully Packed Package</DialogTitle>
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
              <div className="grid gap-2">
                <Label htmlFor="edit-destination">Destination *</Label>
                <select
                  id="edit-destination"
                  value={formData.destinationId}
                  onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                  className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select destination...</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name} {dest.state ? `(${dest.state})` : ''}
                    </option>
                  ))}
                  <option value="__custom">Other (Add new)</option>
                </select>
                {formData.destinationId === "__custom" && (
                  <Input
                    value={formData.destinationCustom || ""}
                    onChange={(e) => setFormData({ ...formData, destinationCustom: e.target.value })}
                    placeholder="Enter custom destination"
                    className="mt-1 focus:ring-green-500 focus:border-green-500"
                  />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-mealPlan">Meal Plan</Label>
                  <Input
                    id="edit-mealPlan"
                    value={formData.mealPlan}
                    onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                    placeholder="e.g. MAP, AP, CP"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-vehicleUsed">Airline/Flight Route</Label>
                  <select
                    id="edit-vehicleUsed"
                    value={formData.vehicleUsed}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selectedRoute = flightRoutes.find(route => route.id === selectedId);
                      setFormData({
                        ...formData,
                        vehicleUsed: e.target.value,
                        flightCostPerPerson: selectedRoute ? selectedRoute.baseFare.toString() : "0",
                      });
                    }}
                    className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select airline...</option>
                    {flightRoutes.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.airline} ({route.origin} → {route.destination})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-localVehicleUsed">Local Vehicle</Label>
                  <Input
                    id="edit-localVehicleUsed"
                    value={formData.localVehicleUsed}
                    onChange={(e) => setFormData({ ...formData, localVehicleUsed: e.target.value })}
                    placeholder="e.g. Innova"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-flightCostPerPerson">Flight Cost (₹)</Label>
                  <Input
                    id="edit-flightCostPerPerson"
                    type="number"
                    value={formData.flightCostPerPerson}
                    onChange={(e) => setFormData({ ...formData, flightCostPerPerson: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-landCostPerPerson">Land Cost (₹)</Label>
                  <Input
                    id="edit-landCostPerPerson"
                    type="number"
                    value={formData.landCostPerPerson}
                    onChange={(e) => setFormData({ ...formData, landCostPerPerson: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-totalNights">Total Nights</Label>
                <Input
                  id="edit-totalNights"
                  type="number"
                  value={formData.totalNights}
                  onChange={(e) => setFormData({ ...formData, totalNights: e.target.value })}
                  placeholder="0"
                />
                {(() => {
                  const accommodationNights = formData.accommodations.reduce((sum, acc) => sum + (acc.nights || 0), 0);
                  const totalNights = parseInt(formData.totalNights) || 0;
                  if (accommodationNights > 0 && accommodationNights !== totalNights) {
                    return (
                      <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 font-medium">
                        Warning: Total nights ({totalNights}) do not match accommodation nights ({accommodationNights}). Please review!
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Accommodations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accommodations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.accommodations.map((acc, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={acc.location}
                          onChange={(e) => updateAccommodation(index, 'location', e.target.value)}
                          placeholder="e.g. Leh, Ladakh"
                        />
                      </div>
                      <div>
                        <Label>Hotel Name</Label>
                        <select
                          value={acc.hotelName}
                          onChange={(e) => updateAccommodation(index, 'hotelName', e.target.value)}
                          className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select hotel...</option>
                          {hotels.map(hotel => (
                            <option key={hotel.id} value={hotel.name}>
                              {hotel.name}
                              {hotel.venue?.name && ` - ${hotel.venue.name}`}
                            </option>
                          ))}
                          <option value="__custom">Other (Add new)</option>
                        </select>
                        {acc.hotelName === "__custom" && (
                          <Input
                            value={acc.hotelNameCustom || ""}
                            onChange={(e) => updateAccommodation(index, 'hotelNameCustom', e.target.value)}
                            placeholder="Enter custom hotel name"
                            className="mt-1 focus:ring-green-500 focus:border-green-500"
                          />
                        )}
                      </div>
                      <div>
                        <Label>Nights</Label>
                        <Input
                          type="number"
                          value={acc.nights}
                          onChange={(e) => updateAccommodation(index, 'nights', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                      {formData.accommodations.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeAccommodation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addAccommodation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Accommodation
                  </Button>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.itinerary.map((item, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-lg">
                      <div>
                        <Label>Day Title</Label>
                        <Input
                          value={item.dayTitle}
                          onChange={(e) => updateItineraryItem(index, 'dayTitle', e.target.value)}
                          placeholder="e.g. Day 1: Arrival in Leh"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                          placeholder="Enter day description"
                          rows={3}
                        />
                      </div>
                      {formData.itinerary.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeItineraryItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addItineraryItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Itinerary Item
                  </Button>
                </CardContent>
              </Card>

              {/* Inclusions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inclusions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.inclusions.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item.item}
                        onChange={(e) => updateInclusion(index, e.target.value)}
                        placeholder="Enter inclusion item"
                      />
                      {formData.inclusions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeInclusion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addInclusion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Inclusion
                  </Button>
                </CardContent>
              </Card>

              {/* Exclusions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exclusions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.exclusions.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item.item}
                        onChange={(e) => updateExclusion(index, e.target.value)}
                        placeholder="Enter exclusion item"
                      />
                      {formData.exclusions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeExclusion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addExclusion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exclusion
                  </Button>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!formData.name || !formData.destinationId}
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