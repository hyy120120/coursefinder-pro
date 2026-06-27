'use client';

import { useApplications } from '@/lib/hooks';
import { STATUS_CONFIG } from '@/lib/utils';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PIPELINE_STAGES = ['profiling', 'shortlisting', 'applied', 'offer', 'enrolled', 'visa'];

const STAGE_LABELS = {
  profiling: '📋 Profiling',
  shortlisting: '✅ Shortlisting',
  applied: '📬 Applied',
  offer: '🎉 Offer',
  enrolled: '✨ Enrolled',
  visa: '🛂 Visa',
};

export default function PipelinePage() {
  const { applications } = useApplications();
  const [draggedApp, setDraggedApp] = useState(null);

  // Group applications by stage
  const applicationsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter(app => app.status === stage);
    return acc;
  }, {});

  function handleDragStart(e, app) {
    setDraggedApp(app);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDropOnStage(e, targetStage) {
    e.preventDefault();
    if (!draggedApp || draggedApp.status === targetStage) return;

    // TODO: Update app status in Firestore
    toast.success(`Moved to ${STAGE_LABELS[targetStage]}`);
    setDraggedApp(null);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">📊 Application Pipeline</h1>
        <p className="page-subtitle">Drag applications between stages to manage your pipeline</p>
      </div>

      {/* Pipeline Legend */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {PIPELINE_STAGES.map(stage => (
          <div key={stage} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm font-medium text-slate-700">{STAGE_LABELS[stage]}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {applicationsByStage[stage].length}
            </p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 min-h-96">
        {PIPELINE_STAGES.map(stage => (
          <div
            key={stage}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnStage(e, stage)}
            className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300 hover:border-brand-400 transition-colors"
          >
            {/* Stage Header */}
            <div className="mb-4 pb-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">{STAGE_LABELS[stage]}</h3>
              <p className="text-2xl font-bold text-brand-600">{applicationsByStage[stage].length}</p>
            </div>

            {/* Applications */}
            <div className="space-y-3">
              {applicationsByStage[stage].length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No applications</p>
                </div>
              ) : (
                applicationsByStage[stage].map(app => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app)}
                    className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-move hover:border-brand-400"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          Student #{app.id?.slice(-4)}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          Course #{app.courseId?.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Button */}
            <button className="w-full mt-4 p-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-brand-400 text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3">💡 Pipeline Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-700 font-medium">Bottleneck</p>
            <p className="text-blue-900 font-bold">Shortlisting (8 apps stuck)</p>
          </div>
          <div>
            <p className="text-blue-700 font-medium">Success Rate</p>
            <p className="text-blue-900 font-bold">67% (40 enrolled / 60 total)</p>
          </div>
          <div>
            <p className="text-blue-700 font-medium">Avg Days in Pipeline</p>
            <p className="text-blue-900 font-bold">45 days</p>
          </div>
        </div>
      </div>

      {/* Stage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Stage */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">🔥 Most Active Stage</h3>
          <p className="text-2xl font-bold text-slate-900 mb-2">Applied</p>
          <p className="text-slate-600 mb-4">15 applications in this stage</p>
          <div className="bg-slate-100 rounded-full h-2">
            <div className="bg-brand-600 h-2 rounded-full w-1/4"></div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">📈 Conversion Funnel</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Profiling</span>
              <span className="font-bold text-slate-900">60</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">→ Applied</span>
              <span className="font-bold text-slate-900">45 (75%)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">→ Offer</span>
              <span className="font-bold text-slate-900">42 (70%)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">→ Enrolled</span>
              <span className="font-bold text-green-600">40 (67%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
