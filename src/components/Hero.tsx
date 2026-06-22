'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Patients Served' },
  { value: '100%', label: 'Home-Based Care' },
  { value: 'FREE', label: 'First Session' },
  { value: '6+', label: 'Countries Served' },
];

const badges = [
  'Stroke Recovery',
  'Brain Injury',
  'Spinal Cord Injury',
  "Parkinson's",
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }[] = [];

    const colors = ['#00B4D8', '#48CAE4', '#ADE8F4', '#F0A500', '#ffffff'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      // Draw connecting lines
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,180,216,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen animated-gradient noise flex flex-col justify-center overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00B4D8]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#F0A500]/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div>
          {/* Tag */}
          <div className="fade-in-up mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10">
            <span className="w-2 h-2 rounded-full bg-[#00B4D8] pulse-glow inline-block" />
            <span className="text-[#00B4D8] text-xs font-semibold tracking-widest uppercase">
              Specialist Neuro Rehab at Home
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-in-up-delay-1 text-5xl md:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Recovery{' '}
            <span className="gradient-text">Begins</span>
            <br />
            at{' '}
            <span className="relative inline-block">
              Home.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10 Q100 2 198 10"
                  stroke="#F0A500"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          {/* Sub headline */}
          <p className="fade-in-up-delay-2 text-white/60 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            Neuroficio brings clinical-grade neurological rehabilitation to your
            doorstep — guided by specialists who think differently about recovery.
          </p>

          {/* Checkpoints */}
          <ul className="fade-in-up-delay-3 flex flex-col gap-2.5 mb-10">
            {[
              'Free initial assessment — no commitment',
              'First therapy session completely free',
              'Specialists in stroke, TBI & spinal injury',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                <CheckCircle2 size={16} className="text-[#00B4D8] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="fade-in-up-delay-4 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="btn-teal flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold shadow-lg shadow-[#00B4D8]/25"
            >
              <span>Book Free Assessment</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="#services"
              className="flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              How It Works
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-10 fade-in-up-delay-4 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['bg-[#00B4D8]', 'bg-[#F0A500]', 'bg-[#FF6B6B]', 'bg-[#48CAE4]'].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-[#0A1628] flex items-center justify-center text-white text-xs font-bold`}
                >
                  {['R', 'S', 'P', 'A'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-[#F0A500] text-[#F0A500]" />
                ))}
              </div>
              <p className="text-white/50 text-xs mt-0.5">Trusted by families across 6 countries</p>
            </div>
          </div>
        </div>

        {/* Right: Stats card cluster */}
        <div className="hidden lg:flex items-center justify-center relative">
          {/* Central card */}
          <div className="glass rounded-3xl p-8 w-72 float text-center relative z-10 border border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0096C7] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00B4D8]/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Home-First Care</h3>
            <p className="text-white/50 text-sm">Expert rehab at your doorstep. No hospital. No commute.</p>
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
              {stats.slice(0, 2).map((s) => (
                <div key={s.label}>
                  <div className="gradient-text font-black text-2xl">{s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating badge cards */}
          <div className="absolute -top-4 -right-4 glass rounded-2xl p-4 float-delay w-44 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-[#F0A500]/20 flex items-center justify-center">
                <span className="text-[#F0A500] text-xs">✓</span>
              </div>
              <span className="text-white/70 text-xs font-semibold">Free First Session</span>
            </div>
            <p className="text-white/40 text-[11px]">No cost, no commitment. Experience expert care first.</p>
          </div>

          <div className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 float w-44 border border-white/10" style={{ animationDelay: '2.5s' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-[#00B4D8]/20 flex items-center justify-center">
                <span className="text-[#00B4D8] text-xs">🌍</span>
              </div>
              <span className="text-white/70 text-xs font-semibold">Global Remote Care</span>
            </div>
            <p className="text-white/40 text-[11px]">UK, UAE, USA, Australia & more</p>
          </div>

          {/* Condition badges */}
          <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {badges.map((b, i) => (
              <div
                key={b}
                className="glass rounded-xl px-3 py-2 text-xs font-semibold text-white/70 border border-white/10 whitespace-nowrap"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
