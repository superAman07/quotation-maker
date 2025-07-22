"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Save, X, Plus } from "lucide-react";
import axios from 'axios';
import { useParams } from 'next/navigation';

interface ItineraryItem {
  id: number;
  dayTitle: string;
  description: string;
  // quotationId: string;
}

export default function Home() {
  const params = useParams();
  const packageId = params.id;
  // Default payload data
  const [items, setItems] = useState<ItineraryItem[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ItineraryItem>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ItineraryItem, 'id'>>({
    dayTitle: '',
    description: '',
    // quotationId: ''
  });

  useEffect(() => {
    async function fetchItinerary() {
      const res = await axios.get(`/api/admin/packages/${packageId}/itinerary`);
      setItems(res.data.map((item: any) => ({
        id: item.id,
        dayTitle: `Day ${item.dayNumber}: ${item.title}`,
        description: item.description,
      })));
    }
    fetchItinerary();
  }, [packageId]);

  const handleEdit = (item: ItineraryItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async () => {
    if (editingId && editForm) {
      const [dayLabel, ...rest] = (editForm.dayTitle || '').split(':');
      const dayNumber = parseInt(dayLabel.replace(/\D/g, ''), 10);
      const title = rest.join(':').trim();

      const res = await axios.put(
        `/api/admin/packages/${packageId}/itinerary/${editingId}`,
        {
          dayNumber,
          title,
          description: editForm.description,
        }
      );

      setItems(items.map(item =>
        item.id === editingId
          ? {
            id: res.data.itinerary.id,
            dayTitle: `Day ${res.data.itinerary.dayNumber}: ${res.data.itinerary.title}`,
            description: res.data.itinerary.description,
            // quotationId: res.data.itinerary.quotationId ?? (editForm.quotationId || item.quotationId),
          }
          : item
      ));
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = async () => {
    if (newItem.dayTitle && newItem.description) {
      // Parse dayNumber and title from dayTitle
      const [dayLabel, ...rest] = newItem.dayTitle.split(':');
      const dayNumber = parseInt(dayLabel.replace(/\D/g, ''), 10);
      const title = rest.join(':').trim();

      const res = await axios.post(`/api/admin/packages/${packageId}/itinerary`, {
        dayNumber,
        title,
        description: newItem.description,
      });

      // Add new item to state
      setItems([...items, {
        id: res.data.itinerary.id,
        dayTitle: `Day ${res.data.itinerary.dayNumber}: ${res.data.itinerary.title}`,
        description: res.data.itinerary.description,
        // quotationId: res.data.itinerary.quotationId ?? newItem.quotationId,
      }]);
      setNewItem({ dayTitle: '', description: '', 
        // quotationId: '' 
      });
      setShowAddForm(false);
    }
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/admin/packages/${packageId}/itinerary/${id}`);
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Itinerary Items Manager</h1>
          <p className="text-gray-600">Manage your itinerary items with inline editing capabilities</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Itinerary Items</CardTitle>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={showAddForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Day Title</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  {/* <TableHead className="font-semibold">Quotation ID</TableHead> */}
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showAddForm && (
                  <TableRow className="bg-blue-50 border-2 border-blue-200">
                    <TableCell className="font-medium text-gray-500">New</TableCell>
                    <TableCell>
                      <Input
                        value={newItem.dayTitle}
                        onChange={(e) => setNewItem({ ...newItem, dayTitle: e.target.value })}
                        placeholder="Enter day title"
                        className="min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Enter description"
                        rows={2}
                        className="min-w-[300px] resize-none"
                      />
                    </TableCell>
                    {/* <TableCell>
                      <Input
                        value={newItem.quotationId}
                        onChange={(e) => setNewItem({ ...newItem,
                           quotationId: e.target.value
                           })}
                        placeholder="Enter quotation ID"
                        className="min-w-[120px]"
                      />
                    </TableCell> */}
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          onClick={handleAdd}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowAddForm(false);
                            setNewItem({ dayTitle: '', description: '', 
                              // quotationId: '' 
                            });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {items.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                  >
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.dayTitle || ''}
                          onChange={(e) => setEditForm({ ...editForm, dayTitle: e.target.value })}
                          className="min-w-[200px]"
                        />
                      ) : (
                        <span className="font-medium">{item.dayTitle}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Textarea
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={2}
                          className="min-w-[300px] resize-none"
                        />
                      ) : (
                        <div className="text-sm text-gray-700 max-w-[300px] line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </TableCell>
                    {/* <TableCell>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.quotationId || ''}
                          onChange={(e) => setEditForm({ ...editForm, 
                            quotationId: e.target.value
                           })}
                          className="min-w-[120px]"
                        />
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-mono">
                          {item.quotationId}
                        </span>
                      )}
                    </TableCell> */}
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        {editingId === item.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleSave}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No itinerary items yet.</p>
                <p className="text-gray-400 text-sm">Add your first item to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}