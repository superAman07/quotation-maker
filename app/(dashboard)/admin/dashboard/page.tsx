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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <span className="text-sm text-gray-500">Last updated: 2 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} transition-transform hover:scale-110`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-7 bg-white border border-gray-200">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">Latest updates across your system</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900">New destination added</p>
                    <p className="text-xs sm:text-sm text-gray-600">Goa, India - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900">Hotel rates updated</p>
                    <p className="text-xs sm:text-sm text-gray-600">Taj Palace - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-orange-500 mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900">New package created</p>
                    <p className="text-xs sm:text-sm text-gray-600">Kerala Backwaters - 6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-purple-500 mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900">Flight route added</p>
                    <p className="text-xs sm:text-sm text-gray-600">Delhi to Mumbai - 8 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-5 bg-white border border-gray-200">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
              <button className="w-full text-left p-3 sm:p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3 sm:gap-4 border border-gray-200 hover:border-blue-300 hover:shadow-md">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-900">Add new destination</span>
              </button>
              <button className="w-full text-left p-3 sm:p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3 sm:gap-4 border border-gray-200 hover:border-orange-300 hover:shadow-md">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-900">Create travel package</span>
              </button>
              <button className="w-full text-left p-3 sm:p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3 sm:gap-4 border border-gray-200 hover:border-purple-300 hover:shadow-md">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Hotel className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-900">Update hotel rates</span>
              </button>
              <button className="w-full text-left p-3 sm:p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3 sm:gap-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-900">Manage flight routes</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}