export function BmwRoundel({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="bmw-circle"><circle cx="100" cy="100" r="88"/></clipPath>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#1A1A1A"/>
      <circle cx="100" cy="100" r="88" fill="white"/>
      <rect x="12" y="12" width="88" height="88" fill="#1C69D4" clipPath="url(#bmw-circle)"/>
      <rect x="100" y="12" width="88" height="88" fill="white" clipPath="url(#bmw-circle)"/>
      <rect x="12" y="100" width="88" height="88" fill="white" clipPath="url(#bmw-circle)"/>
      <rect x="100" y="100" width="88" height="88" fill="#1C69D4" clipPath="url(#bmw-circle)"/>
      <rect x="96" y="12" width="8" height="176" fill="#1A1A1A"/>
      <rect x="12" y="96" width="176" height="8" fill="#1A1A1A"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#1A1A1A" strokeWidth="6"/>
      <circle cx="100" cy="100" r="96" fill="none" stroke="#1A1A1A" strokeWidth="8"/>
    </svg>
  )
}
