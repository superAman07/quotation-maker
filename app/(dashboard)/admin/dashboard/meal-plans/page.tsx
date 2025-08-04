"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MealPlan {
  id: number;
  name: string;
  description: string | null;
  ratePerPerson: number;
  countryId: number;
}

interface Country {
  id: number;
  name: string;
  code: string;
  currency: string;
}

interface CurrencyConversion {
  conversionRate: number;
  baseCurrency: string;
  targetCurrency: string;
}

const mealTypes = [
  "Breakfast (CP)",
  "Breakfast + Lunch",
  "Breakfast + Dinner (MAP)",
  "Breakfast, Lunch + Dinner (AP)",
  "All Inclusive (AI)",
  "Lunch Only",
  "Dinner Only",
];

export default function MealPlansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryId = searchParams.get('countryId');
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [filteredMealPlans, setFilteredMealPlans] = useState<MealPlan[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [currencyConversion, setCurrencyConversion] = useState<CurrencyConversion | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentMealPlan, setCurrentMealPlan] = useState<Partial<MealPlan>>({});
  const [showCustomMealInput, setShowCustomMealInput] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let currentCountryId = countryId;
      if (!currentCountryId) {
        const savedCountryString = localStorage.getItem('selectedCountry');
        if (savedCountryString) {
          const savedCountry = JSON.parse(savedCountryString);
          if (savedCountry && savedCountry.id) {
            router.push(`/admin/dashboard/meal-plans?countryId=${savedCountry.id}`);
            return;
          }
        }
        router.push('/admin/dashboard');
        return;
      }

      const savedCountryString = localStorage.getItem('selectedCountry');
      if (savedCountryString) {
        setCountry(JSON.parse(savedCountryString));
      }

      try {
        setIsLoading(true);
        const [plansRes, conversionsRes] = await Promise.all([
          axios.get(`/api/admin/meal-plans?countryId=${currentCountryId}`),
          axios.get(`/api/admin/country-currency`)
        ]);

        setMealPlans(plansRes.data);
        setFilteredMealPlans(plansRes.data);

        const currentConversion = conversionsRes.data.find(
          (conv: any) => conv.countryId === parseInt(currentCountryId!)
        );
        if (currentConversion) {
          setCurrencyConversion(currentConversion);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [countryId, router]);

  useEffect(() => {
    let filtered = mealPlans.filter(plan =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMealPlans(filtered);
  }, [searchQuery, mealPlans]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentMealPlan(prev => ({ ...prev, [name]: value }));
  }; 

  const handleSelectChange = (value: string) => {
    if (value === "Custom") {
      setShowCustomMealInput(true);
      setCurrentMealPlan(prev => ({ ...prev, name: '' })); // Clear name for custom input
    } else {
      setShowCustomMealInput(false);
      setCurrentMealPlan(prev => ({ ...prev, name: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMealPlan.name || !currentMealPlan.ratePerPerson) {
      return toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
    }

    const payload = {
      ...currentMealPlan,
      ratePerPerson: parseFloat(String(currentMealPlan.ratePerPerson)),
      countryId: parseInt(countryId!),
    };

    try {
      setIsLoading(true);
      let updatedPlans;
      if (isEditing) {
        const res = await axios.put(`/api/admin/meal-plans/${currentMealPlan.id}`, payload);
        updatedPlans = mealPlans.map(p => p.id === res.data.id ? res.data : p);
        toast({ title: "Success", description: "Meal plan updated successfully." });
      } else {
        const res = await axios.post('/api/admin/meal-plans', payload);
        updatedPlans = [...mealPlans, res.data];
        toast({ title: "Success", description: "Meal plan created successfully." });
      }
      setMealPlans(updatedPlans);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save meal plan:', error);
      const errorMsg = error.response?.data?.error || "An unexpected error occurred.";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (plan: MealPlan) => {
    const isStandardType = mealTypes.includes(plan.name);
    setShowCustomMealInput(!isStandardType);
    setCurrentMealPlan(plan);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this meal plan? This action cannot be undone.")){
      try {
        await axios.delete(`/api/admin/meal-plans/${id}`);
        setMealPlans(prev => prev.filter(p => p.id !== id));
        toast({ title: "Success", description: "Meal plan deleted successfully." });
      } catch (error) {
        console.error('Failed to delete meal plan:', error);
        toast({ title: "Error", description: "Failed to delete meal plan.", variant: "destructive" });
      }
    }
  };

  const openCreateModal = () => {
    setCurrentMealPlan({});
    setShowCustomMealInput(false);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-600">Meal Plans Management</h1>
          {country && <p className="text-gray-500">Country: {country.name}</p>}
        </div>
        <Button onClick={openCreateModal} className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-md">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Meal Plan
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3"><CardTitle className="text-gray-600">Search</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-600" />
            <Input
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none text-gray-600 focus:ring-0"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-700 text-white">
                <tr>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-right p-4 font-medium">Rate Per Person</th>
                  <th className="text-center p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center text-gray-600 p-4"><div className="flex justify-center"><div className="mini-loader"></div></div></td></tr>
                ) : filteredMealPlans.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-600 p-4">No meal plans found.</td></tr>
                ) : (
                  filteredMealPlans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-gray-50 ">
                      <td className="p-4 font-medium text-gray-600">{plan.name}</td>
                      <td className="p-4 text-gray-600">{plan.description || 'N/A'}</td>
                      <td className="p-4 text-right">
                        <div className="font-medium text-gray-600">₹{plan.ratePerPerson.toFixed(2)}</div>
                        {currencyConversion && (
                          <div className="text-xs text-gray-500">
                            {(plan.ratePerPerson * currencyConversion.conversionRate).toFixed(2)} {currencyConversion.targetCurrency}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}><Edit className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-700" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)} className="text-red-500 hover:text-red-700 cursor-pointer"><Trash className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-indigo-500">{isEditing ? 'Edit Meal Plan' : 'Add New Meal Plan'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full"><X className="w-4 h-4 cursor-pointer text-gray-600" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Meal Type</label>
                <Select onValueChange={handleSelectChange} value={showCustomMealInput ? "Custom" : currentMealPlan.name || ""}>
                  <SelectTrigger className="focus:ring-2 focus:ring-indigo-500 text-gray-600 cursor-pointer">
                    <SelectValue placeholder="Select a meal type" />
                  </SelectTrigger>
                  <SelectContent className="text-gray-600 bg-white cursor-pointer">
                    {mealTypes.map(type => <SelectItem className="cursor-pointer" key={type} value={type}>{type}</SelectItem>)}
                    <SelectItem value="Custom">Custom...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showCustomMealInput && (
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Custom Meal Name</label>
                  <Input
                    name="name"
                    value={currentMealPlan.name || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Jain Meal, Vegan Dinner"
                    required
                    className="text-sm focus:ring-2 focus:ring-indigo-500 text-gray-600"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Description</label>
                <Textarea
                  name="description"
                  value={currentMealPlan.description || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Includes a buffet breakfast with a variety of options."
                  className="text-sm focus:ring-2 focus:ring-indigo-500 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Rate Per Person (INR)</label>
                <Input
                  type="number"
                  name="ratePerPerson"
                  value={currentMealPlan.ratePerPerson || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  className="text-sm focus:ring-2 focus:ring-indigo-500 text-gray-600"
                />
                {currencyConversion && currentMealPlan.ratePerPerson && (
                  <p className="text-xs text-gray-500 mt-1">
                    ~ {(Number(currentMealPlan.ratePerPerson) * currencyConversion.conversionRate).toFixed(2)} {currencyConversion.targetCurrency}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" className="text-gray-600 cursor-pointer" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="font-semibold cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md">
                  {isLoading ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}