'use client';

import { useApplications } from '@/lib/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Download, Eye, Send, MoreVertical } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const COMMISSION_RATE = 0.30; // 30% of commission goes to platform

export default function CommissionsPage() {
  const { applications } = useApplications();

  // Calculate commission data
  const enrolledApps = applications.filter(a => a.status === 'enrolled');
  const totalCommissionEarned = enrolledApps.reduce((sum, a) => sum + (a.commission || 0), 0);
  const platformShare = totalCommissionEarned * COMMISSION_RATE;
  const agentShare = totalCommissionEarned * (1 - COMMISSION_RATE);
  const pendingCommission = applications
    .filter(a => a.status === 'offer')
    .reduce((sum, a) => sum + (a.commission || 0), 0);

  // Monthly commission trend
  const commissionTrend = [
    { month: 'Jan', earned: 5000, paid: 3500 },
    { month: 'Feb', earned: 7500, paid: 5250 },
    { month: 'Mar', earned: 10000, paid: 7000 },
    { month: 'Apr', earned: 15000, paid: 10500 },
    { month: 'May', earned: 18000, paid: 12600 },
    { month: 'Jun', earned: 22500, paid: 15750 },
  ];

  // Detailed commission breakdown
  const commissionBreakdown = enrolledApps.map((app, idx) => ({
    id: app.id,
    studentId: `Student #${app.studentId?.slice(-4) || app.id?.slice(-4)}`,
    courseId: `Course #${app.courseId?.slice(-4)}`,
    grossCommission: app.commission || 0,
    platformFee: Math.round((app.commission || 0) * COMMISSION_RATE),
    yourShare: Math.round((app.commission || 0) * (1 - COMMISSION_RATE)),
    status: 'paid',
    dateEnrolled: app.updatedAt?.toDate?.().toLocaleDateString() || '—',
    invoiceId: `INV-${1001 + idx}`,
  }));

  const stats = [
    {
      label: 'Total Earned',
      value: formatCurrency(totalCommissionEarned),
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Your Share (70%)',
      value: formatCurrency(agentShare),
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Pending',
      value: formatCurrency(pendingCommission),
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      label: 'Total Paid Out',
      value: formatCurrency(agentShare * 0.8),
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">💰 Commission Management</h1>
        <p className="page-subtitle">Track earnings, invoices, and payouts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg p-6 border border-current border-opacity-20`}>
            <p className="text-sm font-medium opacity-80 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Commission Model Explanation */}
      <div className="card p-6">
        <h2 className="section-title">📊 Commission Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-600 text-sm mb-2">Gross Commission</p>
            <p className="text-2xl font-bold text-slate-900">$2,500</p>
            <p className="text-xs text-slate-500 mt-2">Per enrolled student</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-3xl font-bold text-slate-300">÷</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 font-semibold">Your Share: $1,750 (70%)</p>
            <p className="text-green-600 text-sm mt-2">Platform Fee: $750 (30%)</p>
          </div>
        </div>
      </div>

      {/* Commission Trend Chart */}
      <div className="card p-6">
        <h2 className="section-title">📈 Monthly Commission Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={commissionTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }} />
            <Legend />
            <Line type="monotone" dataKey="earned" stroke="#10b981" strokeWidth={2} name="Earned" />
            <Line type="monotone" dataKey="paid" stroke="#0284c7" strokeWidth={2} name="Paid Out" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Commission Ledger */}
      <div className="card p-6">
        <div className="flex-between mb-6">
          <h2 className="section-title m-0">📋 Commission Ledger</h2>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Invoice</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Gross</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Your Share</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissionBreakdown.map((row) => (
                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{row.invoiceId}</td>
                  <td className="py-3 px-4 text-slate-600">{row.studentId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{formatCurrency(row.grossCommission)}</td>
                  <td className="py-3 px-4 font-bold text-green-600">{formatCurrency(row.yourShare)}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-green">{row.status}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{row.dateEnrolled}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-brand-600 hover:text-brand-700 font-medium">
                      <Eye className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payout */}
        <div className="card p-6 border-2 border-yellow-200 bg-yellow-50">
          <h3 className="font-semibold text-slate-900 mb-4">⏳ Pending Payout</h3>
          <p className="text-3xl font-bold text-yellow-700 mb-6">{formatCurrency(pendingCommission * 0.7)}</p>
          <p className="text-sm text-slate-700 mb-4">
            From {applications.filter(a => a.status === 'offer').length} pending enrollments
          </p>
          <button className="btn-primary w-full" disabled>
            <Send className="w-4 h-4 inline mr-2" />
            Payout in 30 days
          </button>
        </div>

        {/* Bank Details */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">🏦 Bank Account</h3>
          <div className="space-y-3 mb-6 text-sm">
            <div>
              <p className="text-slate-600">Account Holder</p>
              <p className="font-semibold text-slate-900">Your Name</p>
            </div>
            <div>
              <p className="text-slate-600">Account Number</p>
              <p className="font-semibold text-slate-900">**** **** **** 1234</p>
            </div>
            <div>
              <p className="text-slate-600">Bank</p>
              <p className="font-semibold text-slate-900">Your Bank Name</p>
            </div>
          </div>
          <button className="btn-secondary w-full">Update Bank Details</button>
        </div>
      </div>

      {/* FAQ */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">❓ Commission FAQs</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-slate-900">When do I get paid?</p>
            <p className="text-slate-600 mt-1">Commissions are paid out within 7 days of enrollment confirmation.</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">What if an enrollment gets cancelled?</p>
            <p className="text-slate-600 mt-1">Commission is refunded if student withdraws within 30 days of enrollment.</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">How do I track my earnings?</p>
            <p className="text-slate-600 mt-1">All commissions are tracked in real-time on this dashboard. Export reports anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
