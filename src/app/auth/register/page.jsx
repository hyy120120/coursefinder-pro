'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
    phone: '',
    country: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Fill in all required fields');
        return;
      }
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-slate-50 px-4 py-8">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card-elevated p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-600 mt-2">Step {step} of 2</p>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-brand-600' : 'bg-slate-200'}`} />
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
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
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label-field">Agency Name</label>
                  <input
                    type="text"
                    placeholder="Your Agency Name"
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label-field">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <button type="submit" className="btn-primary w-full mt-6">
                  Next
                </button>
              </>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <>
                <div>
                  <label className="label-field">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Minimum 6 characters</p>
                </div>

                <div>
                  <label className="label-field">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? <span className="spinner mr-2" /> : null}
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="link-primary font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
