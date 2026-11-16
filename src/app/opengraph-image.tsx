import { ImageResponse } from 'next/og';
export const alt = 'NeuroFicio - specialist neurological rehabilitation at home';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
 return new ImageResponse(<div style={{ background: '#0A2540', color: 'white', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80 }}>
 <div style={{ color: '#5EEAD4', fontSize: 38, marginBottom: 36 }}>NeuroFicio</div>
 <div style={{ fontSize: 64, lineHeight: 1.15 }}>Expert neurological rehabilitation</div>
 <div style={{ fontSize: 32, marginTop: 24 }}>Personalised for every step of recovery.</div>
 </div>, size);
}
