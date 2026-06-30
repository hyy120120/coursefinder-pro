'use client';

import { useState } from 'react';
import { useCourses } from '@/lib/hooks';
import { Search, Filter } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { COUNTRIES, FIELDS_OF_STUDY, COURSE_LEVELS } from '@/lib/types';

export default function CoursesPage() {
  const [filters, setFilters] = useState({ country: '', field: '', level: '', search: '' });
  const { courses, loading } = useCourses(filters);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Course Database</h1>
        <p className="page-subtitle">Browse and match courses worldwide</p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label-field">Search Courses</label>
            <input
              type="text"
              placeholder="MIT, Harvard..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Country</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="input-field"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">Field</label>
            <select
              value={filters.field}
              onChange={(e) => setFilters({ ...filters, field: e.target.value })}
              className="input-field"
            >
              <option value="">All Fields</option>
              {FIELDS_OF_STUDY.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">Level</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="input-field"
            >
              <option value="">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="diploma">Diploma</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex-center min-h-96">
          <div className="spinner spinner-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer">
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
                    {course.country}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{course.universityName}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tuition</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(course.tuitionFee, course.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-semibold text-slate-900">{course.durationMonths} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Commission</span>
                    <span className="font-semibold text-green-600">{course.commissionRate}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <span className="badge badge-blue text-xs">{course.level}</span>
                  {course.qsRanking && (
                    <span className="badge badge-purple text-xs">QS Rank: #{course.qsRanking}</span>
                  )}
                </div>

                <button className="btn-primary w-full mt-6 text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-slate-500 mb-4">No courses found matching your criteria</p>
          <button
            onClick={() => setFilters({ country: '', field: '', level: '', search: '' })}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
