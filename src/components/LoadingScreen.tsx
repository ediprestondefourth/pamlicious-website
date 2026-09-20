import { LoaderCircle } from "lucide-react";

export default function LoadingScreen() {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF8F2]" role="status" aria-label="Loading Pamlicious Bite"><div className="text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F5] text-[#9B1C2E]"><LoaderCircle size={28} className="animate-spin" /></div><p className="mt-4 font-['Playfair_Display'] text-xl font-bold text-[#9B1C2E]">Preparing your bake</p><p className="mt-1 font-['Outfit'] text-sm text-[#7A6960]">Just a moment...</p></div></div>;
}
