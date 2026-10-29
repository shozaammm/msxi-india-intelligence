export function MercedesStar({ size = 40, variant = 'chrome' }: { size?: number; variant?: 'chrome' | 'outline' | 'watermark' }) {
  if (variant === 'outline') return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="8"/>
      <path d="M100 18L107 88L100 105L93 88Z" fill="currentColor"/>
      <path d="M100 18L107 88L100 105L93 88Z" fill="currentColor" transform="rotate(120,100,100)"/>
      <path d="M100 18L107 88L100 105L93 88Z" fill="currentColor" transform="rotate(240,100,100)"/>
    </svg>
  )
  const id = `mbg-${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}-bg`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#D8D8D8"/>
          <stop offset="45%" stopColor="#A8A8A8"/>
          <stop offset="100%" stopColor="#606060"/>
        </radialGradient>
        <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#707070"/>
          <stop offset="30%" stopColor="#E0E0E0"/>
          <stop offset="55%" stopColor="#C0C0C0"/>
          <stop offset="80%" stopColor="#E8E8E8"/>
          <stop offset="100%" stopColor="#808080"/>
        </linearGradient>
        <linearGradient id={`${id}-a1`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2A2A2A"/><stop offset="40%" stopColor="#888"/><stop offset="100%" stopColor="#C8C8C8"/>
        </linearGradient>
        <linearGradient id={`${id}-a2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8C8C8"/><stop offset="60%" stopColor="#707070"/><stop offset="100%" stopColor="#2A2A2A"/>
        </linearGradient>
        <linearGradient id={`${id}-a3`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#909090"/><stop offset="50%" stopColor="#B0B0B0"/><stop offset="100%" stopColor="#404040"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-bg)`}/>
      <circle cx="100" cy="100" r="92" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="10"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <path d="M100 10L106 95L100 108L94 95Z" fill={`url(#${id}-a1)`}/>
      <path d="M100 10L106 95L100 108L94 95Z" fill={`url(#${id}-a2)`} transform="rotate(120,100,100)"/>
      <path d="M100 10L106 95L100 108L94 95Z" fill={`url(#${id}-a3)`} transform="rotate(240,100,100)"/>
      <circle cx="100" cy="100" r="9" fill="#D0D0D0"/>
      <circle cx="100" cy="100" r="5" fill="#A8A8A8"/>
    </svg>
  )
}
