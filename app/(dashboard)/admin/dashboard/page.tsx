import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Car, Hotel, MapPin, Package, Plane, Users, Utensils } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Destinations",
      value: "24",
      description: "Active destinations",
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Venues",
      value: "156",
      description: "Total venues",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Hotels",
      value: "89",
      description: "Partner hotels",
      icon: Hotel,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Packages",
      value: "42",
      description: "Travel packages",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Flight Routes",
      value: "78",
      description: "Available routes",
      icon: Plane,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Vehicles",
      value: "34",
      description: "Vehicle types",
      icon: Car,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Meal Plans",
      value: "12",
      description: "Available plans",
      icon: Utensils,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Users",
      value: "8",
      description: "Admin users",
      icon: Users,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ]

  return (
    <div className="flex-1 text-gray-700 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">New destination added</p>
                  <p className="text-sm text-muted-foreground">Goa, India - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Hotel rates updated</p>
                  <p className="text-sm text-muted-foreground">Taj Palace - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">New package created</p>
                  <p className="text-sm text-muted-foreground">Kerala Backwaters - 6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Flight route added</p>
                  <p className="text-sm text-muted-foreground">Delhi to Mumbai - 8 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>Add new destination</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <Package className="h-4 w-4 text-orange-600" />
              <span>Create travel package</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <Hotel className="h-4 w-4 text-purple-600" />
              <span>Update hotel rates</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <Plane className="h-4 w-4 text-indigo-600" />
              <span>Manage flight routes</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
