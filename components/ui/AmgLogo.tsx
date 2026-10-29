export function AmgLogo({ height = 16, color = '#888580' }: { height?: number; color?: string }) {
  return (
    <svg height={height} viewBox="0 0 180 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        <rect x="0" y="4" width="10" height="28" rx="1" transform="skewX(-14)"/>
        <rect x="14" y="4" width="10" height="28" rx="1" transform="skewX(-14)"/>
        <rect x="28" y="4" width="10" height="28" rx="1" transform="skewX(-14)"/>
      </g>
      <text x="50" y="29" fontFamily="'Arial Black','Impact',sans-serif" fontSize="28" fontWeight="900" fill={color} letterSpacing="1">AMG</text>
    </svg>
  )
}
