import { Component } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // In production, log to an error reporting service here (e.g. Sentry)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0a0f1e] border border-red-500/20 rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
             <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <ShieldAlert className="w-8 h-8 text-red-500" />
             </div>
            <h1 className="text-2xl font-black text-white mb-3">System Malfunction</h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              We encountered an unexpected error while trying to render this view. Our engineering team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#060a14] py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Restart Session
            </button>
            
            {process.env.NODE_ENV !== 'production' && this.state.error && (
               <div className="mt-6 text-left bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto">
                  <p className="text-red-400 text-xs font-mono mb-2">{this.state.error.toString()}</p>
                  <pre className="text-slate-500 text-[10px] font-mono leading-tight">{this.state.errorInfo?.componentStack}</pre>
               </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
