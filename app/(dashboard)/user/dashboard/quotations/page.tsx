'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@react-pdf/renderer';
import { QuotationPDF } from '@/components/Quotation-pdf';

export default function QuotationsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);

  const [quotations, setQuotations] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/quotations')
      .then(res => res.json())
      .then(data => {
        setQuotations(data);
        setLoading(false);
      });
  }, []);

  const handleDownloadClick = async (id: string) => {
    setShowPdfPreview(true);
    setLoading(true);
    const res = await fetch(`/api/user/quotations/${id}`);
    const data = await res.json();
    setSelectedQuotation({
      ...data,
      logoUrl: data.logoUrl && data.logoUrl.trim() !== '' ? data.logoUrl : '/logo.png',
    });
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  interface Quotation {
    id: string;
    quotationNo: string;
    clientName: string;
    place: string | null;
    travelDate: string;
    status: string;
    totalGroupCost: number;
    groupSize: number;
  }

  interface DateRange {
    start: string;
    end: string;
  }

  const filteredQuotations = (quotations as Quotation[]).filter((quote: Quotation) => {
    const matchesSearch =
      (quote.clientName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.place ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.id ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || quote.status.toLowerCase() === statusFilter;

    return matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#252426]">All Quotations</h1>
            <p className="text-gray-600 mt-1">Manage and track all your travel quotations</p>
          </div>
          <a
            href="/quotation/new"
            className="bg-[#6C733D] hover:bg-[#5a5f33] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Quotation
          </a>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by client, destination, or ID..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 h-10 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quotations List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredQuotations.map((quote) => (
              <div key={quote.id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-[#252426]">{quote.clientName}</h3>
                    <p className="text-sm text-gray-600">{quote.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Destination:</span> {quote.place || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(quote.travelDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Travelers:</span> {quote.groupSize}
                  </p>
                  <p className="text-lg font-bold text-[#6C733D]">
                    ${typeof quote.totalGroupCost === 'number' ? quote.totalGroupCost.toLocaleString() : '0'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#6C733D] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#5a5f33] transition-colors flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  {/* <button className="flex-1 border border-[#6C733D] text-[#6C733D] py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#6C733D] hover:text-white transition-colors flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button> */}
                  <button className="flex-1 border border-gray-300 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#252426]">
                      {quote.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#252426]">{quote.clientName}</div>
                        <div className="text-sm text-gray-500">{quote.groupSize} travelers</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {quote.place ? quote.place : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(quote.travelDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#6C733D]">
                      {/* ${quote.total.toLocaleString()} */}
                      ${typeof quote.totalGroupCost === 'number' ? quote.totalGroupCost.toLocaleString() : '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Link href={`/user/dashboard/quotations/${quote.id}`} className="text-[#6C733D] hover:text-[#5a5f33] p-1" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {/* <Link href={`/user/dashboard/quotations/${quote.id}/edit`} className="text-[#6C733D] hover:text-[#5a5f33] p-1" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link> */}
                        <button onClick={() => handleDownloadClick(quote.id)} className="text-[#6C733D] hover:text-[#5a5f33] p-1" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredQuotations.length} of {filteredQuotations.length} results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 bg-[#6C733D] text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {showPdfPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full h-[80vh] flex flex-col">
            <Button
              className="self-end cursor-pointer mb-2 text-red-500"
              variant="ghost"
              onClick={() => setShowPdfPreview(false)}
            >
              Close
            </Button>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">Loading PDF...</div>
            ) : (
              <PDFViewer width="100%" height="100%">
                <QuotationPDF payload={selectedQuotation} />
              </PDFViewer>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}