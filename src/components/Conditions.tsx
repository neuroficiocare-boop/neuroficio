'use client';

import { useEffect, useRef, useState } from 'react';

const conditions = [
  {
    name: 'Stroke',
    sub: 'Ischaemic & Haemorrhagic',
    icon: '🧠',
    color: '#00B4D8',
    description:
      'Comprehensive stroke rehabilitation addressing motor recovery, balance, speech, and cognitive function — delivered at home by neurological specialists.',
  },
  {
    name: 'Traumatic Brain Injury',
    sub: 'TBI / Head Injury',
    icon: '⚡',
    color: '#F0A500',
    description:
      'Specialist-guided recovery for post-TBI patients, addressing cognition, coordination, fatigue management, and return to daily function.',
  },
  {
    name: 'Spinal Cord Injury',
    sub: 'SCI',
    icon: '🔗',
    color: '#FF6B6B',
    description:
      'Evidence-based SCI rehabilitation focused on maximising function, independence, and quality of life — from acute recovery to long-term management.',
  },
  {
    name: "Parkinson's",
    sub: 'Disease',
    icon: '🌀',
    color: '#7B61FF',
    description:
      "Parkinson's-specific physiotherapy targeting movement, balance, freezing, and postural instability to keep patients active and independent longer.",
  },
];

export default function Conditions() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeCondition = conditions[active];

  return (
    <section
      id="conditions"
      ref={sectionRef}
      className="bg-[#F8FAFF] py-28 px-6 relative overflow-hidden"
    >
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00B4D8]/5 blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#F0A500]/5 blur-[80px]" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A1628]/5 border border-[#0A1628]/10 mb-5">
            <span className="text-[#0A1628] text-xs font-semibold tracking-widest uppercase">Conditions We Treat</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-4 leading-tight">
            Specialists in the Conditions{' '}
            <span className="gradient-text">That Matter Most</span>
          </h2>
          <p className="text-[#0A1628]/50 text-lg max-w-2xl mx-auto">
            We focus exclusively on neurological conditions. This isn&apos;t general physiotherapy — it is specialist expertise applied to the most complex recoveries.
          </p>
        </div>

        {/* Interactive selector */}
        <div className="reveal grid lg:grid-cols-2 gap-10 items-center">
          {/* Tab list */}
          <div className="flex flex-col gap-3">
            {conditions.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                className={`group text-left rounded-2xl p-5 border transition-all duration-300 ${
                  active === i
                    ? 'border-transparent shadow-xl text-white'
                    : 'border-[#0A1628]/10 bg-white hover:border-[#00B4D8]/30 hover:shadow-md text-[#0A1628]'
                }`}
                style={
                  active === i
                    ? {
                        background: `linear-gradient(135deg, ${c.color}15, ${c.color}08)`,
                        borderColor: `${c.color}50`,
                        boxShadow: `0 8px 32px ${c.color}20`,
                        backgroundColor: '#0A1628',
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${c.color}18` }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div
                      className={`font-bold text-lg transition-colors ${
                        active === i ? 'text-white' : 'text-[#0A1628]'
                      }`}
                    >
                      {c.name}
                    </div>
                    <div
                      className="text-sm font-medium mt-0.5"
                      style={{ color: active === i ? `${c.color}` : '#0A1628aa' }}
                    >
                      {c.sub}
                    </div>
                  </div>
                  {active === i && (
                    <div
                      className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: c.color }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div
            key={active}
            className="rounded-3xl p-10 relative overflow-hidden transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${activeCondition.color}12, ${activeCondition.color}05)`,
              border: `1px solid ${activeCondition.color}30`,
            }}
          >
            {/* Big icon */}
            <div className="text-7xl mb-6">{activeCondition.icon}</div>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{ background: `${activeCondition.color}20`, color: activeCondition.color }}
            >
              {activeCondition.sub}
            </div>

            <h3 className="text-[#0A1628] font-black text-3xl mb-4">{activeCondition.name}</h3>
            <p className="text-[#0A1628]/60 text-base leading-relaxed mb-8">
              {activeCondition.description}
            </p>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${activeCondition.color}, ${activeCondition.color}cc)` }}
            >
              Book Free Assessment
              <span>→</span>
            </a>

            {/* Watermark */}
            <div
              className="absolute -bottom-6 -right-6 text-9xl opacity-5 select-none font-black"
              style={{ color: activeCondition.color }}
            >
              {activeCondition.icon}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
