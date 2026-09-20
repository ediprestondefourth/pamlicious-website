import {
  ArrowRight,
  Award,
  Clock3,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Send,
  Star,
  Users,
} from "lucide-react";
import { products } from "../data/products";

interface SitePagesProps {
  page: "about" | "contact" | "blog" | "story";
  onNavigate: (view: string) => void;
  onNotify?: (message: string, tone?: "success" | "error") => void;
}

const posts = [
  {
    title: "The morning ritual behind every flaky croissant",
    date: "September 12, 2026",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&h=650&fit=crop&auto=format",
  },
  {
    category: "Hosting notes",
    title: "How to build a pastry table your guests remember",
    date: "August 28, 2026",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&h=650&fit=crop&auto=format",
  },
  {
    category: "Ingredients",
    title: "Why Nigerian strawberries make our summer cakes sing",
    date: "August 10, 2026",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&h=650&fit=crop&auto=format",
  },
];

const testimonials = [
  { quote: "The Celebration Box arrived looking like a little edible party. Every bite felt thoughtful.", name: "Chisom Eze", role: "Birthday host" },
  { quote: "Pamlicious is my secret weapon for client meetings. The boxes disappear before the coffee does.", name: "Tunde Adeyemi", role: "Creative director" },
  { quote: "The lemon tart is bright, buttery, and somehow never too sweet. I order one for every family lunch.", name: "Ngozi Williams", role: "Lagos food lover" },
];

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-['Outfit'] text-xs font-semibold tracking-[0.3em] uppercase text-[#C8902A] mb-3">{eyebrow}</p>
      <h1 className="font-['Playfair_Display'] text-4xl sm:text-6xl font-bold text-[#2C2C2C] leading-tight mb-5">{title}</h1>
      <p className="font-['Outfit'] text-base leading-relaxed text-[#7A6960]">{copy}</p>
    </div>
  );
}

export function SocialProof() {
  return (
    <section className="px-4 sm:px-6 py-20 bg-[#F5EDE8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionIntro eyebrow="Loved out loud" title="Proof that good things travel fast." copy="From office treats to birthday tables, our pastry boxes keep finding their way into the moments worth remembering." />
          <div className="flex items-center gap-3 text-[#9B1C2E] font-['Outfit'] text-sm font-semibold"><Star size={17} fill="currentColor" /> 4.9 average from 500+ orders</div>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          {testimonials.map((item) => (
            <figure key={item.name} className="bg-white border border-[#E8D5CC] rounded-2xl p-6 flex flex-col justify-between min-h-52">
              <div><Quote size={22} className="text-[#C8902A] mb-5" /><blockquote className="font-['Playfair_Display'] text-xl text-[#2C2C2C] leading-snug">“{item.quote}”</blockquote></div>
              <figcaption className="font-['Outfit'] text-xs text-[#7A6960] mt-6"><strong className="text-[#9B1C2E]">{item.name}</strong><span className="mx-2">·</span>{item.role}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ icon: Users, value: "500+", label: "happy customers", color: "#9B1C2E" }, { icon: Award, value: "50+", label: "pastry varieties", color: "#C8902A" }, { icon: Clock3, value: "2 PM", label: "same-day cut-off", color: "#2C7A4B" }, { icon: MessageCircle, value: "98%", label: "would recommend", color: "#D66B83" }].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="bg-white border border-[#E8D5CC] rounded-xl p-4 flex items-center gap-3"><Icon size={19} style={{ color }} /><div><strong className="block font-['Playfair_Display'] text-xl text-[#2C2C2C]">{value}</strong><span className="font-['Outfit'] text-xs text-[#7A6960]">{label}</span></div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SocialFeed() {
  const tiles = [
    { image: products[0].image, tone: "bg-[#E96C8C]", label: "Birthday energy" },
    { image: products[1].image, tone: "bg-[#C8902A]", label: "Golden hour" },
    { image: products[4].image, tone: "bg-[#5B9B71]", label: "Box joy" },
    { image: products[5].image, tone: "bg-[#D26A5A]", label: "A bright bite" },
  ];
  return (
    <section className="px-4 sm:px-6 py-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8"><div><p className="font-['Outfit'] text-xs font-semibold tracking-[0.3em] uppercase text-[#C8902A] mb-2">From our feed</p><h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#2C2C2C]">A little sweetness, daily.</h2></div><div className="hidden sm:flex items-center gap-2 text-[#9B1C2E] font-['Outfit'] text-sm font-semibold"><Camera size={18} /> @pamliciousbite</div></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{tiles.map((tile) => <div key={tile.label} className="group relative aspect-square rounded-2xl overflow-hidden"><img src={tile.image} alt={tile.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className={`absolute left-3 bottom-3 ${tile.tone} text-white rounded-full px-3 py-1.5 font-['Outfit'] text-xs font-semibold`}>{tile.label}</div><div className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#9B1C2E]"><Camera size={15} /></div></div>)}</div>
      </div>
    </section>
  );
}

function AboutPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  return <main className="pt-16 bg-[#FFF8F2]"><section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center"><SectionIntro eyebrow="About the bite" title="Small batch. Big feeling." copy="Pamlicious Bite is a Lagos pastry studio built around the belief that everyday food can still feel like an occasion. We make familiar favourites with bright flavours, generous textures, and a little theatre." /><img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1100&h=900&fit=crop&auto=format" alt="Freshly baked pastries on a table" className="w-full aspect-[4/3] object-cover rounded-[2rem]" /></section><section className="px-6 py-20 bg-[#9B1C2E] text-white"><div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">{[{ value: "2019", label: "first oven lit" }, { value: "12k+", label: "pastries shared" }, { value: "Lagos", label: "our home base" }].map((stat) => <div key={stat.label}><strong className="block font-['Playfair_Display'] text-4xl">{stat.value}</strong><span className="font-['Outfit'] text-sm text-white/70">{stat.label}</span></div>)}</div></section><section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">{[{ title: "Make it generous", copy: "Portions should feel like a gift, and the last bite should be the one you think about later." }, { title: "Keep it local", copy: "We work with brilliant Nigerian growers and makers whenever the season allows." }, { title: "Leave room for joy", copy: "There is always space for colour, a new flavour, and one more pastry at the table." }].map((item) => <div key={item.title} className="border-t-2 border-[#C8902A] pt-5"><h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] mb-3">{item.title}</h2><p className="font-['Outfit'] leading-relaxed text-[#7A6960]">{item.copy}</p></div>)}</section><SocialProof /><div className="text-center py-16"><button onClick={() => onNavigate("shop")} className="inline-flex items-center gap-2 rounded-full bg-[#9B1C2E] text-white px-7 py-3 font-['Outfit'] font-semibold">Taste the story <ArrowRight size={16} /></button></div></main>;
}

function StoryPage() {
  return <main className="pt-16 bg-[#FFF8F2]"><section className="max-w-7xl mx-auto px-6 py-20"><SectionIntro eyebrow="Our story" title="It started with one oven and a very full table." copy="Pamlicious Bite began in a home kitchen, where weekend bakes turned into office orders, then celebration boxes, then a community of people who believe dessert is a love language." /><div className="mt-14 grid md:grid-cols-3 gap-4">{[{ year: "01", title: "The first bake", copy: "A strawberry cake for a friend's birthday became our first proper order." }, { year: "02", title: "The little studio", copy: "We traded a home counter for a sunny Lagos studio and a bigger mixer." }, { year: "03", title: "The table grows", copy: "Today, every box still leaves our kitchen with the same personal touch." }].map((item) => <div key={item.year} className="bg-white border border-[#E8D5CC] rounded-2xl p-7"><span className="font-['Playfair_Display'] text-5xl font-bold text-[#D66B83]">{item.year}</span><h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] mt-8 mb-3">{item.title}</h2><p className="font-['Outfit'] text-[#7A6960] leading-relaxed">{item.copy}</p></div>)}</div></section><SocialFeed /><SocialProof /></main>;
}

function BlogPage() {
  return <main className="pt-16 bg-[#FFF8F2]"><section className="max-w-7xl mx-auto px-6 py-20"><SectionIntro eyebrow="The crumb journal" title="Notes from the kitchen." copy="Recipes, rituals, hosting ideas, and the stories behind the things we bake." /><div className="grid lg:grid-cols-3 gap-6 mt-12">{posts.map((post) => <article key={post.title} className="bg-white rounded-2xl overflow-hidden border border-[#E8D5CC]"><img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" /><div className="p-5"><p className="font-['Outfit'] text-xs font-semibold uppercase tracking-wide text-[#C8902A]">{post.category}</p><h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] leading-snug mt-3 mb-4">{post.title}</h2><p className="font-['Outfit'] text-xs text-[#7A6960]">{post.date}</p></div></article>)}</div></section><SocialFeed /></main>;
}

function ContactPage({ onNotify }: { onNotify?: SitePagesProps["onNotify"] }) {
  return <main className="pt-16 bg-[#FFF8F2]"><section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-14"><div><SectionIntro eyebrow="Say hello" title="Let's make something lovely." copy="Tell us what you are celebrating, feeding, or dreaming up. Our team usually replies within one business day." /><div className="space-y-5 mt-10 font-['Outfit'] text-sm text-[#7A6960]"><p className="flex gap-3 items-center"><Mail size={18} className="text-[#9B1C2E]" /> hello@pamliciousbite.com</p><p className="flex gap-3 items-center"><Phone size={18} className="text-[#9B1C2E]" /> +234 809 555 0144</p><p className="flex gap-3 items-center"><MapPin size={18} className="text-[#9B1C2E]" /> Lekki Phase 1, Lagos</p></div></div><form className="bg-white border border-[#E8D5CC] rounded-2xl p-6 sm:p-8 space-y-5" onSubmit={(event) => event.preventDefault()}><div className="grid sm:grid-cols-2 gap-4">{[{ label: "Your name", placeholder: "Ada Okafor" }, { label: "Email address", placeholder: "ada@email.com" }].map((field) => <label key={field.label} className="font-['Outfit'] text-xs font-semibold text-[#7A6960] uppercase tracking-wide">{field.label}<input required placeholder={field.placeholder} className="mt-2 w-full rounded-xl border border-[#E8D5CC] px-4 py-3 text-sm normal-case font-normal text-[#2C2C2C] outline-none focus:border-[#9B1C2E]" /></label>)}</div><label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960] uppercase tracking-wide">How can we help?<textarea required rows={5} placeholder="A birthday box for 20 guests..." className="mt-2 w-full rounded-xl border border-[#E8D5CC] px-4 py-3 text-sm normal-case font-normal text-[#2C2C2C] outline-none focus:border-[#9B1C2E]" /></label><button className="inline-flex items-center gap-2 rounded-full bg-[#9B1C2E] text-white px-6 py-3 font-['Outfit'] font-semibold">Send a note <Send size={15} /></button></form></section><SocialProof /></main>;
}

export default function SitePages({ page, onNavigate, onNotify }: SitePagesProps) {
  if (page === "about") return <AboutPage onNavigate={onNavigate} />;
  if (page === "story") return <StoryPage />;
  if (page === "blog") return <BlogPage />;
  return <ContactPage onNotify={onNotify} />;
}
