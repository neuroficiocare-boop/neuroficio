'use client';
import Script from 'next/script';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'neuroficio-analytics';
const MEASUREMENT_ID = 'G-LFNN9NR7CZ';
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

function hasConsent() { try { return localStorage.getItem(STORAGE_KEY) === 'allowed'; } catch { return false; } }
function storeChoice(allowed: boolean) {
 try { localStorage.setItem(STORAGE_KEY, allowed ? 'allowed' : 'declined'); } catch { /* Essential features remain usable. */ }
 (window as AnalyticsWindow).gtag?.('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
 window.dispatchEvent(new Event('neuroficio-analytics-choice'));
}
export function trackContactAction(name: 'whatsapp_click' | 'phone_click') {
 if (window.location.pathname.startsWith('/portal')) return;
 if (!hasConsent()) return;
 // Explicit event allowlist. No link URLs, form values or message text.
 (window as AnalyticsWindow).gtag?.('event', name, { page_location: `${window.location.origin}${window.location.pathname}` });
}
export function AnalyticsPreference() {
 const [message, setMessage] = useState('');
 return <div className="analytics-preferences"><button type="button" className="btn btn-outline btn-sm" onClick={()=>{ storeChoice(false); setMessage('Optional analytics declined.'); }}>Decline analytics</button><button type="button" className="btn btn-outline btn-sm" onClick={()=>{ storeChoice(true); setMessage('Optional analytics allowed.'); }}>Allow analytics</button><span role="status">{message}</span></div>;
}
export default function AnalyticsConsent() {
 const pathname = usePathname();
 const [choice, setChoice] = useState<string | null>('loading');
 const [ready, setReady] = useState(false);
 useEffect(()=>{
  (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = pathname.startsWith('/portal');
  if (pathname.startsWith('/portal')) return;
  const update = () => { try { setChoice(localStorage.getItem(STORAGE_KEY)); } catch { setChoice('declined'); } };
  update(); window.addEventListener('neuroficio-analytics-choice', update);
  const click = (e: MouseEvent) => {
   const target = e.target instanceof Element ? e.target.closest('a') : null;
   const href = target?.getAttribute('href') || '';
   if (href.startsWith('tel:')) trackContactAction('phone_click');
   else if (href.startsWith('https://wa.me/')) trackContactAction('whatsapp_click');
  };
  document.addEventListener('click', click);
  return ()=>{ window.removeEventListener('neuroficio-analytics-choice', update); document.removeEventListener('click', click); };
 }, [pathname]);
 useEffect(()=>{
  if (pathname.startsWith('/portal') || choice !== 'allowed' || !ready) return;
  (window as AnalyticsWindow).gtag?.('event', 'page_view', { page_location: `${window.location.origin}${pathname}`, page_referrer: '', page_title: 'NeuroFicio' });
 }, [pathname, choice, ready]);
 if (pathname.startsWith('/portal')) return null;
 return <>
 {choice === 'allowed' && <Script id="neuroficio-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} strategy="afterInteractive" onReady={()=>{
  const w = window as AnalyticsWindow; w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer!.push(arguments); };
  w.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  w.gtag('js', new Date());
  w.gtag('config', MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: `${window.location.origin}${window.location.pathname}`, page_referrer: '', page_title: 'NeuroFicio' });
  setReady(true);
 }} />}
 {choice === null && <aside className="analytics-notice" aria-label="Optional website analytics"><p>Allow optional analytics to help us understand website use? Enquiry details are excluded. <Link href="/privacy">Privacy notice</Link></p><div><button type="button" className="btn btn-outline btn-sm" onClick={()=>storeChoice(false)}>No thanks</button><button type="button" className="btn btn-dark btn-sm" onClick={()=>storeChoice(true)}>Allow analytics</button></div></aside>}
 </>;
}
