'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Lock, Unlock, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import type { User } from './UserManagement';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleLock: (userId: string) => void;
  onResetPassword: (user: User) => void;
}

export const UserTable = ({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleLock,
  onResetPassword,
}: UserTableProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm mt-1">Click "New User" to create your first user account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[50vh] rounded-sm border border-gray-200 shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-white">
          <tr className="sticky top-0 z-10 bg-gradient-to-r from-blue-800 via-blue-900 to-purple-900">
            <th className="text-white font-semibold p-4 text-left">Email</th>
            <th className="text-white font-semibold p-4 text-left">Name</th>
            <th className="text-white font-semibold p-4 text-left">Role</th>
            <th className="text-white font-semibold p-4 text-left">Assigned Countries</th>
            <th className="text-white font-semibold p-4 text-left">Status</th>
            <th className="text-white font-semibold p-4 text-left">Created At</th>
            <th className="text-white font-semibold p-4 text-left pl-20">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr 
              key={user.id} 
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-100 hover:bg-gray-50`}
            >
              <td className="font-medium p-4">{user.email}</td>
              <td className="p-4">{user.name}</td>
              <td className="p-4">
                <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </td>
              <td className="p-4">
                {user.assignedCountries && user.assignedCountries.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {user.assignedCountries.map(({ country }) => (
                      <Badge key={country.id} variant="outline" className="font-normal">
                        {country.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">All</span>
                )}
              </td>
              <td className="p-4">
                <span
                  className={
                    user.status === "ACTIVE"
                      ? "text-green-600 font-semibold"
                      : user.status === "LOCKED"
                        ? "text-red-600 font-semibold"
                        : user.status === "SUSPENDED"
                          ? "text-yellow-600 font-semibold"
                          : "text-gray-500 font-semibold"
                  }
                >
                  {user.status}
                </span>
              </td>
              <td className="text-muted-foreground p-4">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </td>
              <td className="text-right p-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleLock(user.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                  >
                    {user.isLocked ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResetPassword(user)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};