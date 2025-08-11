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
    <div className=" border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:bg-gradient-to-r">
            <TableHead className="text-white font-semibold">Email</TableHead>
            <TableHead className="text-white font-semibold">Name</TableHead>
            <TableHead className="text-white font-semibold">Role</TableHead>
            <TableHead className="text-white font-semibold">Assigned Countries</TableHead>
            <TableHead className="text-white font-semibold">Status</TableHead>
            <TableHead className="text-white font-semibold">Created At</TableHead>
            <TableHead className="text-right text-white font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleLock(user.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
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
                    className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
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
  );
};