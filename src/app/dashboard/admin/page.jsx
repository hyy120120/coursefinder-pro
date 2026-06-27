'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      toast.error('Unauthorized: Admin access only');
      router.push('/dashboard');
    }
  }, [profile, router]);

  useEffect(() => {
    // In production, fetch agencies from Firestore
    // For now, show mock data
    setLoading(false);
  }, []);

  const mockData = [
    { name: 'Elite Consultants', students: 45, apps: 120, enrolled: 32, commission: 250000 },
    { name: 'Global Education', students: 38, apps: 95, enrolled: 28, commission: 210000 },
    { name: 'Dream Abroad', students: 52, apps: 140, enrolled: 40, commission: 300000 },
    { name: 'Study Wings', students: 31, apps: 82, enrolled: 22, commission: 165000 },
  ];

  const stats = [
    { label: 'Total Agencies', value: mockData.length, icon: Shield },
    { label: 'Total Students', value: mockData.reduce((sum, a) => sum + a.students, 0), icon: Users },
    { label: 'Success Rate', value: '67%', icon: TrendingUp },
    { label: 'High Risk', value: 2, icon: AlertTriangle },
  ];

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="flex-center h-screen">
        <div className="text-center">
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-brand-600" />
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System-wide metrics and agency management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-brand-100 text-brand-600">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agency Performance Chart */}
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <h2 className="section-title">Agency Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }} />
            <Legend />
            <Bar dataKey="students" fill="#0284c7" name="Students" radius={[8, 8, 0, 0]} />
            <Bar dataKey="enrolled" fill="#10b981" name="Enrolled" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agencies Table */}
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <h2 className="section-title">Agencies Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Agency Name</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Students</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Applications</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Enrolled</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Success Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Commission</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((agency, idx) => {
                const successRate = ((agency.enrolled / agency.apps) * 100).toFixed(1);
                return (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">{agency.name}</td>
                    <td className="py-3 px-4 text-slate-600">{agency.students}</td>
                    <td className="py-3 px-4 text-slate-600">{agency.apps}</td>
                    <td className="py-3 px-4 text-slate-600">{agency.enrolled}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-green">{successRate}%</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      ₹{agency.commission.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-brand-600 hover:text-brand-700 font-medium text-sm">
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Status */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Database Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Users</span>
              <span className="badge badge-green">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Applications</span>
              <span className="badge badge-green">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Firestore</span>
              <span className="badge badge-green">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">API Rate Limit</span>
              <span className="text-sm text-slate-500">843/1000</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent System Activity</h3>
          <div className="space-y-3 text-sm">
            <p className="text-slate-600">✅ All agencies synced</p>
            <p className="text-slate-600">✅ Database backup completed</p>
            <p className="text-slate-600">✅ Email service operational</p>
            <p className="text-slate-600">✅ AI service (Gemini) connected</p>
            <p className="text-slate-600">✅ Last system check: 2 mins ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
