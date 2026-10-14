'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sitePages, type PageKey } from '@/content/site-pages';
import PatientQuestions from './PatientQuestions';
import EnquiryForm from './EnquiryForm';

const ORDER: PageKey[] = ['home', 'services', 'international', 'equipment', 'second-opinion', 'community', 'about', 'contact'];

const INTL_REGIONS = ['🇬🇧 United Kingdom', '🇺🇸 United States', '🇦🇪 UAE', '🌍 East Africa', '🌍 West Africa', '🇪🇺 Across Europe'];

const PLATFORM_OFFERINGS = [
  { icon: '🏠', title: 'Home Neurorehabilitation', desc: 'Specialist neuro physiotherapy delivered at your doorstep in Hyderabad.' },
  { icon: '🌍', title: 'International Tele-Neurorehabilitation', desc: 'Enquiries about video-based rehabilitation for patients outside India; suitability and country availability are confirmed individually.' },
  { icon: '🩺', title: 'Second Opinions', desc: 'Connect with expert neuro and other medical consultants before a major decision.' },
  { icon: '🤝', title: 'Family & Caregiver Coaching', desc: 'Practical guidance and emotional support for the people caring for your loved one.' },
  { icon: '🗺️', title: 'Recovery Planning', desc: 'A personalised, outcome-linked roadmap from day one, reviewed as you progress.' },
  { icon: '⚙️', title: 'Equipment Sale for Recovery', desc: 'Clinically recommended mobility, tech and home-safety equipment, with availability confirmed individually.' },
];

const PATHWAY_STEPS = [
  { n: '01', t: 'Free Assessment', d: 'Ask about a home or video assessment to discuss movement, daily function, home safety and caregiver needs.' },
  { n: '02', t: 'Free First Session', d: 'Confirm first-session eligibility for your location and care format. Hands-on treatment requires a home visit.' },
  { n: '03', t: 'Programme Design', d: 'A structured plan is built around your goals, with session frequency and outcome measures set from day one.' },
  { n: '04', t: 'Ongoing Sessions', d: 'Your specialist visits on schedule. Every session is documented and the plan evolves with your progress.' },
  { n: '05', t: 'Support Between Sessions', d: 'Online support groups, caregiver guidance and a home exercise library keep recovery active daily.' },
];

/* ---- LOGO MARK SVG ---- */
function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="6" cy="24" r="3.4" fill="#ECE7DC" stroke="#0A2540" strokeWidth="1.6" />
      <circle cx="16" cy="15" r="2.6" fill="#14B8A6" />
      <circle cx="26" cy="7" r="2.6" fill="#14B8A6" />
      <path d="M8.4 21.8L13.6 16.8M18.4 13.2L23.6 8.6" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ---- RECOVERY PATHWAY ---- */
function Pathway({ detailed = false }: { detailed?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<SVGPathElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const len = fg.getTotalLength ? fg.getTotalLength() : 300;
    fg.style.strokeDasharray = String(len);
    fg.style.strokeDashoffset = String(len);
    const t = setTimeout(() => {
      fg.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)';
      fg.style.strokeDashoffset = '0';
    }, 150);

    const nodes = wrapRef.current?.querySelectorAll<HTMLElement>('.pathway-node, .pathway-v-item');
    nodes?.forEach((el, i) => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        el.style.opacity = '1';
      }, 200 + i * 140);
    });

    return () => clearTimeout(t);
  }, [isMobile, detailed]);

  if (isMobile) {
    return (
      <div className="pathway-wrap pathway-vertical" ref={wrapRef}>
        {PATHWAY_STEPS.map((step, i) => (
          <div className="pathway-v-item" key={step.n}>
            <div className="pathway-v-line">
              <div className="pathway-dot"><span>{step.n}</span></div>
              {i < PATHWAY_STEPS.length - 1 && <div className="pathway-v-connector" />}
            </div>
            <div className="pathway-card static">
              <h3>{step.t}</h3>
              {detailed && <p>{step.d}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const n = PATHWAY_STEPS.length;
  const yTop = detailed ? 22 : 24;
  const yBottom = 100 - yTop;
  const positions = PATHWAY_STEPS.map((_, i) => ({
    x: (i / (n - 1)) * 96 + 2,
    y: i % 2 === 0 ? yTop : yBottom,
  }));

  let pathD = `M ${positions[0].x} ${positions[0].y}`;
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1], cur = positions[i];
    const midX = (prev.x + cur.x) / 2;
    pathD += ` C ${midX} ${prev.y}, ${midX} ${cur.y}, ${cur.x} ${cur.y}`;
  }

  return (
    <div className={`pathway-wrap pathway-horizontal${detailed ? ' detailed' : ''}`} ref={wrapRef}>
      <svg className="pathway-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={pathD} className="pathway-line-bg" vectorEffect="non-scaling-stroke" />
        <path d={pathD} className="pathway-line-fg" vectorEffect="non-scaling-stroke" ref={fgRef} />
      </svg>
      <div className="pathway-nodes">
        {PATHWAY_STEPS.map((step, i) => {
          const cardAbove = positions[i].y >= 50;
          return (
            <div
              key={step.n}
              className="pathway-node"
              style={{
                left: `${positions[i].x}%`,
                top: `${positions[i].y}%`,
                flexDirection: cardAbove ? 'column-reverse' : 'column',
              }}
            >
              <div className="pathway-dot"><span>{step.n}</span></div>
              <div className={`pathway-card ${cardAbove ? 'card-above' : 'card-below'}`}>
                <h3>{step.t}</h3>
                {detailed && <p>{step.d}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- PAGE: HOME ---- */
function PageHome() {
  return (
    <div className="page active">
      {/* HERO */}
      <section style={{ position: 'relative', background: 'linear-gradient(180deg, var(--navy-deep) 0%, var(--navy) 100%)', overflow: 'hidden', padding: '64px 0 0' }}>
        <div className="hero-glow" />
        <svg className="hero-network" viewBox="0 0 1180 600" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g opacity="0.5">
            <path d="M -50 480 L 180 380 L 340 420 L 520 280 L 700 320 L 900 150 L 1100 200 L 1280 90" stroke="#14B8A6" strokeWidth="1.4" strokeDasharray="3 7" />
            <circle cx="180" cy="380" r="3.5" fill="#14B8A6" />
            <circle cx="340" cy="420" r="3.5" fill="#5EEAD4" />
            <circle cx="520" cy="280" r="4.5" fill="#14B8A6" />
            <circle cx="700" cy="320" r="3.5" fill="#5EEAD4" />
            <circle cx="900" cy="150" r="4.5" fill="#14B8A6" />
            <circle cx="1100" cy="200" r="3.5" fill="#5EEAD4" />
          </g>
        </svg>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="pill" style={{ background: 'rgba(94,234,212,0.14)', color: '#5EEAD4', marginBottom: 24 }}>
                <span className="node-dot" style={{ boxShadow: 'none', width: 7, height: 7 }} />
                Now serving Hyderabad &amp; international patients
              </div>
              <h1 style={{ color: 'white' }}>Neurological Rehabilitation <span style={{ color: '#5EEAD4' }}>at Home and Online.</span></h1>
              <p className="lead" style={{ color: 'rgba(255,255,255,0.72)', margin: '22px 0 34px', maxWidth: 520 }}>
                Specialised home-based rehabilitation and virtual care for stroke, Parkinson&apos;s disease, spinal cord injury and neurological conditions — supporting patients and families worldwide.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link className="btn btn-primary" href="/contact">
                  Ask about an assessment
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
                <Link className="btn btn-ghost" href="/services">See how it works</Link>
              </div>
              <div className="hero-trust">
                <div><strong>Free</strong><span>Ask about assessment eligibility</span></div>
                <div><strong>Home</strong><span>Visits in Hyderabad</span></div>
                <div><strong>Online</strong><span>Ask about remote care</span></div>
              </div>
            </div>
            <div className="hero-card-wrap">
              <div className="hero-card">
                <div className="hero-card-top">
                  <span className="pill" style={{ background: 'rgba(20,184,166,0.12)', color: '#0D9488' }}>Free · No commitment</span>
                </div>
                <h3 style={{ marginBottom: 6 }}>Plan your rehabilitation assessment</h3>
                <p style={{ fontSize: '14.5px', marginBottom: 22 }}>Discuss movement, daily function, home safety and caregiver needs. Ask which assessment format is suitable for you.</p>
                <Link className="btn btn-dark btn-block" href="/contact">Ask about an assessment ?</Link>
                <p style={{ fontSize: 12, marginTop: 14 }}>Outside Hyderabad? Ask about video consultations and availability for your country.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEURO RECOVERY PLATFORM */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">A Neuro Recovery Platform</span>
            <h2>More than home therapy. A complete neuro recovery platform.</h2>
            <p className="lead" style={{ margin: '0 auto' }}>From the first assessment to long-term recovery planning, NeuroFicio brings together assessment, physiotherapy, recovery planning and caregiver guidance.</p>
          </div>
          <div className="group-grid platform-grid">
            {PLATFORM_OFFERINGS.map((o) => (
              <div key={o.title} className="group-card">
                <div className="group-icon">{o.icon}</div>
                <h3>{o.title}</h3>
                <p style={{ fontSize: '14.5px' }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS STRIP */}
      <section className="section-tight" style={{ background: 'var(--navy-deep)' }}>
        <div className="container">
          <div className="diff-strip">
            <div className="diff-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
              Recovery at Home &amp; Telerehabilitation
            </div>
            <div className="diff-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              Neurological specialists only
            </div>
            <div className="diff-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
              Tech-guided recovery tools
            </div>
            <div className="diff-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Moderated patient communities
            </div>
          </div>
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Who we help</span>
            <h2>Conditions we support with neurological physiotherapy</h2>
            <p className="lead">We don&apos;t generalise across every diagnosis. Our specialists focus exclusively on neurological recovery — which means deeper expertise in the conditions that matter most.</p>
          </div>
          <div className="condition-grid">
            <div className="condition-card">
              <div className="condition-icon" style={{ background: '#FDEEEC' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              </div>
              <h3><Link href="/services">Stroke rehabilitation</Link></h3>
              <p style={{ fontSize: '14.5px' }}>Physiotherapy for movement and daily function after stroke. Ask about other specialist care needed.</p>
            </div>
            <div className="condition-card">
              <div className="condition-icon" style={{ background: '#EAF2FE' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" /></svg>
              </div>
              <h3><Link href="/services">Brain injury rehabilitation</Link></h3>
              <p style={{ fontSize: '14.5px' }}>Head injury rehabilitation rebuilding function, memory and independence.</p>
            </div>
            <div className="condition-card">
              <div className="condition-icon" style={{ background: '#F0EEFD' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2"><path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4" /></svg>
              </div>
              <h3><Link href="/services">Spinal cord injury rehabilitation</Link></h3>
              <p style={{ fontSize: '14.5px' }}>Structured programmes for complete and incomplete spinal cord damage.</p>
            </div>
            <div className="condition-card">
              <div className="condition-icon" style={{ background: '#EAFBF6' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 2" /></svg>
              </div>
              <h3><Link href="/services">Parkinson&apos;s physiotherapy</Link></h3>
              <p style={{ fontSize: '14.5px' }}>Movement, balance and daily-function support through progressive stages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RECOVERY PATHWAY */}
      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">From first call to ongoing care</span>
            <h2>Your recovery pathway</h2>
            <p className="lead" style={{ margin: '0 auto' }}>Every patient&apos;s recovery traces its own path. Here&apos;s how yours begins — five connected steps, no detours.</p>
          </div>
          <Pathway detailed={false} />
        </div>
      </section>

      {/* TECHNOLOGY + COMMUNITY SPLIT */}
      <section className="section">
        <div className="container">
          <div className="split-grid">
            <div className="split-card split-navy">
              <div className="split-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              </div>
              <h3 style={{ color: 'white' }}>Technology-guided recovery</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', margin: '14px 0 22px' }}>Wearables, tele-rehab platforms and home-friendly devices — prescribed and supervised by your clinical team, never sold to you as a gadget.</p>
              <Link href="/equipment" style={{ color: '#5EEAD4', fontWeight: 600, fontSize: '14.5px', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                Explore equipment guide
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="split-card split-teal">
              <div className="split-icon" style={{ background: 'rgba(10,37,64,0.08)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3>Community &amp; support</h3>
              <p style={{ margin: '14px 0 22px', color: 'rgba(10,37,64,0.75)' }}>Weekly, specialist-moderated video groups for stroke survivors, TBI patients, SCI patients and caregivers. Recovery is never a solo journey.</p>
              <Link href="/community" style={{ color: '#0A2540', fontWeight: 700, fontSize: '14.5px', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                Join a support group
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNATIONAL */}
      <section className="section-tight">
        <div className="container">
          <div className="intl-banner">
            <div>
              <span className="eyebrow" style={{ marginBottom: 14 }}>International Patients</span>
              <h2 style={{ fontSize: 30 }}>Online neuro rehabilitation for international patients</h2>
              <p className="lead" style={{ marginTop: 14, maxWidth: 520 }}>Enquire about video-based physiotherapy, recovery planning and caregiver guidance. We confirm suitability and availability for your country before arranging care.</p>
              <Link className="btn btn-primary" style={{ marginTop: 24 }} href="/international">Explore international care</Link>
            </div>
            <div className="intl-flags">
              {INTL_REGIONS.map(f => (
                <div key={f} className="flag-chip">{f}</div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* FINAL CTA */}
      <section className="section">
        <div className="container">
          <div className="final-cta">
            <h2 style={{ color: 'white', maxWidth: 560 }}>The first step costs nothing. Ask how an assessment could help you plan care.</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/contact">Ask about an assessment</Link>
              <a href="https://wa.me/918341471837" className="btn btn-ghost">Message us on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- PAGE: SERVICES ---- */
function PageServices() {
  return (
    <div className="page active">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>What We Treat</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>Neurological physiotherapy and home rehabilitation</h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, marginTop: 18 }}>Five connected steps. Understand assessment, goal setting, therapy visits and progress reviews. Some patients also need hospital or outpatient care.</p>
        </div>
      </section>
      <section className="section">
        <div className="container"><Pathway detailed={true} /></div>
      </section>
      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">In detail</span>
            <h2>What actually happens at each step</h2>
          </div>
          <div className="detail-steps">
            <div className="detail-step">
              <div className="detail-step-num">01</div>
              <div>
                <h3>Free Assessment</h3>
                <p>A specialist visits your home — or joins by video call for remote and international patients — for a comprehensive neurological assessment. We evaluate movement, function, cognition, home safety and caregiver needs.</p>
                <ul className="check-list">
                  <li>Full movement &amp; function evaluation</li>
                  <li>Cognitive and speech screening where relevant</li>
                  <li>Home safety walkthrough</li>
                  <li>Caregiver capacity and needs discussion</li>
                </ul>
                <span className="pill" style={{ background: 'rgba(20,184,166,0.12)', color: '#0D9488' }}>No cost · No commitment</span>
              </div>
            </div>
            <div className="detail-step">
              <div className="detail-step-num">02</div>
              <div>
                <h3>Your Free First Session</h3>
                <p>Before you invest in a programme, you experience our care firsthand. Your therapist delivers a first session appropriate to your care format — tailored to your assessment findings, not a generic script.</p>
                <ul className="check-list">
                  <li>Hands-on therapy, same visit as assessment</li>
                  <li>Tailored to what we found, not a template</li>
                  <li>You decide afterwards — zero pressure</li>
                </ul>
              </div>
            </div>
            <div className="detail-step">
              <div className="detail-step-num">03</div>
              <div>
                <h3>Personalised Programme Design</h3>
                <p>We build a structured rehabilitation programme around your assessment: clear goals, session frequency, home exercise guidance and equipment recommendations. Outcome measures are set from day one — so progress is something you can see, not just feel.</p>
              </div>
            </div>
            <div className="detail-step">
              <div className="detail-step-num">04</div>
              <div>
                <h3>Ongoing Home Sessions</h3>
                <p>Your assigned specialist visits on your agreed schedule. Every session is documented, progress is tracked against your original goals, and the plan evolves as your recovery progresses — never static, never one-size-fits-all.</p>
              </div>
            </div>
            <div className="detail-step">
              <div className="detail-step-num">05</div>
              <div>
                <h3>Support Between Sessions</h3>
                <p>Access to our online support group, structured caregiver guidance, and a home exercise video library keeps recovery active every day — not just on the days your therapist visits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--stone)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Conditions we specialise in</span>
            <h2>Depth of Expertise, Dedicated to Neurological Recovery.</h2>
          </div>
          <div className="condition-detail-grid">
            {[
              { title: 'Stroke', sub: 'Ischaemic & haemorrhagic', body: 'Physiotherapy for movement after stroke, when medically appropriate. Ask about referrals for speech, swallowing, cognitive or occupational therapy needs.' },
              { title: 'Traumatic Brain Injury', sub: 'TBI / Head injury', body: 'Structured rehabilitation addressing physical function, memory, attention and the emotional adjustment that comes with relearning everyday life.' },
              { title: 'Spinal Cord Injury', sub: 'Complete & incomplete', body: 'Function-focused programmes to maximise independence — transfers, mobility, strength — adapted continuously to your level of injury.' },
              { title: "Parkinson's", sub: 'Progressive movement disorder', body: 'Balance, gait and daily-function support designed around the stage of progression, with programmes that adapt as needs change over time.' },
            ].map(c => (
              <div key={c.title} className="condition-detail-card">
                <h3>{c.title}</h3>
                <p style={{ fontSize: '14.5px', marginBottom: 14 }}>{c.sub}</p>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Online support groups</span>
            <h2>Recovery is a daily lived experience, not a clinical event</h2>
            <p className="lead">Our online support groups meet weekly via video call and are moderated by our clinical team — free to join for all active NeuroFicio patients.</p>
          </div>
          <div className="group-grid">
            {[
              { icon: '🧠', title: 'Stroke survivors & caregivers', desc: 'Weekly peer support for those navigating life after stroke.' },
              { icon: '💭', title: 'TBI & head injury community', desc: 'A space for the particular challenges of brain injury recovery.' },
              { icon: '🦽', title: 'Spinal cord injury network', desc: 'Connect with others navigating SCI recovery and adaptation.' },
              { icon: '🤝', title: 'Caregivers only', desc: 'A dedicated space for those supporting a loved one — because caregivers need care too.' },
            ].map(g => (
              <div key={g.title} className="group-card">
                <div className="group-icon">{g.icon}</div>
                <h3>{g.title}</h3>
                <p style={{ fontSize: '14.5px' }}>{g.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link className="btn btn-dark" href="/community">Learn more about our community →</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="final-cta">
            <h2 style={{ color: 'white', maxWidth: 560 }}>Ready to take the first step?</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/contact">Ask about an assessment</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- PAGE: INTERNATIONAL ---- */
function PageInternational() {
  return (
    <div className="page active">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>International Patients</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>Online neuro rehabilitation for international patients</h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 620, marginTop: 18 }}>Enquire about video-based physiotherapy, recovery planning and caregiver guidance. We confirm suitability and availability for your country before arranging care.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Enquiries from different countries</span>
            <h2>Check remote care availability for your country</h2>
          </div>
          <div className="intl-flags" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {INTL_REGIONS.map(f => (
              <div key={f} className="flag-chip">{f}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--navy-deep)' }}>
        <div className="container">
          <div className="remote-grid">
            <div>
              <span className="eyebrow" style={{ color: '#5EEAD4' }}>International Tele-Neurorehabilitation</span>
              <h2 style={{ color: 'white', marginTop: 14 }}>When Specialist Neurorehabilitation Isn&apos;t Available Locally</h2>
            </div>
            <div className="remote-list">
              {['Video-based neurological assessment', 'Home exercise programme design with video demonstration library', 'Liaison with your local treating team', 'Equipment selection guidance suited to your country', 'Ongoing teleconsultation check-ins and programme review'].map(item => (
                <div key={item} className="remote-item"><span className="node-dot" />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>



      <section className="section">
        <div className="container">
          <div className="final-cta">
            <h2 style={{ color: 'white', maxWidth: 560 }}>Ask about remote rehabilitation in your country.</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/contact">Enquire about remote care</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- PAGE: EQUIPMENT ---- */
function PageEquipment() {
  const items = [
    { icon: '⚙️', title: 'Wearable motor-tracking devices', body: 'Sensors that quantify movement quality between sessions, so your programme is adjusted on real data — not guesswork.', tag: 'For: Stroke · TBI · SCI' },
    { icon: '💻', title: 'Tele-rehab platforms', body: 'Guided video-based exercise sessions you can do between in-person visits, supervised remotely by your therapist.', tag: 'For: All conditions' },
    { icon: '🚶', title: 'Mobility & gait aids', body: 'Walking frames, balance trainers and gait-support tools selected for your specific stage of recovery — not a one-size catalogue.', tag: "For: Stroke · Parkinson's · SCI" },
    { icon: '🖐️', title: 'Fine motor & hand therapy tools', body: 'Grip trainers and dexterity devices for rebuilding hand function — central to independence in daily activities.', tag: 'For: Stroke · TBI' },
    { icon: '🛏️', title: 'Home safety & positioning equipment', body: 'Pressure-care surfaces, transfer aids and positioning support to prevent complications and ease caregiving.', tag: 'For: SCI · Severe stroke' },
    { icon: '🗣️', title: 'Speech & cognitive tools', body: "Apps and structured exercises for language, memory and attention retraining, guided by our team's recommendations.", tag: 'For: Stroke · TBI' },
  ];
  return (
    <div className="page active">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>Equipment &amp; Home Tools</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>Rehabilitation equipment and mobility aids — it extends the therapy.</h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, marginTop: 18 }}>Our clinical team recommends, prescribes and guides the use of home-appropriate rehabilitation tools that keep recovery active between sessions.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="equip-categories">
            {items.map(i => (
              <div key={i.title} className="equip-card">
                <div className="equip-icon">{i.icon}</div>
                <h3>{i.title}</h3>
                <p>{i.body}</p>
                <span className="equip-tag">{i.tag}</span>
              </div>
            ))}
          </div>
          <div className="equip-note">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <p style={{ color: 'var(--navy)', fontWeight: 500 }}>This page is currently under clinical consultation — a detailed, condition-by-condition equipment catalogue with guidance notes is coming soon. In the meantime, equipment recommendations are made individually during your free assessment.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link className="btn btn-dark" href="/contact">Ask about equipment for your condition →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- PAGE: SECOND OPINION ---- */
function PageSecondOpinion() {
  const waLink = 'https://wa.me/918341471837?text=Hi%2C%20I%27d%20like%20to%20request%20a%20second%20opinion.';
  return (
    <div className="page active">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>Second Opinion Clinic</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>Neurology second opinions: ask about your options</h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 620, marginTop: 18 }}>Get clarity from expert neuro and other medical consultants before committing to surgery, a treatment plan, or a change in care — without leaving home.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">When to seek a second opinion</span>
            <h2>Big decisions deserve a second, expert view</h2>
          </div>
          <div className="group-grid">
            {[
              { icon: '🧠', title: 'Diagnosis confirmation', desc: 'Get an independent read on a neurological diagnosis before you act on it.' },
              { icon: '🔬', title: 'Treatment plan review', desc: 'Understand whether a proposed treatment or surgery plan is the right fit.' },
              { icon: '💊', title: 'Medication review', desc: 'A second view on long-term medication and management strategy.' },
              { icon: '📈', title: 'Ongoing care review', desc: 'Check whether current therapy or care is actually on track.' },
            ].map(g => (
              <div key={g.title} className="group-card">
                <div className="group-icon">{g.icon}</div>
                <h3>{g.title}</h3>
                <p style={{ fontSize: '14.5px' }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--stone)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Simple, structured, and confidential</h2>
          </div>
          <div className="detail-steps">
            <div className="detail-step">
              <div className="detail-step-num">01</div>
              <div>
                <h3>Ask how to share your reports</h3>
                <p>Send your medical reports, scans and history to our team over WhatsApp — no forms, no portals.</p>
              </div>
            </div>
            <div className="detail-step">
              <div className="detail-step-num">02</div>
              <div>
                <h3>We match you with the right consultant</h3>
                <p>Our clinical team reviews your case and connects you with the right neuro or medical specialist for your situation.</p>
              </div>
            </div>
            <div className="detail-step">
              <div className="detail-step-num">03</div>
              <div>
                <h3>Get a structured second opinion</h3>
                <p>Receive a clear, written or video-based second opinion you can bring back to your treating team.</p>
              </div>
            </div>
          </div>
          <div className="equip-note" style={{ marginTop: 40 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <p style={{ color: 'var(--navy)', fontWeight: 500 }}>We coordinate everything for you over WhatsApp — you won&apos;t need to search for or contact individual doctors yourself.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="final-cta">
            <h2 style={{ color: 'white', maxWidth: 560 }}>Ready for a second opinion?</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Connect on WhatsApp →</a>
              <Link className="btn btn-ghost" href="/contact">Or book a call</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- PAGE: COMMUNITY ---- */
function PageCommunity() {
  return (
    <div className="page active">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>Community &amp; Support</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>Neurological recovery and caregiver support</h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, marginTop: 18 }}>Recovery is not a clinical event — it&apos;s a daily lived experience. Our online support groups connect patients, caregivers and specialists every week.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="group-grid">
            {[
              { icon: '🧠', title: 'Stroke survivors & caregivers', desc: 'A weekly space to share what recovery actually looks like, day to day — wins, setbacks, and everything between.', meta: 'Thursdays · Video call · Free for active patients' },
              { icon: '💭', title: 'TBI & head injury community', desc: 'For patients and families navigating the particular, often invisible challenges of brain injury.', meta: 'Tuesdays · Video call · Free for active patients' },
              { icon: '🦽', title: 'Spinal cord injury network', desc: 'Connect with others navigating SCI — from early adaptation to long-term independent living.', meta: 'Wednesdays · Video call · Free for active patients' },
              { icon: '🤝', title: 'Caregivers only', desc: 'A dedicated space for those supporting a loved one. Caregiver burnout is real — this group exists for you, specifically.', meta: 'Mondays · Video call · Free for active patients' },
            ].map(g => (
              <div key={g.title} className="group-card">
                <div className="group-icon">{g.icon}</div>
                <h3>{g.title}</h3>
                <p style={{ fontSize: '14.5px' }}>{g.desc}</p>
                <div className="group-meta">{g.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">How groups work</span>
            <h2>Moderated, structured, and genuinely useful</h2>
          </div>
          <div className="how-groups-grid">
            {[
              { title: 'Clinically moderated', body: 'Every group is moderated by a member of our clinical team — never an unstructured free-for-all.' },
              { title: 'Video call format', body: 'Face-to-face connection, weekly, from wherever you are — including for our international patients.' },
              { title: 'Free for active patients', body: "No separate cost. If you're in an active NeuroFicio programme, you're welcome in every relevant group." },
            ].map(i => (
              <div key={i.title} className="how-group-item">
                <div className="node-dot" style={{ width: 12, height: 12 }} />
                <h3>{i.title}</h3>
                <p>{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="final-cta">
            <h2 style={{ color: 'white', maxWidth: 560 }}>Start your free assessment to join the community.</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/contact">Ask about an assessment</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- PAGE: ABOUT ---- */
function PageAbout() {
  return (
    <div className="page active">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>About Us</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>About NeuroFicio and our rehabilitation approach</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="story-layout">
            <div className="story-copy">
              <p className="serif" style={{ fontSize: 23, lineHeight: 1.6, color: 'var(--navy-deep)', marginBottom: 28 }}>
                NeuroFicio helps patients and families plan neurological rehabilitation after hospital discharge. Continued care should reflect each person’s goals, medical needs and home environment.
              </p>
              <p style={{ fontSize: 17, marginBottom: 20 }}>We exist to close that gap. By bringing specialist neurological physiotherapy directly into the home, we extend the rehabilitation continuum into the environment that matters most — where patients live, move, and rebuild their lives.</p>
              <p style={{ fontSize: 17 }}>NeuroFicio operates under Therapy Partners, a trusted name in rehabilitation across Hyderabad, with a clinical philosophy grounded in evidence, neuroplasticity science, and deep respect for every patient&apos;s unique recovery journey.</p>
            </div>
            <div className="story-pillars">
              <div className="mini-pillar">
                <h4>Mission</h4>
                <p>To make neurological rehabilitation accessible — at home, on your schedule, guided by specialists who think differently about recovery.</p>
              </div>
              <div className="mini-pillar">
                <h4>Vision</h4>
                <p>To become South Asia&apos;s most trusted home-based neuro rehabilitation brand, with a growing international footprint supporting stroke and neurological injury patients across geographies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--stone)' }}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Our three pillars</span>
            <h2>What we&apos;re built on</h2>
          </div>
          <div className="pillar-grid">
            {[
              { num: '01', title: 'Home Care First', body: 'Expert neurological therapy at your doorstep. No commute, no waiting rooms, no disruption to your recovery environment.' },
              { num: '02', title: 'Technology-Guided Recovery', body: 'From wearable devices to tele-rehab platforms, we prescribe and guide the use of home-friendly tools that support rehabilitation goals.' },
              { num: '03', title: 'Community & Support', body: 'You are not alone. Our online support groups connect patients, caregivers, and specialists because recovery is never a solo journey.' },
            ].map(p => (
              <div key={p.num} className="pillar-card">
                <div className="pillar-num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="why-different">
            <div className="section-head">
              <span className="eyebrow">Why families choose us</span>
              <h2>What makes us different</h2>
            </div>
            <div className="diff-list">
              {[
                'Recovery at Home & Telerehabilitation, not an add-on service',
                'Specialists exclusively in neurological conditions',
                'Technology tools prescribed and guided by our clinical team',
                'Online support groups moderated by specialists, not volunteers',
                'Expert Remote Neurorehabilitation for Families Living Abroad',
                'Ask about free assessment and first-session eligibility',
                'Transparent, outcome-linked care plans from day one',
              ].map(item => (
                <div key={item} className="diff-list-item"><span className="node-dot" />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="final-cta">
            <h2 style={{ color: 'white', maxWidth: 560 }}>Meet the team behind your recovery.</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/contact">Ask about an assessment</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- PAGE: CONTACT ---- */
function PageContact() {
  return (
    <div className="page active">
      <section className="page-hero" style={{ paddingBottom: 0 }}>
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>Contact &amp; Booking</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>Ask about an assessment</h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, marginTop: 18 }}>Ask about a home assessment in Hyderabad or remote care from your country. Confirm suitability, fees and appointment availability with our team.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="booking-layout">
            <div className="card booking-form-card">
              <EnquiryForm />
            </div>
            <div className="booking-side">
              <div className="card side-card">
                <h3 style={{ marginBottom: 18 }}>Prefer to talk now?</h3>
                <a href="https://wa.me/918341471837" className="contact-row">
                  <div className="contact-row-icon" style={{ background: '#E7FAF1' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z" /></svg>
                  </div>
                  <div><strong>WhatsApp</strong><span>+91 83414 71837</span></div>
                </a>
                <a href="tel:+918341471837" className="contact-row">
                  <div className="contact-row-icon" style={{ background: '#EAF2FE' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div><strong>Call us</strong><span>+91 83414 71837</span></div>
                </a>
                <a href="mailto:neuroficio.care@gmail.com" className="contact-row">
                  <div className="contact-row-icon" style={{ background: '#F0EEFD' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                  </div>
                  <div><strong>Email</strong><span>neuroficio.care@gmail.com</span></div>
                </a>
              </div>
              <div className="card side-card">
                <h3 style={{ marginBottom: 14 }}>Visit us</h3>
                <p style={{ fontSize: '14.5px' }}>
                  NeuroFicio<br />
                  Second floor, Huda Residential Layout, Plot 118,<br />
                  above Frills Boutique (opposite Reliance Digital),<br />
                  Nallagandla, Hyderabad, Telangana 500019.
                </p>
              </div>
              <div className="card side-card">
                <h3 style={{ marginBottom: 14 }}>Service areas — Hyderabad</h3>
                <div className="area-tags">
                  {['Nallagandla','Tellapur','Nanakramguda','Gachibowli','Kondapur','Manikonda','Miyapur','Kukatpally','Madhapur','Jubilee Hills','Banjara Hills'].map(a => <span key={a}>{a}</span>)}
                </div>
              </div>
              <div className="card side-card" style={{ background: 'var(--navy-deep)', border: 'none' }}>
                <h3 style={{ color: 'white', marginBottom: 10 }}>International consultations</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14.5px' }}>Ask about video consultation availability for your country, time zone and clinical needs before booking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- MAIN APP ---- */
export default function SiteExperience({ initialPage = 'home' }: { initialPage?: PageKey }) {
  const currentPage = initialPage;
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (initialPage !== 'home') return;
    const hash = window.location.hash.slice(1);
    if (ORDER.includes(hash as PageKey) && hash !== 'home') router.replace(sitePages[hash as PageKey].path);
  }, [initialPage, router]);

  const navLinks: { label: string; key: PageKey }[] = [
    { label: 'Home', key: 'home' },
    { label: 'What We Treat', key: 'services' },
    { label: 'International Patients', key: 'international' },
    { label: 'Neuro Equipment', key: 'equipment' },
    { label: 'Second Opinion Clinic', key: 'second-opinion' },
    { label: 'Contact', key: 'contact' },
  ];

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {/* NAV */}
      <nav className="nav">
        <div className="container nav-inner">
          <Link className="logo" href="/" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
            <LogoMark size={30} />
            <span>Neuro<span className="ficio">Ficio</span></span>
          </Link>
          <div className="nav-links">
            {navLinks.map(l => (
              <a key={l.key} href={sitePages[l.key].path} className={currentPage === l.key ? 'active' : ''} onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
            <Link href="/blog">Blog</Link>
          </div>
          <div className="nav-cta">
            <a href="tel:+918341471837" className="nav-phone" aria-label="Call +91 83414 71837">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <span className="nav-phone-number">+91 83414 71837</span>
            </a>
            <Link className="btn btn-dark btn-sm" href="/contact">Book Assessment</Link>
            <button className="nav-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-menu-top">
          <span className="logo" style={{ color: 'white' }}><span>Neuro<span className="ficio" style={{ color: '#5EEAD4' }}>Ficio</span></span></span>
          <button aria-label="Close menu" className="mobile-close" onClick={() => setMobileOpen(false)}>&times;</button>
        </div>
        {navLinks.map(l => (
          <a key={l.key} href={sitePages[l.key].path} onClick={() => setMobileOpen(false)}>{l.label}</a>
        ))}
        <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
        <div style={{ marginTop: 32 }}>
          <Link className="btn btn-primary btn-block" href="/contact">Ask about an assessment</Link>
        </div>
      </div>

      {/* PAGES */}
      <main id="main-content">
      {currentPage === 'home' && <PageHome />}
      {currentPage === 'services' && <PageServices />}
      {currentPage === 'international' && <PageInternational />}
      {currentPage === 'equipment' && <PageEquipment />}
      {currentPage === 'second-opinion' && <PageSecondOpinion />}
      {currentPage === 'community' && <PageCommunity />}
      {currentPage === 'about' && <PageAbout />}
      {currentPage === 'contact' && <PageContact />}

      <PatientQuestions page={currentPage} />
      </main>

      {/* WHATSAPP FLOAT */}
      <a className="wa-float" href="https://wa.me/918341471837" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.84 14.07c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.91-4.33-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.14.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.63-.14.26.1 1.64.77 1.92.91.29.14.48.22.55.34.07.13.07.71-.17 1.39z" />
        </svg>
      </a>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <LogoMark size={26} />
                <span>Neuro<span style={{ color: '#5EEAD4' }}>Ficio</span></span>
              </div>
              <p style={{ fontSize: 14, maxWidth: 280, marginBottom: 18 }}>Specialist neurological rehabilitation, delivered at home. A Therapy Partners service, based in Hyderabad.</p>
              <div className="pill" style={{ background: 'rgba(94,234,212,0.12)', color: '#5EEAD4' }}>Ask about the free assessment offer</div>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="/services">How our recovery programme works</a></li>
                <li><a href="/equipment">Equipment &amp; tools</a></li>
                <li><a href="/community">Support groups</a></li>
                <li><a href="/about">Our story</a></li>
                <li><Link href="/blog">Blog &amp; resources</Link></li>
              </ul>
            </div>
            <div>
              <h4>Conditions</h4>
              <ul>
                <li><a href="/services">Stroke recovery</a></li>
                <li><a href="/services">Traumatic brain injury</a></li>
                <li><a href="/services">Spinal cord injury</a></li>
                <li><a href="/services">Parkinson&apos;s</a></li>
              </ul>
            </div>
            <div>
              <h4>Get in touch</h4>
              <ul>
                <li><a href="tel:+918341471837">+91 83414 71837</a></li>
                <li><a href="https://wa.me/918341471837" target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
                <li><a href="mailto:neuroficio.care@gmail.com">neuroficio.care@gmail.com</a></li>
                <li><a href="/contact">Ask about an assessment →</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 NeuroFicio, a Therapy Partners service. All rights reserved.</span>
            <span>Nallagandla, Hyderabad · Remote care enquiries from abroad</span>
          </div>
        </div>
      </footer>
    </>
  );
}
