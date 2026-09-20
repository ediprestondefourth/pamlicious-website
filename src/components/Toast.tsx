import { CheckCircle, X, XCircle } from "lucide-react";

export interface ToastMessage {
  id: number;
  tone: "success" | "error";
  message: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: number) => void;
}

export default function Toast({ messages, onDismiss }: ToastProps) {
  return <div className="fixed right-4 top-20 z-[80] flex w-[min(calc(100vw-2rem),360px)] flex-col gap-3" aria-live="polite" aria-atomic="true">{messages.map((toast) => <div key={toast.id} role="status" className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${toast.tone === "success" ? "border-[#B9DCC2]" : "border-[#E8B9B9]"}`}><div className={toast.tone === "success" ? "text-[#2C7A4B]" : "text-[#B33A3A]"}>{toast.tone === "success" ? <CheckCircle size={19} /> : <XCircle size={19} />}</div><p className="flex-1 font-['Outfit'] text-sm leading-relaxed text-[#2C2C2C]">{toast.message}</p><button onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification" className="text-[#7A6960] hover:text-[#9B1C2E]"><X size={16} /></button></div>)}</div>;
}
