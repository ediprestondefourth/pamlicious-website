export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF8F2] px-6"
      role="status"
      aria-live="polite"
      aria-label="Loading Pamlicious Bite"
    >
      <div className="text-center">
        <div
          className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center"
          aria-hidden="true"
        >
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-[#E8D5CC] border-t-[#C8902A] motion-reduce:animate-none" />
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9B1C2E] font-['Playfair_Display'] text-3xl font-bold text-[#FFF8F2] shadow-lg shadow-[#9B1C2E]/20">
            P
          </span>
        </div>
        <p className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C]">
          pamlicious
        </p>
        <p className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8902A]">
          Bite
        </p>
        <p className="mt-4 font-['Outfit'] text-sm text-[#7A6960]">
          Preparing your bake
        </p>
      </div>
    </div>
  );
}
