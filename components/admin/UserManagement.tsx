'use client'
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ResetPasswordDialog } from './ResetPasswordDialog';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { Country } from '@/types/hotel';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const API = {
  list: '/api/admin/users',
  create: '/api/admin/users',
  update: (id: string) => `/api/admin/users/${id}`,
  remove: (id: string) => `/api/admin/users/${id}`,
  reset: (id: string) => `/api/admin/users/${id}/reset-password`,
  lock: (id: string) => `/api/admin/users/${id}/lock`,
};

const DEFAULT_ROLE = 'Employee';
const DEFAULT_STATUS = false;

interface UserCountryAssignment {
  country: Country;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Employee' | 'Admin';
  status?: string;
  isLocked: boolean;
  createdAt: string;
  assignedCountries?: UserCountryAssignment[];

}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = user.name?.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower);

      const matchesRole = roleFilter === 'All' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setIsUserModalOpen(false);
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = async (userData: Omit<User, 'createdAt'>) => {
    try {
      const res = await axios.put(`/api/admin/users/${userData.id}`, userData);
      const updatedUser = res.data;
      setUsers(users.map(user =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      ));
      setIsUserModalOpen(false);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`/api/admin/users/${selectedUser.id}`);
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({ title: 'Success', description: 'User deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
    }
  };

  const handleToggleLock = async (userId: string) => {
    try {
      const res = await axios.post(`/api/admin/users/${userId}/lock`);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, isLocked: res.data.isLocked } : user
      ));
      toast({ title: 'Success', description: `User ${res.data.isLocked ? 'locked' : 'unlocked'} successfully` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to toggle user lock status', variant: 'destructive' });
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!selectedUser) return;
    try {
      await axios.post(`/api/admin/users/${selectedUser.id}/reset-password`, { password: newPassword });
      setIsResetPasswordDialogOpen(false);
      setSelectedUser(null);
      toast({ title: 'Success', description: 'Password reset successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reset password', variant: 'destructive' });
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openResetPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6 bg-white text-gray-700">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-purple-700">
              Manage Users
            </h1>
            <p className="text-muted-foreground font-semibold mt-2">
              Create, edit, lock/unlock, or delete user accounts.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsUserModalOpen(true);
            }}
            className="flex items-center cursor-pointer gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg px-5 py-2.5"
          >
            <Plus className="h-4 w-4" />
            New User
          </Button>
        </div>
 
        <Card className='rounded-none border-none shadow-lg'>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              {users.length} user{users.length !== 1 ? 's' : ''} registered
            </CardDescription>
            <div className="flex items-center space-x-4 pt-4">
              <div className="relative w-full max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </span>
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-purple-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div> 
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-45 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:shadow-md focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                  <SelectValue placeholder="Filter by role" className='cursor-pointer' />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-700">
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <UserTable
              users={filteredUsers}
              loading={loading}
              onEdit={openEditModal}
              onDelete={openDeleteDialog}
              onToggleLock={handleToggleLock}
              onResetPassword={openResetPasswordDialog}
            />
          </CardContent>
        </Card>

        {/* Modals and Dialogs */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={selectedUser ? handleUpdateUser : handleCreateUser}
          user={selectedUser}
          isEditing={!!selectedUser}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteUser}
          userEmail={selectedUser?.email || ''}
        />

        <ResetPasswordDialog
          isOpen={isResetPasswordDialogOpen}
          onClose={() => {
            setIsResetPasswordDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleResetPassword}
        />
      </div>
    </div>
  );
};