import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Pamlicious Bite render error", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="flex min-h-screen items-center justify-center bg-[#FFF8F2] px-6 text-center"><div className="max-w-md"><p className="font-['Outfit'] text-xs font-bold uppercase tracking-[0.3em] text-[#C8902A]">Something went wrong</p><h1 className="mt-3 font-['Playfair_Display'] text-4xl font-bold text-[#2C2C2C]">We need a fresh start.</h1><p className="mt-4 font-['Outfit'] leading-relaxed text-[#7A6960]">The page hit an unexpected error. Reload to try again, or return to the storefront.</p><button onClick={() => window.location.reload()} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#9B1C2E] px-6 py-3 font-['Outfit'] font-semibold text-white"><RefreshCw size={16} /> Reload page</button></div></main>;
  }
}
