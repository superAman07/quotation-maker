'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  FileText, 
  Send, 
  DollarSign, 
  Plus,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const [stats] = useState({
    drafted: 12,
    sent: 8,
    revenue: 45600,
    totalQuotes: 23
  });

  const recentQuotes = [
    { id: 'Q001', client: 'John Smith', destination: 'Paris', amount: 2500, status: 'Draft' },
    { id: 'Q002', client: 'Sarah Johnson', destination: 'Tokyo', amount: 3200, status: 'Sent' },
    { id: 'Q003', client: 'Mike Wilson', destination: 'London', amount: 1800, status: 'Approved' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#6C733D] to-[#9DA65D] text-white p-6 rounded-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
          <p className="text-green-100">Ready to create amazing travel experiences?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quotes Drafted</p>
                <p className="text-2xl font-bold text-[#252426]">{stats.drafted}</p>
              </div>
              <FileText className="w-8 h-8 text-[#6C733D]" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quotes Sent</p>
                <p className="text-2xl font-bold text-[#252426]">{stats.sent}</p>
              </div>
              <Send className="w-8 h-8 text-[#9DA65D]" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-[#252426]">${stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#6C733D]" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-[#252426]">{stats.totalQuotes}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#9DA65D]" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="/quotation/new" 
            className="bg-[#6C733D] hover:bg-[#5a5f33] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            New Quotation
          </a>
          <a 
            href="/quotations" 
            className="border border-[#6C733D] text-[#6C733D] hover:bg-[#6C733D] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
          >
            <FileText className="w-5 h-5" />
            View All Quotes
          </a>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Recent Quotations</h2>
          <div className="space-y-4">
            {recentQuotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#6C733D] text-white rounded-full flex items-center justify-center font-bold">
                    {quote.id.slice(-1)}
                  </div>
                  <div>
                    <p className="font-medium text-[#252426]">{quote.client}</p>
                    <p className="text-sm text-gray-600">{quote.destination}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#252426]">${quote.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    quote.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}