import { Activity, Brain, Accessibility, Heart, House, Globe, ClipboardList, Users, ArrowRight, ArrowUpRight, Phone, Mail, MapPin, Check, BookOpen, Search, ChevronDown, Menu, X, MessageCircle, Monitor, ShieldCheck } from 'lucide-react';
const icons = { activity: Activity, brain: Brain, accessibility: Accessibility, heart: Heart, home: House, globe: Globe, clipboard: ClipboardList, users: Users, arrow: ArrowRight, diagonal: ArrowUpRight, phone: Phone, mail: Mail, pin: MapPin, check: Check, book: BookOpen, search: Search, chevron: ChevronDown, menu: Menu, close: X, message: MessageCircle, monitor: Monitor, shield: ShieldCheck };
export type IconName = keyof typeof icons;
export default function UiIcon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
 const Icon = icons[name]; return <Icon size={size} strokeWidth={1.6} className={className} aria-hidden="true" />;
}
