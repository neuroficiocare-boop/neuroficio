'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Globe } from 'lucide-react';

const hyderabadAreas = [
  'Nallagandla', 'Tellapur', 'Nanakramguda', 'Gachibowli', 'Kondapur',
  'Manikonda', 'Miyapur', 'Kukatpally', 'Madhapur', 'Jubilee Hills', 'Banjara Hills',
];

const conditions = ['Stroke', 'Head Injury / TBI', 'Spinal Cord Injury', 'Parkinson\'s', 'Other Neurological'];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', age: '', condition: '', location: '', phone: '', time: '', source: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to an API
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="bg-[#F8FAFF] py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0A1628]/10 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-[#00B4D8]/5 blur-[80px]" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A1628]/5 border border-[#0A1628]/10 mb-5">
            <span className="text-[#0A1628] text-xs font-semibold tracking-widest uppercase">Book Your Free Assessment</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1628] mb-4 leading-tight">
            Let&apos;s Start Your{' '}
            <span className="gradient-text">Recovery Journey</span>
          </h2>
          <p className="text-[#0A1628]/50 text-lg max-w-xl mx-auto">
            Fill in the form and our team will contact you within 24 hours to confirm your free home assessment visit.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Form */}
          <div className="lg:col-span-3 reveal">
            {submitted ? (
              <div className="bg-[#0A1628] rounded-3xl p-12 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-white font-black text-2xl mb-3">We&apos;ve received your request!</h3>
                <p className="text-white/60 leading-relaxed">
                  Our team will call you within 24 hours to schedule your free assessment. Thank you for choosing Neuroficio.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-[#0A1628]/5 border border-[#0A1628]/5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Patient Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[#0A1628] text-xs font-bold uppercase tracking-wider mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full name of the patient"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#0A1628]/10 bg-[#F8FAFF] text-[#0A1628] text-sm placeholder-[#0A1628]/30 focus:outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-[#0A1628] text-xs font-bold uppercase tracking-wider mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Age"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#0A1628]/10 bg-[#F8FAFF] text-[#0A1628] text-sm placeholder-[#0A1628]/30 focus:outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                    />
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-[#0A1628] text-xs font-bold uppercase tracking-wider mb-2">
                      Condition *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-[#0A1628]/10 bg-[#F8FAFF] text-[#0A1628] text-sm focus:outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    >
                      <option value="">Select condition</option>
                      {conditions.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="sm:col-span-2">
                    <label className="block text-[#0A1628] text-xs font-bold uppercase tracking-wider mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Area in Hyderabad, or country (for international)"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#0A1628]/10 bg-[#F8FAFF] text-[#0A1628] text-sm placeholder-[#0A1628]/30 focus:outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[#0A1628] text-xs font-bold uppercase tracking-wider mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#0A1628]/10 bg-[#F8FAFF] text-[#0A1628] text-sm placeholder-[#0A1628]/30 focus:outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  {/* Best time */}
                  <div>
                    <label className="block text-[#0A1628] text-xs font-bold uppercase tracking-wider mb-2">
                      Best Time to Call
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Morning / After 5pm"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#0A1628]/10 bg-[#F8FAFF] text-[#0A1628] text-sm placeholder-[#0A1628]/30 focus:outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                  </div>

                  {/* How did you hear */}
                  <div className="sm:col-span-2">
                    <label className="block text-[#0A1628] text-xs font-bold uppercase tracking-wider mb-2">
                      How Did You Hear About Us?
                    </label>
                    <input
                      type="text"
                      placeholder="Google, referral, social media…"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#0A1628]/10 bg-[#F8FAFF] text-[#0A1628] text-sm placeholder-[#0A1628]/30 focus:outline-none focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-teal w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base mt-6 shadow-lg shadow-[#00B4D8]/25"
                >
                  <span>Submit & Book Free Assessment</span>
                  <Send size={17} />
                </button>

                <p className="text-[#0A1628]/40 text-xs text-center mt-4">
                  We&apos;ll contact you within 24 hours. Your information is kept private and never shared.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Service areas */}
            <div className="reveal bg-[#0A1628] rounded-3xl p-7 text-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/20 flex items-center justify-center">
                  <MapPin size={18} className="text-[#00B4D8]" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Hyderabad Service Areas</h3>
                  <p className="text-white/40 text-xs">Home visits available</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {hyderabadAreas.map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-medium"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* International */}
            <div className="reveal bg-gradient-to-br from-[#00B4D8]/10 to-[#48CAE4]/5 rounded-3xl p-7 border border-[#00B4D8]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/20 flex items-center justify-center">
                  <Globe size={18} className="text-[#00B4D8]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A1628] text-base">International Patients</h3>
                  <p className="text-[#0A1628]/40 text-xs">Remote consultation available</p>
                </div>
              </div>
              <p className="text-[#0A1628]/60 text-sm leading-relaxed mb-4">
                Video-based neurological assessment, programme design, and ongoing teleconsultation for patients in:
              </p>
              <div className="flex flex-wrap gap-2">
                {['🇬🇧 UK', '🇦🇪 UAE', '🇺🇸 USA', '🇦🇺 Australia', '🇹🇿 Tanzania', '🌍 Gulf'].map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-lg bg-[#0A1628]/5 border border-[#0A1628]/10 text-[#0A1628]/70 text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <div className="reveal">
              <a
                href="https://wa.me/91XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] text-white rounded-2xl px-6 py-4 font-bold text-sm hover:bg-[#20BD5B] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#25D366]/25"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Quick Connect on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
