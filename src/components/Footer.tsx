import { Phone, Mail, MapPin } from 'lucide-react';

const links = {
  Services: ['Home Physio', 'Online Support Groups', 'International Consults', 'Equipment Guide'],
  Conditions: ['Stroke', 'Brain Injury', 'Spinal Cord Injury', "Parkinson's"],
  Company: ['About Us', 'Our Team', 'Therapy Partners', 'Careers'],
};

export default function Footer() {
  return (
    <footer className="bg-[#060F1E] text-white pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#0096C7] flex items-center justify-center">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <div>
                <div className="font-bold text-base">Neuroficio</div>
                <div className="text-[#00B4D8] text-[10px] font-semibold tracking-widest uppercase">by Therapy Partners</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Specialist neurological rehabilitation delivered at home, guided by technology, supported by community.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5 text-white/50">
                <MapPin size={14} className="text-[#00B4D8] flex-shrink-0" />
                Hyderabad, Telangana
              </div>
              <div className="flex items-center gap-2.5 text-white/50">
                <Phone size={14} className="text-[#00B4D8] flex-shrink-0" />
                +91 XXXXX XXXXX
              </div>
              <div className="flex items-center gap-2.5 text-white/50">
                <Mail size={14} className="text-[#00B4D8] flex-shrink-0" />
                hello@neuroficio.com
              </div>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">{group}</h4>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Neuroficio. All rights reserved. A Therapy Partners initiative.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
