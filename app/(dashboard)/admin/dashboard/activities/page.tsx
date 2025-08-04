"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
    PlusCircle,
    Edit,
    Trash,
    X,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Activity {
    id: number;
    name: string;
    transfer: string | null;
    ticketPriceAdult: number;
    ticketPriceChild: number | null;
    countryId: number;
    country: {
        id: number;
        name: string;
        code: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface Country {
    id: number;
    name: string;
    code: string;
}

export default function ActivitiesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const countryId = searchParams.get('countryId');

    const [activities, setActivities] = useState<Activity[]>([]);
    const [country, setCountry] = useState<Country | null>(null);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [currencyConversion, setCurrencyConversion] = useState<{
        conversionRate: number;
        baseCurrency: string;
        targetCurrency: string;
    } | null>(null);

    // Form states
    const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({});

    useEffect(() => {
        const fetchData = async () => {

            let currentCountryId = countryId;
            if (!currentCountryId) {
                const savedCountryString = localStorage.getItem('selectedCountry');
                if (savedCountryString) {
                    const savedCountry = JSON.parse(savedCountryString);
                    if (savedCountry && savedCountry.id) {
                        router.push(`/admin/dashboard/activities?countryId=${savedCountry.id}`);
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

                // Fetch activities for the specific country
                const activitiesRes = await axios.get(`/api/admin/activities?countryId=${currentCountryId}`);
                setActivities(activitiesRes.data);
                setFilteredActivities(activitiesRes.data);

                // Fetch currency conversion rates
                const allConversionsRes = await axios.get(`/api/admin/country-currency`);
                const currentConversion = allConversionsRes.data.find(
                    (conv: any) => conv.countryId === parseInt(currentCountryId!)
                );

                if (currentConversion) {
                    setCurrencyConversion({
                        conversionRate: currentConversion.conversionRate,
                        baseCurrency: currentConversion.baseCurrency,
                        targetCurrency: currentConversion.targetCurrency
                    });
                }

            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load data",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [countryId, router]);

    useEffect(() => {
        let filtered = activities;

        if (searchQuery) {
            filtered = filtered.filter(activity =>
                activity.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredActivities(filtered);
    }, [searchQuery, activities]);

    // Form handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentActivity(prev => ({
            ...prev,
            [name]: name.includes('ticketPrice') ? (value === '' ? null : parseFloat(value)) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Set the countryId from the URL
        const activityData = {
            ...currentActivity,
            countryId: parseInt(countryId || '0')
        };

        try {
            setIsLoading(true);

            if (isEditing) {
                // Update existing activity
                await axios.patch(`/api/admin/activities/${activityData.id}`, activityData);
                toast({
                    title: "Success",
                    description: "Activity updated successfully",
                });
            } else {
                // Create new activity
                await axios.post('/api/admin/activities', activityData);
                toast({
                    title: "Success",
                    description: "Activity created successfully",
                });
            }

            // Refresh data
            const res = await axios.get(`/api/admin/activities?countryId=${countryId}`);
            setActivities(res.data);

            // Reset form
            setCurrentActivity({});
            setIsModalOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save activity:', error);
            toast({
                title: "Error",
                description: "Failed to save activity",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (activity: Activity) => {
        setCurrentActivity(activity);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this activity?')) return;

        try {
            setIsLoading(true);
            await axios.delete(`/api/admin/activities/${id}`);
            toast({
                title: "Success",
                description: "Activity deleted successfully",
            });

            // Remove from state
            setActivities(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete activity:', error);
            toast({
                title: "Error",
                description: "Failed to delete activity",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-600">Activities Management</h1>
                    {country && (
                        <p className="text-gray-500">Country: {country.name}</p>
                    )}
                </div>
                <Button
                    onClick={() => {
                        setCurrentActivity({});
                        setIsEditing(false);
                        setIsModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-md cursor-pointer"
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add New Activity
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-gray-600">Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 flex-1">
                        <Search className="w-4 h-4 text-gray-600" />
                        <Input
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 border-none text-gray-600 focus:ring-0 focus:border-gray-300"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Activities Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="h-[500px] overflow-auto rounded">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gradient-to-r  from-blue-600 via-purple-600 to-pink-600 text-white">
                                <tr>
                                    <th className="text-left p-4 border-b">Name</th>
                                    <th className="text-left p-4 border-b">Transfer</th>
                                    <th className="text-right p-4 border-b">Adult Ticket</th>
                                    <th className="text-right p-4 border-b">Child Ticket</th>
                                    <th className="text-center p-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-gray-600">
                                            <div className="flex justify-center">
                                                <div className="mini-loader"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredActivities.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-gray-600">
                                            No activities found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredActivities.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-200 text-gray-600">
                                            <td className="p-4 border-b">{activity.name}</td>
                                            <td className="p-4 border-b">{activity.transfer || 'N/A'}</td>
                                            <td className="p-4 border-b text-right">
                                                <div>₹{activity.ticketPriceAdult.toFixed(2)}</div>
                                                {currencyConversion && (
                                                    <div className="text-xs text-gray-500">
                                                        {(activity.ticketPriceAdult * currencyConversion.conversionRate).toFixed(2)} {currencyConversion.targetCurrency}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 border-b text-right">
                                                {activity.ticketPriceChild ? (
                                                    <>
                                                        <div>₹{activity.ticketPriceChild.toFixed(2)}</div>
                                                        {currencyConversion && (
                                                            <div className="text-xs text-gray-500">
                                                                {(activity.ticketPriceChild * currencyConversion.conversionRate).toFixed(2)} {currencyConversion.targetCurrency}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="p-4 border-b text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(activity)}
                                                    >
                                                        <Edit className="w-4 h-4 cursor-pointer" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(activity.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash className="w-4 h-4 cursor-pointer" />
                                                    </Button>
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

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-white text-gray-600 p-6 rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-indigo-600">
                                {isEditing ? 'Edit Activity' : 'Add New Activity'}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-4 h-4 cursor-pointer" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Activity Name
                                </label>
                                <Input
                                    name="name"
                                    value={currentActivity.name || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Phi Phi Island Tour"
                                    required
                                    className="text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {country && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Country
                                    </label>
                                    <Input
                                        value={country.name}
                                        disabled
                                        className="bg-gray-100 text-gray-500  text-sm"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Transfer Details
                                </label>
                                <Input
                                    name="transfer"
                                    value={currentActivity.transfer || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Included from hotel"
                                    className="text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Adult Ticket Price (INR)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="ticketPriceAdult"
                                        value={currentActivity.ticketPriceAdult || ''}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        required
                                        className="text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {currencyConversion && currentActivity.ticketPriceAdult && (
                                        <p className="text-sm text-gray-500 mt-1">
                                           ~ {(currentActivity.ticketPriceAdult * currencyConversion.conversionRate).toFixed(2)} {currencyConversion.targetCurrency}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Child Ticket Price (INR, Optional)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="ticketPriceChild"
                                        value={currentActivity.ticketPriceChild || ''}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {currencyConversion && currentActivity.ticketPriceChild && (
                                        <p className="text-sm text-gray-500 mt-1">
                                           ~ {(currentActivity.ticketPriceChild * currencyConversion.conversionRate).toFixed(2)} {currencyConversion.targetCurrency}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isLoading}
                                    className="text-sm cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="text-sm cursor-pointer font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                                >
                                    {isLoading ? 'Loading...' : isEditing ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}