'use client';

import { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    title: 'Free Assessment',
    sub: 'No cost. No commitment.',
    body: 'A specialist visits your home (or joins via video for remote patients) for a comprehensive neurological assessment — movement, function, cognition, home safety, and caregiver needs.',
    color: '#00B4D8',
  },
  {
    num: '02',
    title: 'Your Free First Session',
    sub: 'Experience the difference.',
    body: 'Before investing in a programme, you experience our care firsthand. Your therapist delivers the first therapy session — hands-on, structured, and tailored to your assessment. Completely free.',
    color: '#48CAE4',
  },
  {
    num: '03',
    title: 'Personalised Programme',
    sub: 'Built around your goals.',
    body: 'We build a structured rehabilitation programme with clear goals, session frequency, home exercise guidance, and equipment recommendations. Outcome measures set from day one.',
    color: '#F0A500',
  },
  {
    num: '04',
    title: 'Ongoing Home Sessions',
    sub: 'Progress, tracked.',
    body: 'Your specialist visits on your agreed schedule. Every session is documented, progress is tracked, and the plan evolves as your recovery progresses.',
    color: '#FF6B6B',
  },
  {
    num: '05',
    title: 'Support Between Sessions',
    sub: 'Recovery every day.',
    body: 'Access to our online support groups, caregiver guidance, and a home exercise library keeps your recovery active every day — not just on session days.',
    color: '#7B61FF',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#0A1628] py-28 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/5 blur-[80px]" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="reveal text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 mb-6">
            <span className="text-[#00B4D8] text-xs font-semibold tracking-widest uppercase">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            From First Contact to{' '}
            <span className="gradient-text">Full Recovery</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Our process is designed to remove every barrier between you and specialist neurological care.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00B4D8]/50 via-[#F0A500]/30 to-transparent md:-translate-x-0.5" />

          <div className="flex flex-col gap-12">
            {steps.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={s.num}
                  className={`reveal relative flex items-center gap-6 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isLeft ? 'md:text-right md:pr-12' : 'md:pl-12'} pl-20 md:pl-0`}>
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3"
                      style={{ background: `${s.color}18`, color: s.color }}
                    >
                      {s.sub}
                    </div>
                    <h3 className="text-white font-black text-xl md:text-2xl mb-2">{s.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xs md:max-w-sm">{s.body}</p>
                  </div>

                  {/* Centre node */}
                  <div
                    className="absolute left-0 md:relative md:left-auto w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 shadow-xl font-black text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`,
                      boxShadow: `0 0 24px ${s.color}40`,
                    }}
                  >
                    <span className="text-white">{s.num}</span>
                  </div>

                  {/* Empty right/left spacer on desktop */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="reveal text-center mt-20">
          <a
            href="#contact"
            className="btn-teal inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-[#00B4D8]/25"
          >
            <span>Start with a Free Assessment</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
