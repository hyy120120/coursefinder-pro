import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR') {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function formatDate(date, format = 'MMM dd, yyyy') {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d_ = String(d.getDate()).padStart(2, '0');
  const m = months[d.getMonth()];
  const y = d.getFullYear();
  return format.replace('dd', d_).replace('MMM', m).replace('yyyy', y);
}

export function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getInitials(name) {
  return name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
}

export function truncate(text, length = 50) {
  return text && text.length > length ? text.slice(0, length) + '...' : text;
}

export function slugify(text) {
  return text
    ?.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || '';
}

export function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export const STATUS_CONFIG = {
  profiling: { label: 'Profiling', bg: 'bg-blue-100', text: 'text-blue-700', badge: 'badge-blue' },
  shortlisting: { label: 'Shortlisting', bg: 'bg-purple-100', text: 'text-purple-700', badge: 'badge-purple' },
  applied: { label: 'Applied', bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'badge-yellow' },
  offer: { label: 'Offer', bg: 'bg-green-100', text: 'text-green-700', badge: 'badge-green' },
  enrolled: { label: 'Enrolled', bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'badge-emerald' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700', badge: 'badge-red' },
  visa: { label: 'Visa', bg: 'bg-indigo-100', text: 'text-indigo-700', badge: 'badge-indigo' },
};

export function getStatusBadge(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.profiling;
}
