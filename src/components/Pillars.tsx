'use client';

import { useEffect, useRef } from 'react';
import { Home, Cpu, Users } from 'lucide-react';

const pillars = [
  {
    icon: Home,
    title: 'Home Care First',
    subtitle: 'Expert therapy at your doorstep',
    body:
      'No commute. No waiting rooms. No disruption to your recovery environment. Your assigned specialist brings clinical-grade neurological physiotherapy directly into the space where you live — and where recovery actually happens.',
    color: '#00B4D8',
    bg: 'from-[#00B4D8]/10 to-[#48CAE4]/5',
    border: 'border-[#00B4D8]/30',
    glow: 'shadow-[#00B4D8]/20',
    tag: 'Pillar 01',
  },
  {
    icon: Cpu,
    title: 'Technology-Guided Recovery',
    subtitle: 'Prescribed tools that extend therapy',
    body:
      'From wearable devices to tele-rehab platforms, our clinical team prescribes and guides the use of home-friendly tools that keep your recovery active every day — not just on session days. Technology does not replace the therapist; it amplifies the work.',
    color: '#F0A500',
    bg: 'from-[#F0A500]/10 to-[#FFD166]/5',
    border: 'border-[#F0A500]/30',
    glow: 'shadow-[#F0A500]/20',
    tag: 'Pillar 02',
  },
  {
    icon: Users,
    title: 'Community & Support',
    subtitle: 'Recovery is never a solo journey',
    body:
      'Our online support groups connect patients, caregivers, and specialists in a moderated space. Weekly sessions for stroke survivors, TBI families, spinal cord injury communities, and caregivers — because the emotional and social dimension of recovery is just as critical as the physical.',
    color: '#FF6B6B',
    bg: 'from-[#FF6B6B]/10 to-[#FF8E8E]/5',
    border: 'border-[#FF6B6B]/30',
    glow: 'shadow-[#FF6B6B]/20',
    tag: 'Pillar 03',
  },
];

export default function Pillars() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0A1628] py-28 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-[#00B4D8]/5 blur-[80px]" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 mb-6">
            <span className="text-[#00B4D8] text-xs font-semibold tracking-widest uppercase">Our Foundation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Three Pillars of{' '}
            <span className="gradient-text">Exceptional</span> Care
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Our entire model is built on a simple truth: recovery happens in life, not in clinics.
            Every decision we make stems from this philosophy.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`reveal card-hover group relative rounded-3xl border bg-gradient-to-br ${p.bg} ${p.border} p-8 shadow-xl ${p.glow} overflow-hidden`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Number watermark */}
                <div
                  className="absolute -right-4 -top-6 text-8xl font-black opacity-5 select-none"
                  style={{ color: p.color }}
                >
                  0{i + 1}
                </div>

                {/* Tag */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6"
                  style={{ background: `${p.color}18`, color: p.color }}
                >
                  {p.tag}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${p.color}22` }}
                >
                  <Icon size={26} style={{ color: p.color }} />
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-xl mb-1">{p.title}</h3>
                <p className="font-semibold text-sm mb-4" style={{ color: p.color }}>
                  {p.subtitle}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">{p.body}</p>

                {/* Bottom line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl transition-all duration-500 group-hover:h-1.5"
                  style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
