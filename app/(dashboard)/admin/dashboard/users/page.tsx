'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { 
  Plus, 
  Edit, 
  Trash2, 
  KeyRound, 
  Lock, 
  Unlock, 
  Mail, 
  User, 
  Shield,
  Search,
  Filter
} from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// —————— CONFIGURATION ——————
const ENTITY_NAME = 'User'
const FIELDS = [
  { key: 'email', label: 'Email', type: 'email', icon: Mail },
  { key: 'name', label: 'Name', type: 'text', icon: User },
  { key: 'role', label: 'Role', type: 'select', options: ['Employee', 'Admin'], icon: Shield },
]

// Mock API routes (replace with your actual API)
const ROUTES = {
  list: '/api/admin/users',
  create: '/api/admin/users',
  getOne: (id: string) => `/api/admin/users/${id}`,
  update: (id: string) => `/api/admin/users/${id}`,
  remove: (id: string) => `/api/admin/users/${id}`,
  resetPwd: (id: string) => `/api/admin/users/${id}/reset-password`,
  lock: (id: string) => `/api/admin/users/${id}/lock`,
}

const EMPTY: Record<string, any> = Object.fromEntries(
  FIELDS.map(f => [f.key, ''])
)

// Mock data for demonstration
const mockUsers = [
  { id: '1', email: 'john.doe@company.com', name: 'John Doe', role: 'Admin', isLocked: false, createdAt: '2024-01-15' },
  { id: '2', email: 'jane.smith@company.com', name: 'Jane Smith', role: 'Employee', isLocked: false, createdAt: '2024-01-16' },
  { id: '3', email: 'mike.wilson@company.com', name: 'Mike Wilson', role: 'Employee', isLocked: true, createdAt: '2024-01-17' },
]

// —————— FETCHER UTIL ——————
const fetcher = async (url: string, options?: RequestInit) => {
  // Mock implementation - replace with actual API calls
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (url === ROUTES.list) {
    return mockUsers
  }
  
  return { success: true }
}

export default function AdminCrudPanel() {
  const { data: items = [], mutate } = useSWR(ROUTES.list, fetcher)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Filter items based on search and role filter
  const filteredItems = Array.isArray(items) ? items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || item.role === roleFilter
    return matchesSearch && matchesRole
  }) : []

  // Open form for create or edit
  const openForm = (item?: any) => {
    setEditing(item || null)
    setForm(item ? { ...item } : { ...EMPTY })
    setIsDialogOpen(true)
  }

  // Handle input changes
  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Submit create or update
  const handleSubmit = async () => {
    try {
      const isEdit = !!editing
      const url = isEdit ? ROUTES.update(editing.id) : ROUTES.create
      const method = isEdit ? 'PUT' : 'POST'
      
      await fetcher(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      await mutate()
      setIsDialogOpen(false)
      setEditing(null)
      
      toast({
        title: isEdit ? 'User updated' : 'User created',
        description: `${form.name} has been ${isEdit ? 'updated' : 'created'} successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Delete item
  const handleDelete = async (id: string, name: string) => {
    try {
      await fetcher(ROUTES.remove(id), { method: 'DELETE' })
      await mutate()
      
      toast({
        title: 'User deleted',
        description: `${name} has been removed from the system.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Reset password
  const handleResetPwd = async (id: string, name: string) => {
    try {
      await fetcher(ROUTES.resetPwd(id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: 'temp123' }),
      })
      
      toast({
        title: 'Password reset',
        description: `A new password has been generated for ${name}.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Lock/unlock account
  const handleLock = async (id: string, name: string, lock: boolean) => {
    try {
      await fetcher(ROUTES.lock(id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lock }),
      })
      
      await mutate()
      
      toast({
        title: lock ? 'User locked' : 'User unlocked',
        description: `${name} has been ${lock ? 'locked' : 'unlocked'}.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${lock ? 'lock' : 'unlock'} user. Please try again.`,
        variant: 'destructive',
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    return role === 'Admin' ? 'default' : 'secondary'
  }

  return (
    <div className="min-h-screen bg-background p-6 bg-white text-gray-700">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage user accounts, permissions, and access controls
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg" onClick={() => openForm()}>
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px] bg-white text-gray-700">
              <DialogHeader>
                <DialogTitle>
                  {editing ? `Edit ${ENTITY_NAME}` : `Create New ${ENTITY_NAME}`}
                </DialogTitle>
                <DialogDescription>
                  {editing 
                    ? `Update the information for ${editing.name}`
                    : 'Fill in the details to create a new user account'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {FIELDS.map(field => {
                  const Icon = field.icon
                  return (
                    <div key={field.key} className="grid gap-2">
                      <Label htmlFor={field.key} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {field.label}
                      </Label>
                      
                      {field.type === 'select' ? (
                        <Select
                          value={form[field.key] || ''}
                          onValueChange={(value) => handleChange(field.key, value)}
                        >
                          <SelectTrigger >
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-700">
                            {field.options?.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type}
                          value={form[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={handleSubmit}>
                  {editing ? 'Update User' : 'Create User'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredItems.length})</CardTitle>
            <CardDescription>
              A list of all user accounts in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(item.role)}>
                        {item.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isLocked ? 'destructive' : 'default'}>
                        {item.isLocked ? 'Locked' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openForm(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResetPwd(item.id, item.name)}
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLock(item.id, item.name, !item.isLocked)}
                        >
                          {item.isLocked ? (
                            <Unlock className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {item.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id, item.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}