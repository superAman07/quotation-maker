"use client"
import { Search, Filter, Download, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchAndActionsProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onAddHotel: () => void
}

export function SearchAndActions({ searchTerm, onSearchChange, onAddHotel }: SearchAndActionsProps) {
  return (
    <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8 border border-blue-100/50 backdrop-blur-sm">
    
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
            <Input
              type="text"
              placeholder="Search hotels, cities, or countries..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center cursor-pointer gap-2 bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl px-4 py-2.5 font-medium"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>

          <Button
            variant="outline"
            className="flex items-center cursor-pointer gap-2 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl px-4 py-2.5 font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            onClick={onAddHotel}
            className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-2.5 font-semibold transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Hotel
          </Button>
        </div>
      </div>
 
    </div>
  )
}
