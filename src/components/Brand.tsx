import Image from 'next/image';
import Link from 'next/link';

export default function Brand() {
 return <Link href="/" className="brand brand-official" aria-label="NeuroFicio home"><Image src="/brand/neuroficio-logo.webp" alt="NeuroFicio" width={900} height={295} className="official-logo" /></Link>;
}
