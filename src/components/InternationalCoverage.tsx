import Link from 'next/link';
import UiIcon from './UiIcon';
import { internationalCountries } from '@/content/care-options';

export default function InternationalCoverage() {
 return <section className="section countries-section" id="countries" aria-labelledby="countries-heading"><div className="container">
  <div className="coverage-panel"><div className="coverage-intro"><span className="coverage-symbol"><UiIcon name="globe" size={30} /></span><span className="eyebrow">International rehabilitation</span><h2 id="countries-heading">Countries<br />we support.</h2><span className="coverage-count">{internationalCountries.length} countries. Individual care arrangements.</span><p>We support international rehabilitation enquiries from the countries listed here. In-person programmes, virtual rehabilitation and equipment arrangements are confirmed individually according to clinical suitability, local requirements and availability.</p><Link href="/contact" className="btn btn-dark">Discuss care in your country <UiIcon name="arrow" size={18} /></Link></div>
   <div className="coverage-locations"><ul className="country-list" aria-label="Supported international countries">{internationalCountries.map(country => <li key={country}>{country}</li>)}</ul><p className="coverage-location-note">For Trinidad and Tobago, tell us whether care is needed in Port of Spain, San Fernando or another location.</p></div>
  </div><div className="coverage-local-note"><p>Looking for rehabilitation at home in India?</p><Link href="/services" className="text-link">Explore our India home care <UiIcon name="arrow" size={16} /></Link></div>
 </div></section>;
}
