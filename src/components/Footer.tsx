import { ArrowRight, Mail, MapPin, Phone, Send } from "lucide-react";

function FacebookMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.6v8h2.9Z" /></svg>;
}

function InstagramMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" className="fill-current stroke-none" /></svg>;
}

function WhatsappMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 20.5 11.7Z" /><path d="M8.4 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c.7 1.2 1.6 2 2.8 2.6l.6-.6c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.4.3-1 .5-1.5.4-2.8-.5-5.7-3.3-6.7-5.5-.2-.6.1-1.7.7-2.2Z" /></svg>;
}

function SocialLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return <a href={href} aria-label={label} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D5CC] text-[#9B1C2E] transition hover:-translate-y-1 hover:bg-[#9B1C2E] hover:text-white">{children}</a>;
}

export default function Footer({ onNavigate, onNotify }: { onNavigate: (view: string) => void; onNotify?: (message: string, tone?: "success" | "error") => void }) {
  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNotify?.("You are on the list. Fresh bake news is coming your way!");
    event.currentTarget.reset();
  }

  return <footer className="border-t border-[#E8D5CC] bg-[#F5EDE8] px-6 pb-8 pt-14"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]"><div><button onClick={() => onNavigate("home")} className="text-left"><span className="block font-['Playfair_Display'] text-3xl font-bold text-[#9B1C2E]">pamlicious</span><span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8902A]">bite</span></button><p className="mt-5 max-w-xs font-['Outfit'] text-sm leading-relaxed text-[#7A6960]">Handcrafted pastries, bright flavours, and little moments worth gathering for.</p><div className="mt-6 flex gap-2"><SocialLink label="Facebook" href="https://facebook.com"><FacebookMark /></SocialLink><SocialLink label="Instagram" href="https://instagram.com"><InstagramMark /></SocialLink><SocialLink label="WhatsApp" href="https://wa.me/2348095550144?text=Hello%20Pamlicious%20Bite%2C%20I%27d%20like%20to%20place%20an%20order."><WhatsappMark /></SocialLink></div></div><div><h2 className="font-['Outfit'] text-xs font-bold uppercase tracking-[0.2em] text-[#2C2C2C]">Explore</h2><div className="mt-5 space-y-3 font-['Outfit'] text-sm text-[#7A6960]"><button onClick={() => onNavigate("shop")} className="block hover:text-[#9B1C2E]">Shop pastries</button><button onClick={() => onNavigate("about")} className="block hover:text-[#9B1C2E]">About us</button><button onClick={() => onNavigate("story")} className="block hover:text-[#9B1C2E]">Our story</button><button onClick={() => onNavigate("blog")} className="block hover:text-[#9B1C2E]">The journal</button></div></div><div><h2 className="font-['Outfit'] text-xs font-bold uppercase tracking-[0.2em] text-[#2C2C2C]">Get in touch</h2><div className="mt-5 space-y-4 font-['Outfit'] text-sm text-[#7A6960]"><p className="flex items-center gap-2"><MapPin size={15} className="text-[#9B1C2E]" /> Lekki Phase 1, Lagos</p><p className="flex items-center gap-2"><Phone size={15} className="text-[#9B1C2E]" /> +234 809 555 0144</p><p className="flex items-center gap-2"><Mail size={15} className="text-[#9B1C2E]" /> hello@pamliciousbite.com</p></div></div><div><h2 className="font-['Outfit'] text-xs font-bold uppercase tracking-[0.2em] text-[#2C2C2C]">Fresh from the oven</h2><p className="mt-5 font-['Outfit'] text-sm leading-relaxed text-[#7A6960]">Join our list for new bakes, seasonal boxes, and first dibs on weekend drops.</p><form className="mt-4 flex gap-2" onSubmit={subscribe}><input aria-label="Email address" type="email" required placeholder="Your email" className="min-w-0 flex-1 rounded-full border border-[#E8D5CC] bg-[#FFF8F2] px-4 py-2.5 font-['Outfit'] text-sm text-[#2C2C2C] outline-none focus:border-[#9B1C2E]" /><button aria-label="Subscribe" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#9B1C2E] text-white transition hover:bg-[#7d1624]"><Send size={16} /></button></form></div></div><div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-[#E8D5CC] pt-6 font-['Outfit'] text-xs text-[#7A6960] sm:flex-row sm:items-center sm:justify-between"><span>© 2026 pamlicious bite · Made fresh in Lagos</span><button onClick={() => onNavigate("contact")} className="flex items-center gap-1 text-[#9B1C2E] hover:gap-2">Plan a celebration <ArrowRight size={13} /></button></div></footer>;
}
