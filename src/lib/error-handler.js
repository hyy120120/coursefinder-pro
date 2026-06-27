// Error handling and logging service for production

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogs = 100;
  }

  // Log error with context
  logError(error, context = {}) {
    const errorEntry = {
      message: error.message || String(error),
      stack: error.stack,
      code: error.code,
      timestamp: new Date().toISOString(),
      context: {
        url: typeof window !== 'undefined' ? window.location.href : 'SSR',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        ...context,
      },
      severity: this.calculateSeverity(error),
    };

    this.errorLog.push(errorEntry);

    // Keep only last N errors
    if (this.errorLog.length > this.maxLogs) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('📛 Error:', errorEntry);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ERROR_TRACKING_URL) {
      this.sendToTracking(errorEntry);
    }

    return errorEntry;
  }

  // Calculate error severity
  calculateSeverity(error) {
    if (error.message?.includes('Network')) return 'HIGH';
    if (error.message?.includes('Auth')) return 'HIGH';
    if (error.message?.includes('Database')) return 'HIGH';
    if (error.message?.includes('Timeout')) return 'MEDIUM';
    return 'LOW';
  }

  // Send error to tracking service
  async sendToTracking(errorEntry) {
    try {
      await fetch(process.env.NEXT_PUBLIC_ERROR_TRACKING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorEntry),
      });
    } catch (err) {
      console.error('Failed to send error to tracking:', err);
    }
  }

  // Get all logged errors
  getErrorLog() {
    return this.errorLog;
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }

  // Get errors by severity
  getErrorsBySeverity(severity) {
    return this.errorLog.filter(e => e.severity === severity);
  }
}

// Firebase-specific error handler
export class FirebaseErrorHandler {
  static getReadableMessage(error) {
    const code = error.code || error.message;

    const messages = {
      'auth/user-not-found': 'User account not found. Please check your email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'permission-denied': 'You do not have permission to access this.',
      'not-found': 'The requested item was not found.',
      'already-exists': 'This item already exists.',
      'invalid-argument': 'Invalid data provided.',
      'resource-exhausted': 'Quota exceeded. Please try again later.',
      'unauthenticated': 'Please log in to continue.',
      'unavailable': 'Service temporarily unavailable. Please try again.',
      'internal': 'An internal error occurred. Please try again.',
    };

    return messages[code] || 'An error occurred. Please try again.';
  }

  static getErrorType(error) {
    const code = error.code || error.message;
    
    if (code.includes('auth/')) return 'AUTH_ERROR';
    if (code.includes('permission')) return 'PERMISSION_ERROR';
    if (code.includes('not-found')) return 'NOT_FOUND';
    if (code.includes('invalid')) return 'VALIDATION_ERROR';
    if (code.includes('exhausted')) return 'RATE_LIMIT';
    if (code.includes('unavailable')) return 'SERVICE_ERROR';
    
    return 'UNKNOWN_ERROR';
  }
}

// Network error handler
export class NetworkErrorHandler {
  static isNetworkError(error) {
    return (
      error.message?.includes('Network') ||
      error.message?.includes('fetch') ||
      error.message?.includes('timeout') ||
      !navigator.onLine
    );
  }

  static getRetryable(error) {
    return (
      this.isNetworkError(error) ||
      error.status >= 500
    );
  }

  static async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1 || !this.getRetryable(error)) {
          throw error;
        }
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

// Global error handler
export const errorHandler = new ErrorHandler();

// Safe API call wrapper
export async function safeAPICall(fn, errorContext = {}) {
  try {
    return await fn();
  } catch (error) {
    errorHandler.logError(error, errorContext);
    
    // Get readable error message
    let message = 'An error occurred. Please try again.';
    
    if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    
    throw new Error(message);
  }
}

// Safe component error boundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    errorHandler.logError(error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="font-bold text-red-900 mb-2">Something went wrong</h2>
          <p className="text-red-700 text-sm mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-danger"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  static measureOperation(name) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - startTime;
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        
        // Alert if slow
        if (duration > 1000) {
          console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`);
        }
        
        return duration;
      },
    };
  }

  static async measureAsync(name, fn) {
    const timer = this.measureOperation(name);
    try {
      const result = await fn();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }
}

export default errorHandler;
