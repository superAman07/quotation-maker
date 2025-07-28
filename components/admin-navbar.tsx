"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Car,
  FileText,
  Home,
  Hotel,
  MapPin,
  Package,
  Plane,
  Route,
  Users,
  Utensils,
  Percent,
  Menu,
  X,
  ChevronDown,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Destinations",
    icon: MapPin,
    items: [
      { title: "Destinations", href: "/admin/dashboard/destinations", icon: MapPin },
      { title: "Venues", href: "/admin/dashboard/venues", icon: Building2 },
    ],
  },
  {
    title: "Accommodations",
    icon: Hotel,
    items: [
      { title: "Hotels", href: "/admin/dashboard/hotels", icon: Hotel }, 
    ],
  },
  {
    title: "Transportation",
    icon: Plane,
    items: [
      { title: "Flight Routes", href: "/admin/dashboard/flight-routes", icon: Plane },
      { title: "Vehicles", href: "/admin/dashboard/vehicles", icon: Car },
    ],
  },
  {
    title: "Services",
    icon: Utensils,
    items: [
      { title: "Meal Plans", href: "/admin/dashboard/meal-plans", icon: Utensils },
      { title: "Packages", href: "/admin/dashboard/packages", icon: Package },
      { title: "Fully Packed Packages", href: "/admin/dashboard/fully-packed-packages", icon: Package },
    ],
  },
  {
    title: "Templates",
    icon: FileText,
    items: [
      { title: "Inclusion Templates", href: "/admin/dashboard/inclusion-templates", icon: FileText },
      { title: "Exclusion Templates", href: "/admin/dashboard/exclusion-templates", icon: FileText },
    ],
  },
  {
    title: "Settings",
    icon: Percent,
    items: [
      { title: "Pricing Rules", href: "/admin/dashboard/pricing-rules", icon: Percent },
      { title: "Users & Roles", href: "/admin/dashboard/users", icon: Users },
    ],
  },
]

export function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b text-gray-700 border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin/dashboard/dashboard" className="flex items-center space-x-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Route className="size-4" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Travomine</span>
                <span className="text-sm text-gray-500 ml-2">Admin</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </Link>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.items?.map((subItem, index) => (
                        <div key={subItem.href}>
                          <DropdownMenuItem asChild>
                            <Link
                              href={subItem.href}
                              className={`flex items-center px-2 py-2 text-sm ${
                                isActive(subItem.href)
                                  ? "bg-primary text-primary-foreground"
                                  : "text-gray-700 hover:text-gray-900"
                              }`}
                            >
                              <subItem.icon className="w-4 h-4 mr-2" />
                              {subItem.title}
                            </Link>
                          </DropdownMenuItem>
                          {index < item.items!.length - 1 && <DropdownMenuSeparator />}
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.title}
                    </div>
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {item.title}
                    </div>
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block px-6 py-2 rounded-md text-base font-medium ${
                          isActive(subItem.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <subItem.icon className="w-4 h-4 mr-3" />
                          {subItem.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
