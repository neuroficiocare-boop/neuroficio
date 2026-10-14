export default function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg aria-hidden="true" className="mark" width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="6" cy="24" r="3.4" fill="#ECE7DC" stroke="#0A2540" strokeWidth="1.6" />
      <circle cx="16" cy="15" r="2.6" fill="#14B8A6" />
      <circle cx="26" cy="7" r="2.6" fill="#14B8A6" />
      <path d="M8.4 21.8L13.6 16.8M18.4 13.2L23.6 8.6" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
