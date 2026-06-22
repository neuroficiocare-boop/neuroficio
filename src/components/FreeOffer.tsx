'use client';

import { useEffect, useRef } from 'react';
import { Gift, CheckCircle2, ArrowRight } from 'lucide-react';

const perks = [
  'Comprehensive neurological assessment at your home',
  'Full review of movement, function & caregiver needs',
  'First therapy session — hands-on, structured, tailored',
  'Programme design and outcome goals at no charge',
];

export default function FreeOffer() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.2 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F0A500 0%, #FFB800 40%, #FF8C42 100%)',
      }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glows */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-[60px]" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#FF6B6B]/20 blur-[60px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div className="reveal inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 shadow-xl">
          <Gift size={36} className="text-white" />
        </div>

        {/* Headline */}
        <div className="reveal mb-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold tracking-widest uppercase">
            Zero Risk. Real Value.
          </span>
        </div>
        <h2 className="reveal text-4xl md:text-6xl font-black text-white leading-tight mb-6">
          Your First Step<br />
          <span className="underline decoration-white/40 decoration-4 underline-offset-4">
            Costs Nothing.
          </span>
        </h2>
        <p className="reveal text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          We believe every patient deserves to experience the difference specialist neuro rehab makes before committing to a plan. That&apos;s why your first assessment and first therapy session are completely free.
        </p>

        {/* Perks */}
        <ul className="reveal grid sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mb-12">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-3 bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
              <CheckCircle2 size={18} className="text-white mt-0.5 flex-shrink-0" />
              <span className="text-white text-sm font-medium leading-snug">{p}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-[#0A1628] text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-[#1E3A5F] transition-all duration-300 shadow-xl hover:scale-105"
          >
            <span>Book My Free Assessment</span>
            <ArrowRight size={18} />
          </a>
          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/20 text-white border border-white/30 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* Trust line */}
        <p className="reveal mt-8 text-white/50 text-sm">
          No credit card. No hidden charges. Just specialist care.
        </p>
      </div>
    </section>
  );
}
