import { Component, StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

interface AppErrorBoundaryState {
  hasError: boolean
  message: string
}

class AppErrorBoundary extends Component<{ children: ReactNode }, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    }
  }

  componentDidCatch(error: Error) {
    // Keeps runtime context available in dev tools.
    console.error('GmailHandler render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-rose-200 bg-white p-6 text-slate-900 shadow-sm">
          <h1 className="font-['Space_Grotesk'] text-xl font-semibold">GmailHandler failed to render</h1>
          <p className="mt-2 text-sm text-slate-600">A runtime error occurred while loading the dashboard.</p>
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{this.state.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
