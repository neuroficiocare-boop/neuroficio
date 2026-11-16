import type { Metadata } from 'next';
import AnalyticsConsent from '@/components/AnalyticsConsent';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { SITE_URL, jsonLd } from '@/lib/seo';
import './globals.css';
import './home-refresh.css';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const serif = Source_Serif_4({ subsets: ['latin'], display: 'swap', variable: '--font-editorial' });
export const metadata: Metadata = {
 metadataBase: new URL(SITE_URL),
 title: { default: 'NeuroFicio | Neurological Rehabilitation', template: '%s | NeuroFicio' },
 description: 'Specialist neurological rehabilitation at home in Hyderabad, support for overseas families and international in-person care enquiries.',
 robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
 icons: { icon: '/icon.png', apple: '/apple-icon.png' },
 verification: {
  google: 'ni4j0SFsHZZb-M-67jsIl413Jm4Y42ON9v5mtdUCEHE',
  other: { 'msvalidate.01': '21982F0DBD5FC7766D3599302CBAFB11' },
 },
};
const organization = { '@context': 'https://schema.org', '@type': 'MedicalBusiness', '@id': `${SITE_URL}/#organization`,
 name: 'NeuroFicio', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/neuroficio-logo.webp`, width: 900, height: 295 }, image: `${SITE_URL}/brand/neuroficio-logo.webp`, telephone: '+918341471837', email: 'neuroficio.care@gmail.com',
 address: { '@type': 'PostalAddress', streetAddress: 'Second floor, Huda Residential Layout, Plot 118, above Frills Boutique, Nallagandla', addressLocality: 'Hyderabad', addressRegion: 'Telangana', postalCode: '500019', addressCountry: 'IN' } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en" className={`${inter.variable} ${serif.variable}`}><body>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ '@context': 'https://schema.org', '@graph': [{ ...organization, '@context': undefined }, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: 'NeuroFicio', inLanguage: 'en', publisher: { '@id': `${SITE_URL}/#organization` } }] }) }} />{children}
 <AnalyticsConsent />
 </body></html>;
}
