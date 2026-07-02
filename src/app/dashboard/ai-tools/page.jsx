'use client';

import { useState, useRef, useEffect } from 'react';
import { useCourses } from '@/lib/hooks';
import { MessageCircle, FileText, CheckCircle, Globe, Zap, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const TAB_OPTIONS = [
  { id: 'chat', label: 'AI Chat', icon: MessageCircle },
  { id: 'sop', label: 'SOP Generator', icon: FileText },
  { id: 'eligibility', label: 'Eligibility Check', icon: CheckCircle },
  { id: 'visa', label: 'Visa Guidance', icon: Globe },
];

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">🤖 AI Tools Suite</h1>
        <p className="page-subtitle">
          Powered by Google Gemini AI - Get instant guidance for your study abroad journey
        </p>
      </div>

      {/* Alert */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
        <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-blue-900">AI-Powered Guidance</p>
          <p className="text-sm text-blue-700 mt-1">
            All responses are powered by Google Gemini 2.5 Flash. Answers are instant and personalized to your profile.
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="card">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-white">
          {TAB_OPTIONS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center md:justify-start gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600 bg-brand-50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content - CONDITIONAL RENDER */}
        <div className="p-6">
          {activeTab === 'chat' && <AIChat />}
          {activeTab === 'sop' && <SOPGenerator />}
          {activeTab === 'eligibility' && <EligibilityChecker />}
          {activeTab === 'visa' && <VisaGuidance />}
        </div>
      </div>
    </div>
  );
}

// ──── AI CHAT COMPONENT ────
function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], context: 'general' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Chat failed');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto space-y-4 border border-slate-200">
        {messages.length === 0 ? (
          <div className="flex-center h-full text-slate-500 text-center">
            <div>
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with your AI study abroad counselor</p>
              <p className="text-sm mt-2">Ask about courses, universities, requirements, etc.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-slate-200 text-slate-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-200 text-slate-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask your AI counselor anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="input-field flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Send'}
        </button>
      </form>
    </div>
  );
}

// ──── SOP GENERATOR COMPONENT ────
function SOPGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    education: 'Bachelors',
    cgpa: '3.5',
    targetProgram: 'Masters',
    targetUniversity: '',
    careerGoal: '',
    background: '',
    strengths: '',
  });

  async function handleGenerate(e) {
    e.preventDefault();
    if (!formData.name || !formData.targetProgram || !formData.careerGoal) {
      toast.error('Fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'SOP generation failed');

      setResult(data.sop);
      toast.success('SOP generated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="label-field">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Education</label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="input-field"
            >
              <option>Bachelors</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
          </div>
          <div>
            <label className="label-field">CGPA</label>
            <input
              type="text"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="input-field"
              placeholder="3.5"
            />
          </div>
        </div>

        <div>
          <label className="label-field">Target Program *</label>
          <input
            type="text"
            value={formData.targetProgram}
            onChange={(e) => setFormData({ ...formData, targetProgram: e.target.value })}
            className="input-field"
            placeholder="Masters in Computer Science"
            required
          />
        </div>

        <div>
          <label className="label-field">Target University</label>
          <input
            type="text"
            value={formData.targetUniversity}
            onChange={(e) => setFormData({ ...formData, targetUniversity: e.target.value })}
            className="input-field"
            placeholder="MIT, Stanford, etc."
          />
        </div>

        <div>
          <label className="label-field">Career Goal *</label>
          <input
            type="text"
            value={formData.careerGoal}
            onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
            className="input-field"
            placeholder="What do you want to do?"
            required
          />
        </div>

        <div>
          <label className="label-field">Background</label>
          <textarea
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
            className="input-field"
            rows="3"
            placeholder="Your academic/professional background"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader className="w-4 h-4 animate-spin inline mr-2" /> : null}
          {loading ? 'Generating...' : 'Generate SOP'}
        </button>
      </form>

      {/* Result */}
      <div className="space-y-4">
        {result && (
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Your SOP:</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{result}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                toast.success('Copied to clipboard!');
              }}
              className="btn-secondary w-full mt-4"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
        {!result && (
          <div className="flex-center h-96 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
            Your generated SOP will appear here
          </div>
        )}
      </div>
    </div>
  );
}

// ──── ELIGIBILITY CHECKER COMPONENT ────
function EligibilityChecker() {
  const { courses } = useCourses();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '3.5',
    ielts: '',
    toefl: '',
    gre: '',
    experience: 'Fresher',
    university: '',
    course: '',
  });

  const filteredCourses = courses.filter(c =>
    courseSearch.length < 2 ? false :
    c.name?.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.universityName?.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.country?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  async function handleCheck(e) {
    e.preventDefault();
    if (!formData.name || !formData.cgpa || !formData.university || !formData.course) {
      toast.error('Fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Eligibility check failed');

      setResult(data.analysis);
      toast.success('Eligibility analysis ready!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label className="label-field">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">CGPA *</label>
            <input
              type="text"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">IELTS Score</label>
            <input
              type="text"
              value={formData.ielts}
              onChange={(e) => setFormData({ ...formData, ielts: e.target.value })}
              className="input-field"
              placeholder="7.0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">GRE Score</label>
            <input
              type="text"
              value={formData.gre}
              onChange={(e) => setFormData({ ...formData, gre: e.target.value })}
              className="input-field"
              placeholder="320"
            />
          </div>
          <div>
            <label className="label-field">Experience</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="input-field"
            >
              <option>Fresher</option>
              <option>1-2 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label-field">Search Course *</label>
          <input
            type="text"
            value={courseSearch}
            onChange={(e) => {
              setCourseSearch(e.target.value);
              setFormData({ ...formData, course: '', university: '' });
            }}
            className="input-field"
            placeholder="Type course name, university, or country..."
          />
          {filteredCourses.length > 0 && (
            <div className="border border-slate-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg bg-white z-10 relative">
              {filteredCourses.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setFormData({ ...formData, course: c.name, university: c.universityName });
                    setCourseSearch(`${c.name} — ${c.universityName}`);
                  }}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                >
                  <p className="font-medium text-slate-900 text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.universityName} · {c.country} · {c.level}</p>
                </div>
              ))}
            </div>
          )}
          {courseSearch.length >= 2 && filteredCourses.length === 0 && (
            <p className="text-xs text-slate-400 mt-1">No courses found — try different keywords</p>
          )}
        </div>

        <div>
          <label className="label-field">University *</label>
          <input
            type="text"
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            className="input-field"
            placeholder="Auto-filled when course selected"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader className="w-4 h-4 animate-spin inline mr-2" /> : null}
          {loading ? 'Analyzing...' : 'Check Eligibility'}
        </button>
      </form>

      {/* Result */}
      <div className="space-y-4">
        {result && (
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Eligibility Analysis:</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}
        {!result && (
          <div className="flex-center h-96 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
            Eligibility analysis will appear here
          </div>
        )}
      </div>
    </div>
  );
}

// ──── VISA GUIDANCE COMPONENT ────
function VisaGuidance() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('CA');

  const countries = ['CA', 'AU', 'GB', 'US', 'DE', 'NZ'];
  const countryNames = {
    CA: 'Canada',
    AU: 'Australia',
    GB: 'United Kingdom',
    US: 'United States',
    DE: 'Germany',
    NZ: 'New Zealand',
  };

  async function handleGetGuidance() {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/visa-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryNames[selectedCountry] }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Visa guidance failed');

      setResult(data.guidance);
      toast.success('Visa guidance loaded!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Country Selector */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {countries.map((code) => (
          <button
            key={code}
            onClick={() => {
              setSelectedCountry(code);
              setResult('');
            }}
            className={`p-3 rounded-lg font-medium transition-all ${
              selectedCountry === code
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      <button onClick={handleGetGuidance} disabled={loading} className="btn-primary w-full">
        {loading ? <Loader className="w-4 h-4 animate-spin inline mr-2" /> : null}
        {loading ? 'Loading...' : `Get ${countryNames[selectedCountry]} Visa Guidance`}
      </button>

      {/* Result */}
      {result && (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">{countryNames[selectedCountry]} Visa Guidance:</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>
      )}
      {!result && (
        <div className="flex-center h-96 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
          Select a country and click above to get visa guidance
        </div>
      )}
    </div>
  );
}