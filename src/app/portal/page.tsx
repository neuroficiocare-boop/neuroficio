import CarePortal from '@/components/portal/CarePortal';
import { configured, emailMode } from '@/lib/portal/server';

export const dynamic = 'force-dynamic';

export default function PortalPage() { return <CarePortal connected={configured()} emailMode={emailMode()} />; }
