'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { userService, agencyService } from '@/lib/firebase/services';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  async function fetchProfile(uid) {
    try {
      const data = await userService.get(uid);
      if (data) {
        setProfile(data);
        return data;
      }
      console.warn('No profile found for uid:', uid);
      return null;
    } catch (err) {
      console.error('fetchProfile error:', err);
      return null;
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          await fetchProfile(firebaseUser.uid);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  // Email + Password Register
  async function register({ email, password, firstName, lastName, agencyName, phone, country }) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const uid = result.user.uid;

      // Update Firebase Auth profile
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create agency
      const agencyId = `${uid}_agency`;
      await agencyService.create(agencyId, {
        name: agencyName,
        ownerId: uid,
        primaryColor: '#0284c7',
        secondaryColor: '#38bdf8',
        subdomain: agencyName.toLowerCase().replace(/\s+/g, '-'),
        tagline: 'Your dream university, simplified.',
        walletBalance: 0,
        tier: 'free',
        isActive: true,
      });

      // Create user profile
      await userService.create(uid, {
        uid,
        email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phone: phone || '',
        country: country || '',
        role: 'agent',
        agencyId,
        isActive: true,
      });

      await fetchProfile(uid);
      return result;
    } catch (err) {
      console.error('Register error:', err);
      throw new Error(err.message || 'Registration failed');
    }
  }

  // Email + Password Login
  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      await fetchProfile(result.user.uid);
      return result;
    } catch (err) {
      console.error('Login error:', err);
      throw new Error(err.message || 'Login failed');
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw new Error(err.message || 'Logout failed');
    }
  }

  // Reset Password
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Reset password error:', err);
      throw new Error(err.message || 'Password reset failed');
    }
  }

  // Refresh Profile
  async function refreshProfile() {
    if (user?.uid) {
      await fetchProfile(user.uid);
    }
  }

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
