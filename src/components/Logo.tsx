import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

/**
 * Modern vector emblem for FL InsureBase.
 * Features a multi-faceted geometric shield, Florida sunburst crest, and document/protection core.
 */
export function LogoIcon({ className = '', size = 32 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transform transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-label="FL InsureBase Shield Emblem"
    >
      <defs>
        {/* Deep Ocean & Blue Navy Shield Gradient */}
        <linearGradient id="flShieldGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a2540" />
          <stop offset="50%" stopColor="#004b91" />
          <stop offset="100%" stopColor="#0066c0" />
        </linearGradient>

        {/* Florida Sunburst & Energy Gold/Orange Accent */}
        <linearGradient id="flAccentGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff8c00" />
          <stop offset="60%" stopColor="#ef6c00" />
          <stop offset="100%" stopColor="#d84315" />
        </linearGradient>

        {/* Inner Core Surface Gradient */}
        <linearGradient id="flCoreGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        {/* Glow & Drop Shadow Filter */}
        <filter id="flShadow" x="-2" y="-2" width="52" height="52" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#001833" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#flShadow)">
        {/* Outer Beveled Shield Frame */}
        <path
          d="M24 3.5C24 3.5 35.5 6.5 41 8C41.5 16.5 42 27.5 24 44.5C6 27.5 6.5 16.5 7 8C12.5 6.5 24 3.5 24 3.5Z"
          fill="url(#flShieldGrad)"
          stroke="url(#flAccentGrad)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Florida Top Sunburst Geometry / Diagonal Facet */}
        <path
          d="M24 5.5L39 9.5C39.4 15.5 39.8 23 33.5 32.5L24 23.5V5.5Z"
          fill="white"
          fillOpacity="0.08"
        />

        {/* Orange Precision Crest Accent Ribbon */}
        <path
          d="M24 7.5C24 7.5 33 10 37.5 11.2C37.8 17.5 37.5 25.5 24 39.5C10.5 25.5 10.2 17.5 10.5 11.2C15 10 24 7.5 24 7.5Z"
          stroke="url(#flAccentGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.6"
          fill="none"
        />

        {/* Center Protected Core Symbol: Clean Building Pillar & Check Mark */}
        {/* Document / Folio Base Rectangle */}
        <rect
          x="16.5"
          y="15.5"
          width="15"
          height="18"
          rx="2"
          fill="none"
          stroke="url(#flCoreGrad)"
          strokeWidth="2"
        />

        {/* Horizontal Document Rows */}
        <line x1="20" y1="20" x2="28" y2="20" stroke="url(#flCoreGrad)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="24.5" x2="28" y2="24.5" stroke="url(#flCoreGrad)" strokeWidth="1.8" strokeLinecap="round" />

        {/* Bold Glowing Checkmark Overlayer */}
        <path
          d="M17.5 26.5L22.5 31.5L32.5 19.5"
          fill="none"
          stroke="url(#flAccentGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 26.5L22.5 31.5L32.5 19.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

interface LogoProps {
  onTabChange?: (tab: any) => void;
  showSubtitle?: boolean;
}

export function Logo({ onTabChange, showSubtitle = true }: LogoProps) {
  return (
    <div
      onClick={() => onTabChange && onTabChange('mortgages')}
      className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
      title="FL InsureBase — Florida Agent Operations Hub"
    >
      <LogoIcon size={34} />

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[18px] text-[#1e293b] tracking-tight leading-none font-sans group-hover:text-[#0066c0] transition-colors whitespace-nowrap drop-shadow-2xs">
            FL InsureBase
          </span>
          <span className="hidden xl:inline-block bg-[#0066c0]/10 text-[#0066c0] border border-[#0066c0]/20 text-[10px] font-bold px-1.5 py-0.2 rounded-[3px] uppercase tracking-wider shrink-0">
            v2.5
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 font-medium tracking-tight leading-tight hidden sm:block mt-0.5 whitespace-nowrap">
            Florida Agent Operations Hub • Mortgagees • Folios • Carriers
          </span>
        )}
      </div>
    </div>
  );
}
