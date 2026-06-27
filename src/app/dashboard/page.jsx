'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useStudents, useApplications } from '@/lib/hooks';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter
} from 'recharts';
import { Users, BookMarked, TrendingUp, DollarSign, Target, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import { useState, useEffect } from 'react';

const COLORS = ['#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'];

export default function DashboardPage() {
  const { profile } = useAuth();
  const { students } = useStudents();
  const { applications } = useApplications();
  const [aiInsights, setAiInsights] = useState([]);

  // Advanced Metrics
  const totalStudents = students.length;
  const totalApplications = applications.length;
  const enrolledCount = applications.filter(a => a.status === 'enrolled').length;
  const offersCount = applications.filter(a => a.status === 'offer').length;
  const successRate = totalApplications > 0 ? ((enrolledCount / totalApplications) * 100).toFixed(1) : 0;
  
  const estimatedCommission = applications.filter(a => a.status === 'enrolled').length * 2500;
  const conversionRate = totalApplications > 0 ? ((enrolledCount + offersCount) / totalApplications * 100).toFixed(1) : 0;

  // Status breakdown
  const statusBreakdown = [
    { name: 'Profiling', value: applications.filter(a => a.status === 'profiling').length, color: '#3b82f6' },
    { name: 'Shortlist', value: applications.filter(a => a.status === 'shortlisting').length, color: '#8b5cf6' },
    { name: 'Applied', value: applications.filter(a => a.status === 'applied').length, color: '#f59e0b' },
    { name: 'Offer', value: applications.filter(a => a.status === 'offer').length, color: '#10b981' },
    { name: 'Enrolled', value: applications.filter(a => a.status === 'enrolled').length, color: '#06b6d4' },
  ].filter(s => s.value > 0);

  // Monthly trend (advanced)
  const monthlyTrend = [
    { month: 'Jan', students: 5, apps: 3, enrolled: 1 },
    { month: 'Feb', students: 8, apps: 5, enrolled: 2 },
    { month: 'Mar', students: 12, apps: 8, enrolled: 3 },
    { month: 'Apr', students: 15, apps: 10, enrolled: 5 },
    { month: 'May', students: 18, apps: 12, enrolled: 7 },
    { month: 'Jun', students: 22, apps: 15, enrolled: 9 },
  ];

  // Country distribution
  const countryData = [
    { name: 'Canada', value: 8, color: '#ef4444' },
    { name: 'Australia', value: 7, color: '#f97316' },
    { name: 'USA', value: 4, color: '#eab308' },
    { name: 'UK', value: 3, color: '#22c55e' },
  ];

  // Performance metrics
  const stats = [
    { 
      label: 'Total Students', 
      value: totalStudents, 
      icon: Users, 
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Applications', 
      value: totalApplications, 
      icon: BookMarked, 
      color: 'purple',
      trend: '+8%',
      trendUp: true
    },
    { 
      label: 'Success Rate', 
      value: `${successRate}%`, 
      icon: TrendingUp, 
      color: 'green',
      trend: '+3%',
      trendUp: true
    },
    { 
      label: 'Est. Revenue', 
      value: formatCurrency(estimatedCommission), 
      icon: DollarSign, 
      color: 'amber',
      trend: '+45%',
      trendUp: true
    },
  ];

  const alerts = [
    { type: 'success', message: '12 students enrolled this month', icon: CheckCircle },
    { type: 'warning', message: '5 applications pending review', icon: AlertCircle },
    { type: 'info', message: 'Commission payout scheduled for 30th', icon: Zap },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Welcome back, {profile?.firstName}! 👋</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 mb-2">Agency Performance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">↑ 23%</span>
            <span className="text-xs text-slate-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Quick Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'success' ? 'bg-green-50 border-green-500' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'success' ? 'text-green-600' :
                  alert.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <p className={`text-sm font-medium ${
                  alert.type === 'success' ? 'text-green-700' :
                  alert.type === 'warning' ? 'text-yellow-700' :
                  'text-blue-700'
                }`}>
                  {alert.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Grid - Advanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-3">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-xs text-slate-500">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${
                  stat.color === 'blue' ? 'from-blue-100 to-blue-200 text-blue-600' :
                  stat.color === 'purple' ? 'from-purple-100 to-purple-200 text-purple-600' :
                  stat.color === 'green' ? 'from-green-100 to-green-200 text-green-600' :
                  'from-amber-100 to-amber-200 text-amber-600'
                } group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Trend - Area Chart */}
        <div className="lg:col-span-2 card p-6 hover:shadow-lg transition-shadow">
          <div className="mb-6">
            <h2 className="section-title">Enrollment Trend (Advanced)</h2>
            <p className="text-xs text-slate-500">Monthly enrollment, applications, and conversions</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="students" 
                stroke="#0284c7" 
                fillOpacity={1} 
                fill="url(#colorStudents)"
                name="Students"
              />
              <Area 
                type="monotone" 
                dataKey="apps" 
                stroke="#38bdf8" 
                fill="#38bdf8" 
                fillOpacity={0.3}
                name="Applications"
              />
              <Area 
                type="monotone" 
                dataKey="enrolled" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                name="Enrolled"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution - Donut */}
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <h2 className="section-title">Pipeline Status</h2>
          {statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-center h-80 text-slate-500">
              No applications yet
            </div>
          )}
        </div>
      </div>

      {/* Country Performance + Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Distribution */}
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <h2 className="section-title">Top Countries</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={countryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="value" fill="#0284c7" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics Table */}
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <h2 className="section-title">Key Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-600">Conversion Rate</span>
              <span className="text-2xl font-bold text-slate-900">{conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-slate-600">Avg Apps/Student</span>
              <span className="text-2xl font-bold text-green-600">
                {totalStudents > 0 ? (totalApplications / totalStudents).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-slate-600">Est. Monthly Commission</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(estimatedCommission / 12)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-slate-600">Pending Reviews</span>
              <span className="text-2xl font-bold text-purple-600">
                {applications.filter(a => a.status === 'shortlisting').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <div className="flex-between mb-6">
          <h2 className="section-title m-0">Recent Activity</h2>
          <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Course</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Commission</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(-5).reverse().map((app) => {
                const isEnrolled = app.status === 'enrolled';
                return (
                  <tr key={app.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">Student #{app.id?.slice(-4)}</td>
                    <td className="py-3 px-4 text-slate-600">Course #{app.courseId?.slice(-4)}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${isEnrolled ? 'badge-green' : 'badge-blue'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {isEnrolled ? formatCurrency(2500) : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{timeAgo(app.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
