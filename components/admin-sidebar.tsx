// "use client"

// import {
//   Building2,
//   Car,
//   FileText,
//   Home,
//   Hotel,
//   MapPin,
//   Package,
//   Plane,
//   Route,
//   Users,
//   Utensils,
//   Percent,
// } from "lucide-react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar"

// const menuItems = [
//   {
//     title: "Dashboard",
//     url: "/admin",
//     icon: Home,
//   },
//   {
//     title: "Destinations",
//     url: "/admin/destinations",
//     icon: MapPin,
//   },
//   {
//     title: "Venues",
//     url: "/admin/venues",
//     icon: Building2,
//   },
//   {
//     title: "Hotels",
//     url: "/admin/hotels",
//     icon: Hotel,
//   },
//   {
//     title: "Flight Routes",
//     url: "/admin/flight-routes",
//     icon: Plane,
//   },
//   {
//     title: "Vehicles",
//     url: "/admin/vehicles",
//     icon: Car,
//   },
//   {
//     title: "Meal Plans",
//     url: "/admin/meal-plans",
//     icon: Utensils,
//   },
//   {
//     title: "Packages",
//     url: "/admin/packages",
//     icon: Package,
//   },
// ]

// const templateItems = [
//   {
//     title: "Inclusion Templates",
//     url: "/admin/inclusion-templates",
//     icon: FileText,
//   },
//   {
//     title: "Exclusion Templates",
//     url: "/admin/exclusion-templates",
//     icon: FileText,
//   },
// ]

// const settingsItems = [
//   {
//     title: "Pricing Rules",
//     url: "/admin/pricing-rules",
//     icon: Percent,
//   },
//   {
//     title: "Users & Roles",
//     url: "/admin/users",
//     icon: Users,
//   },
// ]

// export function AdminSidebar() {
//   const pathname = usePathname()

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarHeader>
//         <div className="flex items-center gap-2 px-4 py-2">
//           <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//             <Route className="size-4" />
//           </div>
//           <div className="grid flex-1 text-left text-sm leading-tight">
//             <span className="truncate font-semibold">Travomine</span>
//             <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
//           </div>
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Main</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={pathname === item.url}>
//                     <Link href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup>
//           <SidebarGroupLabel>Templates</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {templateItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={pathname === item.url}>
//                     <Link href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup>
//           <SidebarGroupLabel>Settings</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {settingsItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={pathname === item.url}>
//                     <Link href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   )
// }
