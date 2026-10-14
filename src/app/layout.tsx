import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { SITE_URL, jsonLd } from '@/lib/seo';
import './globals.css';
const GOOGLE_ANALYTICS_ID = 'G-LFNN9NR7CZ';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const serif = Source_Serif_4({ subsets: ['latin'], display: 'swap', variable: '--font-editorial' });
export const metadata: Metadata = {
 metadataBase: new URL(SITE_URL),
 title: { default: 'NeuroFicio | Neurological Rehabilitation', template: '%s | NeuroFicio' },
 description: 'Home neurological physiotherapy in Hyderabad and enquiries about remote rehabilitation for patients and caregivers.',
 robots: { index: true, follow: true },
 verification: {
  google: 'ni4j0SFsHZZb-M-67jsIl413Jm4Y42ON9v5mtdUCEHE',
  other: { 'msvalidate.01': '21982F0DBD5FC7766D3599302CBAFB11' },
 },
};
const organization = { '@context': 'https://schema.org', '@type': 'MedicalBusiness', '@id': `${SITE_URL}/#organization`,
 name: 'NeuroFicio', url: SITE_URL, telephone: '+918341471837', email: 'neuroficio.care@gmail.com',
 address: { '@type': 'PostalAddress', streetAddress: 'Second floor, Huda Residential Layout, Plot 118, above Frills Boutique, Nallagandla', addressLocality: 'Hyderabad', addressRegion: 'Telangana', postalCode: '500019', addressCountry: 'IN' } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en" className={`${inter.variable} ${serif.variable}`}><body>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organization) }} />{children}
 <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} strategy="afterInteractive" />
 <Script id="google-analytics-init" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GOOGLE_ANALYTICS_ID}');
 `}</Script>
 </body></html>;
}
