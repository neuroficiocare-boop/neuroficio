'use client';
import { useState } from 'react';
import UiIcon from './UiIcon';
type Props = { defaultService?: string; source?: string; idPrefix?: string };
export default function EnquiryForm({ defaultService, source, idPrefix = 'enquiry' }: Props = {}) {
 const [prepared, setPrepared] = useState(false);
 return <form action="https://wa.me/918341471837" method="get" onSubmit={event => {
  const form = event.currentTarget;
  const data = new FormData(form);
  const text = `Hello NeuroFicio, I would like to enquire about ${data.get('service')}. My location is ${data.get('location')}. My preferred time and time zone are ${data.get('time') || 'to be discussed'}. Please confirm availability, assessment details and ongoing fees.${source ? ` I was reading: ${source}.` : ''}`;
  (form.elements.namedItem('text') as HTMLInputElement).value = text;
  setPrepared(true);
 }}>
 <span className="eyebrow">Your care enquiry</span><h2>Let us start with you.</h2><p className="form-intro">A few details help us understand the right starting point. Review and send your message in WhatsApp.</p>
 <input type="hidden" name="text" />
 <div className="field"><label htmlFor={`${idPrefix}-service`}>What would you like help with?</label><select id={`${idPrefix}-service`} name="service" defaultValue={defaultService} required>
 {['Stroke rehabilitation', 'Brain injury rehabilitation', 'Spinal cord injury rehabilitation', 'Parkinson’s physiotherapy', 'Online neuro rehabilitation', 'Second opinion', 'Rehabilitation equipment', 'Caregiver support'].map(s => <option key={s}>{s}</option>)}
 </select></div>
 <div className="field"><label htmlFor={`${idPrefix}-location`}>Your country or Hyderabad area</label><input id={`${idPrefix}-location`} name="location" required placeholder="For example: Gachibowli or United Kingdom" maxLength={120} autoComplete="country-name" /></div>
 <div className="field"><label htmlFor={`${idPrefix}-time`}>Preferred contact time and time zone</label><input id={`${idPrefix}-time`} name="time" maxLength={120} placeholder="For example: 4-6pm, London time" /></div>
 <p className="form-privacy">Please leave detailed medical records out of your first message. WhatsApp is an external service; ask the team how to share clinical documents.</p>
 <button type="submit" className="btn btn-primary btn-block">Continue to WhatsApp <UiIcon name="arrow" size={18} /></button>
 <p className="form-footnote">You stay in control. No appointment is booked automatically.</p>
 {prepared && <p role="status">Review the message and press Send in WhatsApp. You can also call +91 83414 71837 or email neuroficio.care@gmail.com.</p>}
 </form>;
}
