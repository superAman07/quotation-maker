"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Airport {
    id: number;
    name: string;
    code: string;
    city: string;
}

export default function AirportsPage() {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAirport, setEditingAirport] = useState<Airport | null>(null);
    const [formData, setFormData] = useState({ name: "", code: "", city: "" });
    const searchParams = useSearchParams();
    const countryId = searchParams.get("countryId");

    useEffect(() => {
        if (countryId) {
            fetchAirports();
        } else {
            setIsLoading(false);
        }
    }, [countryId]);

    const fetchAirports = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/admin/airports?countryId=${countryId}`);
            setAirports(res.data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch airports.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.code || !formData.city) {
            toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
            return;
        }

        const payload = { ...formData, countryId };

        try {
            if (editingAirport) {
                await axios.put(`/api/admin/airports/${editingAirport.id}`, formData);
                toast({ title: "Success", description: "Airport updated successfully." });
            } else {
                await axios.post('/api/admin/airports', payload);
                toast({ title: "Success", description: "Airport created successfully." });
            }
            fetchAirports();
            setIsModalOpen(false);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "An unexpected error occurred.";
            toast({ title: "Error", description: errorMsg, variant: "destructive" });
        }
    };

    const handleEdit = (airport: Airport) => {
        setEditingAirport(airport);
        setFormData({ name: airport.name, code: airport.code, city: airport.city });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this airport?")) return;
        try {
            await axios.delete(`/api/admin/airports/${id}`);
            toast({ title: "Success", description: "Airport deleted successfully." });
            fetchAirports();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete airport.", variant: "destructive" });
        }
    };

    const openNewModal = () => {
        setEditingAirport(null);
        setFormData({ name: "", code: "", city: "" });
        setIsModalOpen(true);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                <Plane className="w-7 h-7 text-indigo-600" />
                Airport Management
              </CardTitle>
              <CardDescription className="mt-1 text-gray-500">
                Add, edit, or remove airports for the selected country.
              </CardDescription>
            </div>
            <Button onClick={openNewModal} className="bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Add Airport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-gray-600 font-semibold">Name</TableHead>
                  <TableHead className="text-gray-600 font-semibold">IATA Code</TableHead>
                  <TableHead className="text-gray-600 font-semibold">City</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      Loading airports...
                    </div>
                  </TableCell></TableRow>
                ) : airports.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-500">No airports found for this country.</TableCell></TableRow>
                ) : (
                  airports.map(airport => (
                    <TableRow key={airport.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => handleEdit(airport)}>
                      <TableCell className="font-medium text-gray-800">{airport.name}</TableCell>
                      <TableCell className="text-gray-600 font-mono">{airport.code}</TableCell>
                      <TableCell className="text-gray-600">{airport.city}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full" onClick={(e) => { e.stopPropagation(); handleEdit(airport); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Airport</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={(e) => { e.stopPropagation(); handleDelete(airport.id); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Airport</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-gray-600">
          <DialogHeader>
            <DialogTitle className="text-gray-800">{editingAirport ? "Edit Airport" : "Add New Airport"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-600">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right text-gray-600">IATA Code</Label>
              <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="col-span-3 font-mono" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right text-gray-600">City</Label>
              <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleSave} className="bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    );
}