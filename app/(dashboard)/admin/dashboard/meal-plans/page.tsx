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
import { Edit, Plus, Trash2 } from "lucide-react"
import type { MealPlan } from "@/lib/types"

// Mock data
const mockMealPlans: MealPlan[] = [
  {
    id: 1,
    code: "CP",
    description: "Continental Plan - Room + Breakfast",
    ratePerPerson: 800,
  },
  {
    id: 2,
    code: "MAP",
    description: "Modified American Plan - Room + Breakfast + Dinner",
    ratePerPerson: 1200,
  },
  {
    id: 3,
    code: "AP",
    description: "American Plan - Room + All Meals",
    ratePerPerson: 1800,
  },
  {
    id: 4,
    code: "AI",
    description: "All Inclusive - Room + All Meals + Beverages",
    ratePerPerson: 2500,
  },
]

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(mockMealPlans)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    ratePerPerson: "",
  })

  const handleCreate = () => {
    const newPlan: MealPlan = {
      id: Math.max(...mealPlans.map((p) => p.id)) + 1,
      code: formData.code,
      description: formData.description || undefined,
      ratePerPerson: Number.parseFloat(formData.ratePerPerson),
    }
    setMealPlans([...mealPlans, newPlan])
    setFormData({ code: "", description: "", ratePerPerson: "" })
    setIsCreateOpen(false)
  }

  const handleEdit = (plan: MealPlan) => {
    setEditingPlan(plan)
    setFormData({
      code: plan.code,
      description: plan.description || "",
      ratePerPerson: plan.ratePerPerson.toString(),
    })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingPlan) return

    setMealPlans(
      mealPlans.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              code: formData.code,
              description: formData.description || undefined,
              ratePerPerson: Number.parseFloat(formData.ratePerPerson),
            }
          : p,
      ),
    )
    setIsEditOpen(false)
    setEditingPlan(null)
    setFormData({ code: "", description: "", ratePerPerson: "" })
  }

  const handleDelete = (id: number) => {
    setMealPlans(mealPlans.filter((p) => p.id !== id))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meal Plans</h1>
          <p className="text-muted-foreground">Manage meal plan types and rates</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Meal Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Meal Plan</DialogTitle>
              <DialogDescription>Add a new meal plan with pricing information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Plan Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CP, MAP, AP, AI"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what's included in this meal plan"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ratePerPerson">Rate per Person (₹) *</Label>
                <Input
                  id="ratePerPerson"
                  type="number"
                  value={formData.ratePerPerson}
                  onChange={(e) => setFormData({ ...formData, ratePerPerson: e.target.value })}
                  placeholder="800"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.code || !formData.ratePerPerson}>
                Create Meal Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Rate per Person</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mealPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {plan.code}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md">{plan.description}</TableCell>
                <TableCell>₹{plan.ratePerPerson.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
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
                            This will permanently delete the meal plan "{plan.code}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(plan.id)}>Delete</AlertDialogAction>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Meal Plan</DialogTitle>
            <DialogDescription>Update meal plan information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Plan Code *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CP, MAP, AP, AI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what's included in this meal plan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-ratePerPerson">Rate per Person (₹) *</Label>
              <Input
                id="edit-ratePerPerson"
                type="number"
                value={formData.ratePerPerson}
                onChange={(e) => setFormData({ ...formData, ratePerPerson: e.target.value })}
                placeholder="800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.code || !formData.ratePerPerson}>
              Update Meal Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
