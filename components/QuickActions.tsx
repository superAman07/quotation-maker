'use client'
import React from 'react';
import { Zap, Plus, FileText, TrendingUp, Settings } from 'lucide-react';

const quickActions = [
  {
    title: 'New Package',
    icon: Plus,
    color: '#667eea',
    description: 'Create travel package'
  },
  {
    title: 'Generate Report',
    icon: FileText,
    color: '#56ab2f',
    description: 'Monthly analytics'
  },
  {
    title: 'View Analytics',
    icon: TrendingUp,
    color: '#f093fb',
    description: 'Performance metrics'
  },
  {
    title: 'System Settings',
    icon: Settings,
    color: '#4facfe',
    description: 'Configure system'
  },
];

export const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
          <p className="text-gray-500">Shortcut to common tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 text-left group hover-lift"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};