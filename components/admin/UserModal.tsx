'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch'; 

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Employee' | 'Admin';
  isLocked: boolean;
  status?: string;  
  createdAt: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  user?: User | null;
  isEditing: boolean;
}

interface FormData {
  email: string;
  name: string;
  role: 'Employee' | 'Admin';
  isLocked: boolean;
  password: string;
  confirmPassword: string;
  status: string;
}

export const UserModal = ({ isOpen, onClose, onSave, user, isEditing }: UserModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    role: 'Employee',
    isLocked: false,
    password: '',
    status: "ACTIVE",
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        email: user.email,
        name: user.name,
        role: user.role,
        isLocked: user.isLocked,
        password: '',
        status: user.status || "ACTIVE",
        confirmPassword: '',
      });
    } else {
      setFormData({
        email: '',
        name: '',
        role: 'Employee',
        isLocked: false,
        password: '',
        status: "ACTIVE",
        confirmPassword: '',
      });
    }
    setErrors({});
  }, [user, isEditing, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Name validation (only required for new users)
    if (!isEditing && !formData.name) {
      newErrors.name = 'Name is required';
    }

    // Password validation (only for new users or if password is provided)
    if (!isEditing || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = isEditing
      ? {
        id: user!.id,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        isLocked: formData.isLocked,
        status: formData.status,
      }
      : {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        isLocked: formData.isLocked,
        password: formData.password,
        status: formData.status,
      };

    onSave(userData);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = () => {
    return formData.email &&
      (!isEditing ? formData.name : true) &&
      (!isEditing || formData.password ? formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 : true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-700">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'New User'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="user@company.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name {!isEditing && '*'}</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'Employee' | 'Admin') => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-700">
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          {/* <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={!formData.isLocked}
              onCheckedChange={(checked) => handleInputChange('isLocked', !checked)}
            />
            <Label htmlFor="status">Active (unchecked = locked)</Label>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-700">
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="LOCKED">Locked</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password fields */}
          {(!isEditing || formData.password) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid()}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};