import Link from 'next/link';
import UiIcon from './UiIcon';
import { serviceCategories, internationalOptions } from '@/content/care-options';

export default function ServiceCategories() {
 return <section className="section service-categories" id="our-services" aria-labelledby="services-heading"><div className="container">
  <div className="section-heading"><span className="eyebrow">Our services</span><h2 id="services-heading">Specialist care.<br />Six ways to support your recovery.</h2><p>From personalised care at home to international programmes, explore the support that fits your needs.</p></div>
  <div className="service-category-grid">{serviceCategories.map((service, i) => <Link href={service.href} className="service-category-card" key={service.href}><div className="service-category-top"><span className="feature-icon"><UiIcon name={service.icon} size={26} /></span><span className="service-category-number">0{i + 1}</span></div><h3>{service.title}</h3><p>{service.detail}</p><span className="service-category-action">Explore this service <UiIcon name="arrow" size={18} /></span></Link>)}</div>
  <div className="international-service-options" aria-labelledby="international-options-heading"><div><span className="eyebrow">Across borders</span><h2 id="international-options-heading">Your international care options.</h2></div><div className="international-option-list">{internationalOptions.map(option => <Link key={option.href} href={option.href}><div><h3>{option.title}</h3><p>{option.detail}</p></div><UiIcon name="diagonal" size={20} /></Link>)}</div></div>
 </div></section>;
}
