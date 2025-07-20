"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2 } from "lucide-react"

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

// Mock data
const mockMarkupRules: MarkupRule[] = [
  { id: 1, serviceType: "HOTEL", percentage: 15 },
  { id: 2, serviceType: "FLIGHT", percentage: 8 },
  { id: 3, serviceType: "VEHICLE", percentage: 12 },
]

const mockDiscounts: Discount[] = [
  {
    id: 1,
    code: "EARLY20",
    description: "Early bird discount",
    percentage: 20,
    validFrom: "2024-01-01",
    validTo: "2024-03-31",
  },
  {
    id: 2,
    code: "SUMMER15",
    description: "Summer special discount",
    percentage: 15,
    validFrom: "2024-04-01",
    validTo: "2024-06-30",
  },
]

const mockTaxes: Tax[] = [
  { id: 1, serviceType: "HOTEL", percentage: 12 },
  { id: 2, serviceType: "FLIGHT", percentage: 5 },
  { id: 3, serviceType: "VEHICLE", percentage: 18 },
]

export default function PricingRulesPage() {
  const [activeTab, setActiveTab] = useState<"markup" | "discount" | "tax">("markup")
  const [markupRules, setMarkupRules] = useState<MarkupRule[]>(mockMarkupRules)
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts)
  const [taxes, setTaxes] = useState<Tax[]>(mockTaxes)

  const serviceTypes = ["HOTEL", "FLIGHT", "VEHICLE", "PACKAGE", "MEAL"]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Rules</h1>
          <p className="text-muted-foreground">Manage markups, discounts, and tax rates</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("markup")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "markup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Markup Rules
        </button>
        <button
          onClick={() => setActiveTab("discount")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "discount" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Discounts
        </button>
        <button
          onClick={() => setActiveTab("tax")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "tax" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tax Rules
        </button>
      </div>

      {/* Markup Rules Tab */}
      {activeTab === "markup" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Markup Rules</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Markup Rule
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Markup Percentage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {markupRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Badge variant="outline">{rule.serviceType}</Badge>
                    </TableCell>
                    <TableCell>{rule.percentage}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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

      {/* Discounts Tab */}
      {activeTab === "discount" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Discount Codes</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Discount
            </Button>
          </div>
          <div className="border rounded-lg">
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
                      <Badge variant="outline" className="font-mono">
                        {discount.code}
                      </Badge>
                    </TableCell>
                    <TableCell>{discount.description}</TableCell>
                    <TableCell>{discount.percentage}%</TableCell>
                    <TableCell>
                      {new Date(discount.validFrom).toLocaleDateString()} -{" "}
                      {new Date(discount.validTo).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tax Rules</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Rule
            </Button>
          </div>
          <div className="border rounded-lg">
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
                    <TableCell>{tax.percentage}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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
  )
}
