"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Globe, Plus, Building2, DollarSign, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface Country {
  name: string;
  code: string;
  flag: string;
  currency: string;
}

interface FormData extends Country { }

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Country;
}

interface CountryManagerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCountryAdded?: (country: Country) => void;
  onError?: (error: string) => void;
}

export default function CountryManager({
  isOpen,
  setIsOpen,
  onCountryAdded,
  onError
}: CountryManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    flag: '',
    currency: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Country name is required';
    if (!formData.code.trim()) newErrors.code = 'Country code is required';
    if (formData.code.length < 2 || formData.code.length > 3) {
      newErrors.code = 'Country code must be 2-3 characters';
    }
    if (!formData.flag.trim()) newErrors.flag = 'Flag is required';
    if (!formData.currency.trim()) newErrors.currency = 'Currency is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/admin/country', formData)
      console.log("API Response: ", response);
      const result: ApiResponse = await response.data;
      console.log("API result:", result);
      if (result.success) {
        toast({
          title: "Country Added",
          description: `Successfully added ${formData.name}.`,
        });
        setFormData({ name: '', code: '', flag: '', currency: '' });
        setErrors({});
        setIsOpen(false);
        onCountryAdded?.(formData);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        setErrors({ code: result.message });
        onError?.(result.message);
      }
    } catch (error: any) {
      let errorMsg = "Failed to submit form. Please try again."; 
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      setErrors({ name: 'Failed to submit form. Please try again.' });
      onError?.('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', flag: '', currency: '' });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg bg-white border-0 text-gray-700 shadow-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Add New Country
              </DialogTitle>
              <DialogDescription className="text-slate-600 mt-1">
                Enter the country details below
              </DialogDescription>
            </div>
          </div>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-slate-500" />
              Country Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter country name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={cn(
                "h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20",
                errors.name && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors.name && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Country Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-slate-700 flex items-center">
              <Globe className="w-4 h-4 mr-2 text-slate-500" />
              Country Code
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="e.g., US, IN, GB"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
              maxLength={3}
              className={cn(
                "h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 font-mono",
                errors.code && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors.code && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.code}
              </div>
            )}
          </div>

          {/* Flag */}
          <div className="space-y-2">
            <Label htmlFor="flag" className="text-sm font-medium text-slate-700 flex items-center">
              <span className="w-4 h-4 mr-2 text-slate-500">🏳️</span>
              Flag
            </Label>
            <div className="relative">
              <Input
                id="flag"
                type="text"
                placeholder="🇺🇸 or flag emoji"
                value={formData.flag}
                onChange={(e) => handleInputChange('flag', e.target.value)}
                className={cn(
                  "h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 ",
                  errors.flag && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                )}
              />
              {formData.flag && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg">
                  {formData.flag}
                </div>
              )}
            </div>
            {errors.flag && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.flag}
              </div>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-medium text-slate-700 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-slate-500" />
              Currency
            </Label>
            <Input
              id="currency"
              type="text"
              placeholder="e.g., USD, INR, GBP"
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value.toUpperCase())}
              className={cn(
                "h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 font-mono",
                errors.currency && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors.currency && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.currency}
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="border-slate-200 cursor-pointer text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Add Country
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}