"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
  ChevronDown,
  LogOut,
  SettingsIcon,
  User,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import CountryManager from "./countryformmodel"
import { useSelectedCountry } from "@/components/SelectedCountryContext";

const navigationItems = [
  // {
  //   title: "Destinations",
  //   icon: MapPin,
  //   items: [
  //     { title: "Destinations", href: "/admin/dashboard/destinations", icon: MapPin },
  //     // { title: "Venues", href: "/admin/dashboard/venues", icon: Building2 },
  //   ],
  // },
  // {
  //   title: "Accommodations",
  //   icon: Hotel,
  //   items: [{ title: "Hotels", href: "/admin/dashboard/hotels", icon: Hotel }],
  // },
  // {
  //   title: "Transportation",
  //   icon: Plane,
  //   items: [
  //     // { title: "Flight Routes", href: "/admin/dashboard/flight-routes", icon: Plane },
  //     { title: "Vehicles", href: "/admin/dashboard/vehicles", icon: Car },
  //   ],
  // },
  // {
  //   title: "Services",
  //   icon: Utensils,
  //   items: [
  //     { title: "Meal Plans", href: "/admin/dashboard/meal-plans", icon: Utensils },
  //     { title: "Packages", href: "/admin/dashboard/packages", icon: Package },
  //     { title: "Fully Packed Packages", href: "/admin/dashboard/fully-packed-packages", icon: Package },
  //   ],
  // },
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

function useHoverDropdown() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringRef = useRef(false)

  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const handleMouseEnter = useCallback(
    (title: string) => {
      isHoveringRef.current = true
      clearExistingTimeout()
      setOpenDropdown(title)
    },
    [clearExistingTimeout],
  )

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false
    clearExistingTimeout()

    timeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setOpenDropdown(null)
      }
    }, 200)
  }, [clearExistingTimeout])

  const forceClose = useCallback(() => {
    clearExistingTimeout()
    isHoveringRef.current = false
    setOpenDropdown(null)
  }, [clearExistingTimeout])

  useEffect(() => {
    return () => {
      clearExistingTimeout()
    }
  }, [clearExistingTimeout])

  return {
    openDropdown,
    handleMouseEnter,
    handleMouseLeave,
    forceClose,
  }
}

export function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { openDropdown, handleMouseEnter, handleMouseLeave, forceClose } = useHoverDropdown()
  const [showCountryManager, setShowCountryManager] = useState(false);
  const { selectedCountry } = useSelectedCountry();

  const isActive = (href: string) => pathname === href

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setMobileOpenDropdown(null)
    forceClose()
  }

  const toggleMobileDropdown = (title: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === title ? null : title)
  }

  useEffect(() => {
    const handleClickOutside = () => {
      forceClose()
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        forceClose()
      }
    }

    document.addEventListener("click", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [forceClose])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 shadow-lg backdrop-blur-md bg-white/95">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-shrink-0">
              <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
                <Image src="/logo.png" alt="Logo" width={200} height={100} className="rounded-full" />
                {/* <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Route className="size-5" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Travomine
                  </span>
                  <div className="text-xs text-gray-500 font-medium">Admin Portal</div>
                </div> */}
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              {navigationItems.map((item) => (
                <div key={item.title} className="relative">
                  {!item.items ? (
                    <Link
                      href={(item as any).href}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive((item as any).href)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.title}
                    </Link>
                  ) : (
                    <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.title)}
                      onMouseLeave={handleMouseLeave}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        className={`inline-flex cursor-pointer items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${openDropdown === item.title
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        onMouseEnter={() => handleMouseEnter(item.title)}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${openDropdown === item.title ? "rotate-180" : ""
                            }`}
                        />
                      </Button>

                      {openDropdown === item.title && (
                        <div
                          className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl py-1 z-50"
                          onMouseEnter={() => handleMouseEnter(item.title)}
                          onMouseLeave={handleMouseLeave}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.items?.map((subItem, index) => (
                            <div key={subItem.href}>
                              <Link
                                href={
                                  item.title === "Destinations" && subItem.title === "Destinations" && selectedCountry?.id
                                    ? `/admin/dashboard/destinations?countryId=${selectedCountry.id}`
                                    : subItem.href
                                }
                                className={`flex items-center px-3 py-3 mx-1 rounded-lg text-sm transition-all duration-200 ${isActive(subItem.href)
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                  }`}
                                onClick={forceClose}
                              >
                                <subItem.icon className="w-4 h-4 mr-3" />
                                {subItem.title}
                              </Link>
                              {index < item.items!.length - 1 && <div className="mx-2 h-px bg-gray-200" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            <Button
              variant="outline"
              className="ml-2 mt-0 cursor-pointer bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setShowCountryManager(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>

            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative p-0 h-8 w-8 cursor-pointer rounded-full hover:bg-blue-50 transition-colors"
                  >
                    <div className="h-8 w-8 p-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl"
                >
                  <DropdownMenuItem className="flex items-center px-3 py-3 rounded-lg mx-1 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center px-3 py-3 rounded-lg mx-1 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    <SettingsIcon className="h-4 w-4 mr-3" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuItem className="flex items-center px-3 py-3 rounded-lg mx-1 text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            </div>


            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                        <User className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl"
                  >
                    <DropdownMenuItem className="flex items-center px-3 py-3 rounded-lg mx-1">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center px-3 py-3 rounded-lg mx-1">
                      <SettingsIcon className="h-4 w-4 mr-3" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="mx-2" />
                    <DropdownMenuItem className="flex items-center px-3 py-3 rounded-lg mx-1 text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="h-10 w-10 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute top-1 left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                      }`}
                  ></span>
                  <span
                    className={`absolute top-3 left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""
                      }`}
                  ></span>
                  <span
                    className={`absolute top-5 left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                      }`}
                  ></span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {!item.items ? (
                  <Link
                    href={(item as any).href}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${isActive((item as any).href)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    onClick={toggleMobileMenu}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMobileDropdown(item.title)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.title}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${mobileOpenDropdown === item.title ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`space-y-1 overflow-hidden transition-all duration-300 ${mobileOpenDropdown === item.title ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(subItem.href)
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          onClick={toggleMobileMenu}
                        >
                          <subItem.icon className="w-4 h-4 mr-3" />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={toggleMobileMenu} />
      )}
      <CountryManager
        isOpen={showCountryManager}
        setIsOpen={setShowCountryManager}
      />
    </>
  )
}
