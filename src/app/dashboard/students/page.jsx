'use client';

import { useState } from 'react';
import { useStudents } from '@/lib/hooks';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function StudentsPage() {
  const { students, loading, addStudent, deleteStudent } = useStudents();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    academicProfile: { cgpa: '', board: '', year: '' },
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredStudents = students.filter(
    (s) =>
      s.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleAddStudent(e) {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      toast.error('Fill in required fields');
      return;
    }
    setSubmitting(true);
    try {
      await addStudent(formData);
      toast.success('Student added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nationality: '',
        academicProfile: { cgpa: '', board: '', year: '' },
      });
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this student? This cannot be undone.')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted');
    } catch (err) {
      toast.error('Failed to delete student');
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage your student database</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">CGPA</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Added</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    <div className="flex-center gap-2">
                      <div className="spinner" />
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{student.email}</td>
                    <td className="py-3 px-4 text-slate-600">{student.phone || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.academicProfile?.cgpa || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-sm">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="btn-ghost">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Add New Student</h2>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label-field">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label-field">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">CGPA</label>
                <input
                  type="text"
                  value={formData.academicProfile.cgpa}
                  onChange={(e) => setFormData({
                    ...formData,
                    academicProfile: { ...formData.academicProfile, cgpa: e.target.value }
                  })}
                  className="input-field"
                  placeholder="3.5"
                />
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
                  {submitting ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
