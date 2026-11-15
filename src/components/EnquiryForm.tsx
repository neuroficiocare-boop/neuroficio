'use client';
import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import UiIcon from './UiIcon';
import { trackContactAction } from './AnalyticsConsent';

type Props = { defaultService?: string; source?: string; idPrefix?: string };
const subscribe = () => () => {};
export default function EnquiryForm({ defaultService, source, idPrefix = 'enquiry' }: Props = {}) {
 const [prepared, setPrepared] = useState(false);
 const [method, setMethod] = useState('WhatsApp');
 const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
 const fieldId = (name: string) => `${idPrefix}-${name}`;
 return <form onSubmit={event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const value = (key: string) => String(data.get(key) || '').trim();
  const lines = [
   'Hello NeuroFicio, I would like to request an assessment conversation.',
   `Requested service: ${value('service')}.`,
   `Patient location: ${value('patient-city')}, ${value('patient-country')}.`,
   `Enquirer: ${value('name')}. Relationship to patient: ${value('relationship')}.`,
   `Enquirer country: ${value('enquirer-country')}. Time zone: ${value('timezone')}.`,
   `Preferred contact: ${value('method')} at ${value('contact')}.`,
   value('condition') ? `Broad care need: ${value('condition')}.` : '',
   value('note') ? `Enquiry: ${value('note')}` : '',
   value('start') ? `Preferred start timeframe: ${value('start')}.` : '',
   'Please confirm suitability, availability, assessment fees and the quotation process.',
   source ? `I was reading: ${source}.` : '',
  ].filter(Boolean);
  setPrepared(true);
  trackContactAction('whatsapp_click');
  window.location.assign(`https://wa.me/918341471837?text=${encodeURIComponent(lines.join('\n'))}`);
 }}>
 <span className="eyebrow">Request an assessment</span><h2>Start with the right details.</h2><p className="form-intro">Tell us where the patient needs care. We will prepare a message for you to review and send in WhatsApp.</p>
 <fieldset className="enquiry-fieldset"><legend>Where is care needed?</legend>
 <div className="form-field-grid"><div className="field"><label htmlFor={fieldId('patient-country')}>Patient country <span>(required)</span></label><input id={fieldId('patient-country')} name="patient-country" required maxLength={80} placeholder="For example: India" /></div>
 <div className="field"><label htmlFor={fieldId('patient-city')}>Patient city and area <span>(required)</span></label><input id={fieldId('patient-city')} name="patient-city" required maxLength={120} placeholder="For example: Nallagandla, Hyderabad" /></div></div>
 <div className="field"><label htmlFor={fieldId('service')}>Requested service <span>(required)</span></label><select id={fieldId('service')} name="service" defaultValue="Unsure ? please guide me" required>{['Home visits in India', 'Care in India arranged from abroad', 'In-person care in another country', 'Remote guidance enquiry', 'Equipment guidance', 'Second opinion coordination', 'Caregiver support', 'Unsure ? please guide me'].map(s=><option key={s}>{s}</option>)}</select></div></fieldset>
 <fieldset className="enquiry-fieldset"><legend>How can we contact you?</legend>
 <div className="field"><label htmlFor={fieldId('name')}>Your name <span>(required)</span></label><input id={fieldId('name')} name="name" autoComplete="name" maxLength={100} required /></div>
 <div className="field"><label htmlFor={fieldId('relationship')}>Relationship to the patient <span>(required)</span></label><select id={fieldId('relationship')} name="relationship" required defaultValue=""><option value="" disabled>Select your relationship</option>{['Patient', 'Relative', 'Clinician', 'Other'].map(s=><option key={s}>{s}</option>)}</select></div>
 <div className="form-field-grid"><div className="field"><label htmlFor={fieldId('enquirer-country')}>Your country <span>(required)</span></label><input id={fieldId('enquirer-country')} name="enquirer-country" autoComplete="country-name" maxLength={80} required /></div>
 <div className="field"><label htmlFor={fieldId('timezone')}>Your time zone <span>(required)</span></label><input id={fieldId('timezone')} name="timezone" required maxLength={100} placeholder="For example: London / GMT" /></div></div>
 <div className="field"><label htmlFor={fieldId('method')}>Preferred contact method <span>(required)</span></label><select id={fieldId('method')} name="method" required value={method} onChange={e=>setMethod(e.target.value)}>{['WhatsApp', 'Phone', 'Email'].map(s=><option key={s}>{s}</option>)}</select></div>
 <div className="field"><label htmlFor={fieldId('contact')}>{method === 'Email' ? 'Email address' : 'Phone number with country code'} <span>(required)</span></label><input key={method === 'Email' ? 'email' : 'tel'} id={fieldId('contact')} name="contact" type={method === 'Email' ? 'email' : 'tel'} autoComplete={method === 'Email' ? 'email' : 'tel'} placeholder={method === 'Email' ? 'you@example.com' : '+91 83414 71837'} pattern={method === 'Email' ? undefined : '[+][0-9 ()-]{6,24}'} title={method === 'Email' ? undefined : 'Include + and your country code, for example +91 83414 71837'} maxLength={150} required /></div></fieldset>
 <fieldset className="enquiry-fieldset"><legend>A little context <span>(optional)</span></legend>
 <div className="field"><label htmlFor={fieldId('condition')}>Broad care need</label><select id={fieldId('condition')} name="condition" defaultValue={defaultService || ''}><option value="">Prefer to discuss with the team</option>{Array.from(new Set(['Stroke rehabilitation', 'Brain injury rehabilitation', 'Spinal cord injury rehabilitation', 'Parkinson?s physiotherapy', 'Caregiver support', 'Rehabilitation equipment', 'Second opinion', 'Online neuro rehabilitation', 'Other / unsure', ...(defaultService ? [defaultService] : [])])).map(s=><option key={s}>{s}</option>)}</select></div>
 <div className="field"><label htmlFor={fieldId('start')}>Preferred start timeframe</label><input id={fieldId('start')} name="start" maxLength={100} placeholder="For example: next month, or a date" /><small>Availability and a start date must be confirmed by the team.</small></div>
 <div className="field"><label htmlFor={fieldId('note')}>Your question</label><textarea id={fieldId('note')} name="note" rows={3} maxLength={600} placeholder="A short question is enough. Please leave out detailed medical history." /></div></fieldset>
 <label className="privacy-ack" htmlFor={fieldId('privacy')}><input type="checkbox" id={fieldId('privacy')} required /><span>I have read the <Link href="/privacy" target="_blank" rel="noopener noreferrer">privacy notice</Link> and understand these details will be passed to WhatsApp to prepare my enquiry.</span></label>
 <p className="form-privacy">No marketing signup is included. Please do not attach medical records here. Ask the team how to share clinical documents appropriately.</p>
 <button type="submit" disabled={!hydrated} className="btn btn-primary btn-block">Review enquiry in WhatsApp <UiIcon name="arrow" size={18} /></button>
 <noscript><p>Please enable JavaScript to prepare your enquiry, or contact the team directly by phone or email. No form details have been sent.</p></noscript>
 <p className="form-footnote">Even if you prefer a phone or email reply, this form opens WhatsApp. You must press Send there. You can also call or email the team directly.</p>
 {prepared && <p role="status">Your message is prepared. Review it and press Send in WhatsApp. No appointment is booked automatically.</p>}
 </form>;
}
