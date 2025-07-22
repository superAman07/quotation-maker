"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Edit, Plus, Trash2, X, Settings, Percent, Tag } from "lucide-react"
import axios from "axios"

// Types for pricing rules
interface MarkupRule {
  id: number
  serviceType: string
  percentage: number
}

interface Discount {
  id: number
  code: string
  description?: string
  percentage: number
  validFrom: string
  validTo: string
}

interface Tax {
  id: number
  serviceType: string
  percentage: number
}

// Form data interfaces
interface MarkupRuleFormData {
  serviceType: string
  percentage: number
}

interface DiscountFormData {
  code: string
  description: string
  percentage: number
  validFrom: string
  validTo: string
}

interface TaxFormData {
  serviceType: string
  percentage: number
}

export default function PricingRules() {
  const [activeTab, setActiveTab] = useState<"markup" | "discount" | "tax">("markup")

  // State for all data - replace mock data with these variables
  const [markupRules, setMarkupRules] = useState<MarkupRule[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [taxes, setTaxes] = useState<Tax[]>([
    { id: 1, serviceType: "HOTEL", percentage: 12 },
    { id: 2, serviceType: "FLIGHT", percentage: 5 },
    { id: 3, serviceType: "VEHICLE", percentage: 18 },
  ])

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form state
  const [markupFormData, setMarkupFormData] = useState<MarkupRuleFormData>({
    serviceType: "",
    percentage: 0
  })
  const [discountFormData, setDiscountFormData] = useState<DiscountFormData>({
    code: "",
    description: "",
    percentage: 0,
    validFrom: "",
    validTo: ""
  })
  const [taxFormData, setTaxFormData] = useState<TaxFormData>({
    serviceType: "",
    percentage: 0
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const serviceTypes = ["HOTEL", "FLIGHT", "VEHICLE", "PACKAGE", "MEAL"]

  useEffect(() => {
    async function fetchMarkupRules() {
      try {
        const res = await axios.get('/api/admin/markup-rules');
        setMarkupRules(res.data);
      } catch (error) {
        console.error('Failed to fetch markup rules:', error);
      }
    }
    fetchMarkupRules();
  }, []);

  useEffect(() => {
    async function fetchDiscounts() {
      const res = await axios.get('/api/admin/discounts');
      setDiscounts(res.data);
    }
    fetchDiscounts();
  }, []);

  // Reset form data
  const resetFormData = () => {
    setMarkupFormData({ serviceType: "", percentage: 0 })
    setDiscountFormData({ code: "", description: "", percentage: 0, validFrom: "", validTo: "" })
    setTaxFormData({ serviceType: "", percentage: 0 })
  }

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    resetFormData()
    setIsSubmitting(false)
  }

  // Open modal for adding
  const openAddModal = () => {
    setModalMode("add")
    resetFormData()
    setIsModalOpen(true)
  }

  // Open modal for editing
  const openEditModal = (item: any) => {
    setModalMode("edit")
    setEditingItem(item)

    if (activeTab === "markup") {
      setMarkupFormData({
        serviceType: item.serviceType,
        percentage: item.percentage
      })
    } else if (activeTab === "discount") {
      setDiscountFormData({
        code: item.code,
        description: item.description || "",
        percentage: item.percentage,
        validFrom: item.validFrom,
        validTo: item.validTo
      })
    } else if (activeTab === "tax") {
      setTaxFormData({
        serviceType: item.serviceType,
        percentage: item.percentage
      })
    }

    setIsModalOpen(true)
  }

  // Markup Rule handlers
  const handleMarkupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (modalMode === "add") {
        const res = await axios.post('/api/admin/markup-rules', markupFormData);
        setMarkupRules([...markupRules, res.data]);
      } else {
        const res = await axios.put(`/api/admin/markup-rules/${editingItem.id}`, markupFormData);
        setMarkupRules(markupRules.map(rule =>
          rule.id === editingItem.id ? res.data : rule
        ));
      }
      closeModal()
    } catch (error) {
      console.error('Failed to save markup rule:', error);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMarkupRule = async (id: number) => {
    if (confirm('Are you sure you want to delete this markup rule?')) {
      try {
        await axios.delete(`/api/admin/markup-rules/${id}`);
        setMarkupRules(markupRules.filter(rule => rule.id !== id));
      } catch (error) {
        console.error('Failed to delete markup rule:', error);
      }
    }
  }

  // Discount handlers (similar structure)
  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalMode === "add") {
        const res = await axios.post('/api/admin/discounts', discountFormData);
        setDiscounts([...discounts, res.data]);
      } else {
        const res = await axios.put(`/api/admin/discounts/${editingItem.id}`, discountFormData);
        setDiscounts(discounts.map(discount =>
          discount.id === editingItem.id ? res.data : discount
        ));
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save discount:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      await axios.delete(`/api/admin/discounts/${id}`);
      setDiscounts(discounts.filter(discount => discount.id !== id));
    }
  };

  // Tax handlers (similar structure)
  const handleTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (modalMode === "add") {
        // Simulate API call for now
        const newTax = {
          id: Date.now(),
          ...taxFormData
        }
        setTaxes([...taxes, newTax]);
      } else {
        setTaxes(taxes.map(tax =>
          tax.id === editingItem.id ? { ...editingItem, ...taxFormData } : tax
        ));
      }
      closeModal()
    } catch (error) {
      console.error('Failed to save tax rule:', error);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTax = (id: number) => {
    if (confirm('Are you sure you want to delete this tax rule?')) {
      setTaxes(taxes.filter(tax => tax.id !== id));
    }
  }

  // Get modal title and icon
  const getModalTitle = () => {
    const action = modalMode === "add" ? "Add New" : "Edit"
    if (activeTab === "markup") return `${action} Markup Rule`
    if (activeTab === "discount") return `${action} Discount Code`
    if (activeTab === "tax") return `${action} Tax Rule`
  }

  const getModalIcon = () => {
    if (activeTab === "markup") return <Percent className="h-5 w-5 text-blue-600" />
    if (activeTab === "discount") return <Tag className="h-5 w-5 text-green-600" />
    if (activeTab === "tax") return <Settings className="h-5 w-5 text-purple-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Rules</h1>
              <p className="text-gray-600">Manage markups, discounts, and tax rates for your services</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Settings className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("markup")}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "markup"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <Percent className="h-4 w-4 mr-2" />
              Markup Rules
            </button>
            <button
              onClick={() => setActiveTab("discount")}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "discount"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <Tag className="h-4 w-4 mr-2" />
              Discount Codes
            </button>
            <button
              onClick={() => setActiveTab("tax")}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "tax"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Tax Rules
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Markup Rules Tab */}
          {activeTab === "markup" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Markup Rules</h2>
                  <p className="text-gray-600 text-sm mt-1">Configure markup percentages for different service types</p>
                </div>
                <Button onClick={openAddModal} className="shadow-lg bg-[#155dfc]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Markup Rule
                </Button>
              </div>
              <div className="border border-gray-200 text-gray-700 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Markup Percentage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {markupRules.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                          <Percent className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">No markup rules found</p>
                          <p className="text-sm">Add your first markup rule to get started</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      markupRules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <Badge variant="default">{rule.serviceType}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-blue-600">{rule.percentage}%</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(rule)}
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteMarkupRule(rule.id)}
                                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Discounts Tab */}
          {activeTab === "discount" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Discount Codes</h2>
                  <p className="text-gray-600 text-sm mt-1">Manage promotional discount codes and their validity periods</p>
                </div>
                <Button onClick={openAddModal} className="shadow-lg bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Discount
                </Button>
              </div>
              <div className="border border-gray-200 text-gray-700 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell>
                          <Badge variant="default" className="font-mono font-semibold">
                            {discount.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{discount.description}</TableCell>
                        <TableCell className="font-semibold text-green-600">{discount.percentage}%</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(discount.validFrom).toLocaleDateString()} - {new Date(discount.validTo).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(discount)}
                              className="hover:bg-green-50 hover:border-green-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDiscount(discount.id)}
                              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Tax Rules Tab */}
          {activeTab === "tax" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tax Rules</h2>
                  <p className="text-gray-600 text-sm mt-1">Configure tax rates for different service categories</p>
                </div>
                <Button onClick={openAddModal} className="shadow-lg bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tax Rule
                </Button>
              </div>
              <div className="border border-gray-200 text-gray-700 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Tax Percentage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxes.map((tax) => (
                      <TableRow key={tax.id}>
                        <TableCell>
                          <Badge variant="outline">{tax.serviceType}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-purple-600">{tax.percentage}%</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(tax)}
                              className="hover:bg-purple-50 hover:border-purple-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTax(tax.id)}
                              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-md bg-white text-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getModalIcon()}
                {getModalTitle()}
              </DialogTitle>
            </DialogHeader>

            {/* Markup Rule Form */}
            {activeTab === "markup" && (
              <form onSubmit={handleMarkupSubmit} className="space-y-6 px-6 py-4">
                <div className="space-y-3">
                  <Label htmlFor="serviceType" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Service Type
                  </Label>
                  <select
                    id="serviceType"
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-right-3 bg-center pr-10"
                    value={markupFormData.serviceType}
                    onChange={(e) => setMarkupFormData({
                      ...markupFormData,
                      serviceType: e.target.value
                    })}
                    required
                  >
                    <option value="">Select service type...</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="percentage" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Markup Percentage
                  </Label>
                  <div className="relative">
                    <Input
                      id="percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter percentage"
                      value={markupFormData.percentage}
                      onChange={(e) => setMarkupFormData({
                        ...markupFormData,
                        percentage: parseFloat(e.target.value) || 0
                      })}
                      required
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              </form>
            )}

            {/* Discount Form */}
            {activeTab === "discount" && (
              <form onSubmit={handleDiscountSubmit} className="space-y-6 px-6 py-4">
                <div className="space-y-3">
                  <Label htmlFor="code">Discount Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., SUMMER20"
                    value={discountFormData.code}
                    onChange={(e) => setDiscountFormData({
                      ...discountFormData,
                      code: e.target.value.toUpperCase()
                    })}
                    required
                    className="font-mono"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the discount"
                    value={discountFormData.description}
                    onChange={(e) => setDiscountFormData({
                      ...discountFormData,
                      description: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="percentage">Discount Percentage</Label>
                  <div className="relative">
                    <Input
                      id="percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="Enter percentage"
                      value={discountFormData.percentage}
                      onChange={(e) => setDiscountFormData({
                        ...discountFormData,
                        percentage: parseFloat(e.target.value) || 0
                      })}
                      required
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={discountFormData.validFrom}
                      onChange={(e) => setDiscountFormData({
                        ...discountFormData,
                        validFrom: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="validTo">Valid To</Label>
                    <Input
                      id="validTo"
                      type="date"
                      value={discountFormData.validTo}
                      onChange={(e) => setDiscountFormData({
                        ...discountFormData,
                        validTo: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Tax Rule Form */}
            {activeTab === "tax" && (
              <form onSubmit={handleTaxSubmit} className="space-y-6 px-6 py-4">
                <div className="space-y-3">
                  <Label htmlFor="serviceType" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Service Type
                  </Label>
                  <select
                    id="serviceType"
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-right-3 bg-center pr-10"
                    value={taxFormData.serviceType}
                    onChange={(e) => setTaxFormData({
                      ...taxFormData,
                      serviceType: e.target.value
                    })}
                    required
                  >
                    <option value="">Select service type...</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="percentage" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Tax Percentage
                  </Label>
                  <div className="relative">
                    <Input
                      id="percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter percentage"
                      value={taxFormData.percentage}
                      onChange={(e) => setTaxFormData({
                        ...taxFormData,
                        percentage: parseFloat(e.target.value) || 0
                      })}
                      required
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              </form>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={(e) => {
                  if (activeTab === "markup") handleMarkupSubmit(e)
                  else if (activeTab === "discount") handleDiscountSubmit(e)
                  else if (activeTab === "tax") handleTaxSubmit(e)
                }}
                disabled={isSubmitting}
                className={`${activeTab === "markup" ? "bg-blue-600 hover:bg-blue-700" :
                  activeTab === "discount" ? "bg-green-600 hover:bg-green-700" :
                    "bg-purple-600 hover:bg-purple-700"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  modalMode === "add" ? "Create Rule" : "Update Rule"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}