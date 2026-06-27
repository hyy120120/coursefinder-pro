'use client';

import { useApplications } from '@/lib/hooks';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import { APPLICATION_STATUS } from '@/lib/types';

export default function ApplicationsPage() {
  const { applications, loading, updateStatus } = useApplications();
  const [filter, setFilter] = useState('');

  const filteredApps = filter
    ? applications.filter((a) => a.status === filter)
    : applications;

  async function handleStatusChange(appId, newStatus) {
    try {
      let commission = null;
      if (newStatus === 'enrolled') {
        const input = window.prompt('Enter commission amount (₹):');
        if (input === null) return; // cancelled
        commission = parseFloat(input) || 0;
      }
      await updateStatus(appId, newStatus, commission);
    } catch (err) {
      console.error('Status update error:', err);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Track and manage student applications</p>
      </div>

      {/* Filter */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">All Applications</option>
            <option value="profiling">Profiling</option>
            <option value="shortlisting">Shortlisting</option>
            <option value="applied">Applied</option>
            <option value="offer">Offer</option>
            <option value="enrolled">Enrolled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Application ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Course</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Created</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <div className="flex-center gap-2">
                      <div className="spinner" />
                      Loading applications...
                    </div>
                  </td>
                </tr>
              ) : filteredApps.length ? (
                filteredApps.map((app) => {
                  const badge = getStatusBadge(app.status);
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-sm text-slate-600">
                        #{app.id?.slice(-6)}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-medium">
                        Student {app.studentId?.slice(-4)}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm">
                        Course {app.courseId?.slice(-4)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${badge.badge}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-sm">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="input-field text-xs py-1 px-2"
                        >
                          <option value="profiling">Profiling</option>
                          <option value="shortlisting">Shortlisting</option>
                          <option value="applied">Applied</option>
                          <option value="offer">Offer</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
