import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const metadata = {
  title: 'CourseFinder Pro – B2B Study Abroad Platform',
  description: 'Professional study abroad recruitment platform for education agents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#111',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
