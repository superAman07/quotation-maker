'use client'
import React from 'react';
import { Clock, User, MapPin, Hotel, Car } from 'lucide-react';

const activities = [
  {
    icon: MapPin,
    action: 'Added new destination',
    details: 'Bangkok, Thailand',
    time: '2 hours ago',
    user: 'Admin',
    color: '#667eea'
  },
  {
    icon: Hotel,
    action: 'Updated hotel pricing',
    details: 'Grand Palace Hotel - Room rates',
    time: '4 hours ago',
    user: 'Manager',
    color: '#56ab2f'
  },
  {
    icon: Car,
    action: 'Added transfer service',
    details: 'Airport to Hotel - Luxury Car',
    time: '6 hours ago',
    user: 'Admin',
    color: '#f093fb'
  },
  {
    icon: User,
    action: 'New user registered',
    details: 'Travel Agent - Southeast Asia',
    time: '1 day ago',
    user: 'System',
    color: '#4facfe'
  },
];

export const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
          <p className="text-gray-500">Latest admin actions</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${activity.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: activity.color }} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-800">{activity.action}</p>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{activity.details}</p>
                <p className="text-xs text-gray-500">by {activity.user}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-xl transition-colors">
        View All Activities
      </button>
    </div>
  );
};