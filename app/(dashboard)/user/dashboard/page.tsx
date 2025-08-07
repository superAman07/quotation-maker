'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  FileText,
  Send,
  DollarSign,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Search
} from 'lucide-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { get } from 'http';

export default function Dashboard() {
  const [stats, setStats] = useState({
    drafted: 0,
    sent: 0,
    revenue: 0
  });

  const [recentQuotes, setRecentQuotes] = useState<
    {
      id: string;
      quotationNo?: string;
      clientName?: string;
      clientEmail?: string;
      place?: string;
      travelDate?: string;
      groupSize?: number;
      totalGroupCost?: number;
      totalNights?: number;
      status: string;
    }[]
  >([]);

  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  const [filteredQuotations, setFilteredQuotations] = useState<any[]>([]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredQuotations(
      recentQuotes.filter((quotation) => {
        const matchesSearch =
          (quotation.quotationNo ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quotation.clientName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quotation.clientEmail ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quotation.place ?? '').toLowerCase().includes(searchTerm.toLowerCase());

        const travelDate = quotation.travelDate ? new Date(quotation.travelDate) : null;

        return matchesSearch;
      })
    );
  }, [searchTerm, recentQuotes]);

  useEffect(() => {
    try {
      axios.get("/api/user/me")
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null));
    } catch { }
  }, [])

  useEffect(() => {
    axios.get("/api/user/quotations")
      .then(res => {
        setRecentQuotes(res.data);
        setFilteredQuotations(res.data);
      })
      .catch(() => setRecentQuotes([]));
  }, []);

  // console.log("Recent Quotes:",recentQuotes);

  useEffect(() => {
    let sum =0;
    let sentCount = 0;
    let draftedCount = 0;
    recentQuotes.forEach((e)=>{
      if(e.status.toLowerCase() === 'sent')sentCount++;
      if(e.status.toLowerCase() === 'draft')draftedCount++;
      if(e.totalGroupCost) sum += e.totalGroupCost;
    })
    setStats({
      drafted: draftedCount,
      sent: sentCount,
      revenue: sum
    });
  }, [recentQuotes])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#3e482e] to-[#9baa82] text-white p-6 rounded-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-green-100">Ready to create amazing travel experiences?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quotes Drafted</p>
                <p className="text-2xl font-bold text-[#252426]">{stats?.drafted}</p>
              </div>
              <FileText className="w-8 h-8 text-[#6C733D]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quotes Sent</p>
                <p className="text-2xl font-bold text-[#252426]">{stats?.sent}</p>
              </div>
              <Send className="w-8 h-8 text-[#9DA65D]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-[#252426]">${stats?.revenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#6C733D]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-[#252426]">{recentQuotes.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#9DA65D]" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/user/dashboard/quotation/new"
            className="bg-[#3e482e] hover:bg-[#505942] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            New Quotation
          </a>
          <a
            href="/user/dashboard/quotations"
            className="border border-[#6C733D] text-[#6C733D] hover:bg-[#3e482e] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
          >
            <FileText className="w-5 h-5" />
            View All Quotes
          </a>
        </div>

        {/* Recent Quotes */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl font-bold text-[#252426]">Recent Quotations</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3e482e] w-4 h-4" />
                <Input
                  placeholder="Search by quotation no, client, destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-gray-500 focus:ring-[#6C733D] focus:border-[#6C733D] border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 overflow-auto">
              <table className="w-full">
                <thead className="bg-[#f3f6ee] sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Quote No</th>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Client</th>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Destination</th>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Travel Date</th>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Group Size</th>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Nights</th>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Total Cost</th>
                    <th className="text-left p-4 font-semibold text-[#6C733D]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotations.map((quotation, index) => (
                    <tr
                      key={quotation.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                    >
                      <td className="p-4">
                        <div className="font-medium text-[#252426]">
                          {quotation.quotationNo}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[#252426]">{quotation.clientName}</div>
                        <div className="text-sm text-gray-400">{quotation.clientEmail}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#3e482e]" />
                          <span className="text-[#252426] capitalize">{quotation.place}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#3e482e]" />
                          <span className="text-[#252426]">{formatDate(quotation.travelDate)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#3e482e]" />
                          <span className="text-[#252426]">{quotation.groupSize}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[#252426]">{quotation.totalNights}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-[#252426]">
                          ₹{quotation.totalGroupCost ? quotation.totalGroupCost.toLocaleString() : '0'}
                        </div>
                        <div className="text-sm text-gray-400">
                          ₹{quotation.totalPerHead ? quotation.totalPerHead.toLocaleString() : '0'}/person
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                          {quotation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredQuotations.length === 0 && (
                <div className="text-center py-8 text-[#bbc387]">
                  No quotations found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}