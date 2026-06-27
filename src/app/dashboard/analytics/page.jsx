'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useStudents, useApplications } from '@/lib/hooks';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award, DollarSign } from 'lucide-react';

const COLORS = ['#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'];

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const { students } = useStudents();
  const { applications } = useApplications();

  // Metrics
  const totalApplications = applications.length;
  const enrolledCount = applications.filter((a) => a.status === 'enrolled').length;
  const successRate = totalApplications > 0 ? ((enrolledCount / totalApplications) * 100).toFixed(1) : 0;
  const avgStudentValue = students.length > 0 ? (5000 / students.length).toFixed(0) : 0;

  // Status distribution
  const statusData = [
    { name: 'Profiling', value: applications.filter((a) => a.status === 'profiling').length },
    { name: 'Shortlisting', value: applications.filter((a) => a.status === 'shortlisting').length },
    { name: 'Applied', value: applications.filter((a) => a.status === 'applied').length },
    { name: 'Offer', value: applications.filter((a) => a.status === 'offer').length },
    { name: 'Enrolled', value: applications.filter((a) => a.status === 'enrolled').length },
  ].filter((s) => s.value > 0);

  // Monthly trend
  const monthlyTrend = [
    { month: 'Jan', students: 5, applications: 3 },
    { month: 'Feb', students: 8, applications: 5 },
    { month: 'Mar', students: 12, applications: 8 },
    { month: 'Apr', students: 15, applications: 10 },
    { month: 'May', students: 18, applications: 12 },
    { month: 'Jun', students: 22, applications: 15 },
  ];

  const metrics = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'brand' },
    { label: 'Applications', value: totalApplications, icon: Award, color: 'blue' },
    { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: 'green' },
    { label: 'Est. Revenue', value: `₹${(totalApplications * 5000).toLocaleString()}`, icon: DollarSign, color: 'amber' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Analytics & Insights</h1>
        <p className="page-subtitle">Track your agency performance metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-brand-100 text-brand-600">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="card p-6">
          <h2 className="section-title">Enrollment Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ fill: '#0284c7', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        {statusData.length > 0 && (
          <div className="card p-6">
            <h2 className="section-title">Application Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="card p-6">
        <h2 className="section-title">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-slate-600 mb-2">Average Value per Student</p>
            <p className="text-2xl font-bold text-blue-600">₹{avgStudentValue}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-slate-600 mb-2">Conversion Rate</p>
            <p className="text-2xl font-bold text-green-600">{successRate}%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-sm text-slate-600 mb-2">Avg Applications per Student</p>
            <p className="text-2xl font-bold text-purple-600">
              {students.length > 0 ? (totalApplications / students.length).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
