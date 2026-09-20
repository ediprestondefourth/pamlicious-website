import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const questions = [
  { question: "How far in advance should I order?", answer: "For everyday pastry boxes, order before 2 PM for same-day delivery. Celebration cakes and larger events are best booked 3 to 5 days ahead." },
  { question: "Do you deliver across Lagos?", answer: "Yes. We deliver across Lagos with delivery fees calculated at checkout. Orders above ₦15,000 unlock free delivery." },
  { question: "Can I customise a box or cake?", answer: "Absolutely. Send us your date, guest count, flavours, and any dietary notes through our contact page or WhatsApp and we will help shape the right order." },
  { question: "Do you have gluten-free options?", answer: "Our Gluten-Free Lemon Tart is available daily. For other dietary requirements, contact us before ordering so we can confirm what the kitchen can prepare safely." },
];

export default function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState(0);
  return <section className="bg-[#FFF8F2] px-6 py-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5] text-[#9B1C2E]"><HelpCircle size={23} /></div><p className="mt-6 font-['Outfit'] text-xs font-semibold uppercase tracking-[0.3em] text-[#C8902A]">Good to know</p><h2 className="mt-3 font-['Playfair_Display'] text-4xl font-bold leading-tight text-[#2C2C2C]">Questions, answered with care.</h2><p className="mt-4 max-w-sm font-['Outfit'] leading-relaxed text-[#7A6960]">Everything you need to know before your next pastry moment.</p></div><div className="divide-y divide-[#E8D5CC] border-y border-[#E8D5CC]">{questions.map((item, index) => { const isOpen = openQuestion === index; return <div key={item.question}><button onClick={() => setOpenQuestion(isOpen ? -1 : index)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-5 py-5 text-left font-['Playfair_Display'] text-lg font-semibold text-[#2C2C2C]"><span>{item.question}</span><ChevronDown size={18} className={`shrink-0 text-[#9B1C2E] transition-transform ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <p className="max-w-2xl pb-5 pr-8 font-['Outfit'] text-sm leading-relaxed text-[#7A6960]">{item.answer}</p>}</div>; })}</div></div></section>;
}
