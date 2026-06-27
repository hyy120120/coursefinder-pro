export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-slate-600 mb-8">Page not found</p>
        <a href="/dashboard" className="btn-primary">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
