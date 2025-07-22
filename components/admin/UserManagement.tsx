'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ResetPasswordDialog } from './ResetPasswordDialog';
import { Plus } from 'lucide-react';
import axios from 'axios';

// API Constants
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Employee' | 'Admin';
  isLocked: boolean;
  createdAt: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Mock data for demo purposes (replace with actual API calls)
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john.doe@company.com',
      name: 'John Doe',
      role: 'Admin',
      isLocked: false,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      email: 'jane.smith@company.com',
      name: 'Jane Smith',
      role: 'Employee',
      isLocked: false,
      createdAt: '2024-02-20T14:15:00Z'
    },
    {
      id: '3',
      email: 'locked.user@company.com',
      name: 'Locked User',
      role: 'Employee',
      isLocked: true,
      createdAt: '2024-01-05T09:00:00Z'
    }
  ];

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground mt-2">
              Create, edit, lock/unlock, or delete user accounts.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsUserModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New User
          </Button>
        </div>

        {/* User Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              {users.length} user{users.length !== 1 ? 's' : ''} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              users={users}
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