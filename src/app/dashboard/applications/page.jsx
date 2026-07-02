'use client';

import { useApplications, useStudents, useCourses } from '@/lib/hooks';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { APPLICATION_STATUS } from '@/lib/types';
import toast from 'react-hot-toast';

export default function ApplicationsPage() {
  const { applications, loading, updateStatus, createApplication } = useApplications();
  const { students } = useStudents();
  const { courses } = useCourses();
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newApp, setNewApp] = useState({ studentId: '', courseId: '' });

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

  async function handleCreateApplication(e) {
    e.preventDefault();
    if (!newApp.studentId || !newApp.courseId) {
      toast.error('Select both student and course');
      return;
    }
    setSubmitting(true);
    try {
      await createApplication({
        studentId: newApp.studentId,
        courseId: newApp.courseId,
        status: 'profiling',
      });
      toast.success('Application created!');
      setNewApp({ studentId: '', courseId: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Create application error:', err);
      toast.error('Failed to create application');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">Track and manage student applications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Application
        </button>
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

      {/* New Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">New Application</h2>
            </div>

            <form onSubmit={handleCreateApplication} className="p-6 space-y-4">
              <div>
                <label className="label-field">Student *</label>
                <select
                  value={newApp.studentId}
                  onChange={(e) => setNewApp({ ...newApp, studentId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.email})
                    </option>
                  ))}
                </select>
                {students.length === 0 && (
                  <p className="text-xs text-slate-500 mt-1">No students yet — add one from Students page first.</p>
                )}
              </div>

              <div>
                <label className="label-field">Course *</label>
                <select
                  value={newApp.courseId}
                  onChange={(e) => setNewApp({ ...newApp, courseId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.universityName} ({c.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? 'Creating...' : 'Create Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
