'use client';

import { useState, useEffect } from 'react';
import { 
  Menu,
  X,
  Home,
  FileText,
  Plus,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Search,
  MoreHorizontal
} from 'lucide-react';
import Image from 'next/image';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && isMobile) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.getElementById('menu-button');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: true },
    { name: 'New Quotation', href: '/quotation/new', icon: Plus, current: false },
    { name: 'All Quotations', href: '/quotations', icon: FileText, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Account Settings', href: '/settings' },
    { name: 'Billing', href: '/billing' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <Image src={'/logo.png'} width={200} height={50} alt="Travomine Logo" className="text-xl font-bold text-[#252426]"/>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                item.current
                  ? 'bg-[#6C733D] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#6C733D]'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${
                item.current ? 'text-white' : 'text-gray-500 group-hover:text-[#6C733D]'
              }`} />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-[#6C733D]/10 to-[#9DA65D]/10 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#252426] mb-1">Need Help?</h3>
            <p className="text-xs text-gray-600 mb-3">Contact our support team for assistance</p>
            <button className="w-full bg-[#6C733D] text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-[#5a5f33] transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-col min-h-screen lg:pl-72">
        {/* Top navigation */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                id="menu-button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Search - Hidden on mobile, visible on tablet+ */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotations..."
                    className="w-64 lg:w-80 h-10 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Mobile search button */}
              <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* New Quote Button - Hidden on mobile */}
              <div className="hidden sm:block">
                <a
                  href="/quotation/new"
                  className="flex items-center gap-2 h-10 px-4 bg-[#6C733D] hover:bg-[#5a5f33] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:inline">New Quote</span>
                </a>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 h-10 px-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6C733D] to-[#9DA65D] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-[#252426]">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Employee</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-[#252426]">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">sarah.johnson@travomine.com</p>
                    </div>
                    
                    {/* Navigation items */}
                    <div className="py-2">
                      {userNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#6C733D] transition-colors"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    
                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile quick actions bar */}
        <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex gap-2">
            <a
              href="/quotation/new"
              className="flex-1 bg-[#6C733D] text-white py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-[#5a5f33] transition-colors"
            >
              + New Quote
            </a>
            <a
              href="/quotations"
              className="flex-1 border border-[#6C733D] text-[#6C733D] py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-[#6C733D] hover:text-white transition-colors"
            >
              View All
            </a>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}