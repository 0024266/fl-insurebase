import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Wind,
  Shield,
  ExternalLink,
  ChevronRight,
  Layers,
  Filter,
  Info
} from 'lucide-react';
import {
  FLORIDA_COUNTIES_GEO,
  FLORIDA_REGIONS,
  CountyGeoInfo,
  normalizeCountyKey
} from '../data/floridaCountyData';
import { useLanguage } from '../context/LanguageContext';

interface FloridaCountyMapProps {
  selectedCounty: string;
  onSelectCounty: (countyName: string) => void;
  selectedCity?: string;
  className?: string;
  compact?: boolean;
}

export function FloridaCountyMap({
  selectedCounty,
  onSelectCounty,
  selectedCity,
  className = '',
  compact = false
}: FloridaCountyMapProps) {
  const { isSpanish } = useLanguage();
  const [hoveredCountyKey, setHoveredCountyKey] = useState<string | null>(null);
  const [colorMode, setColorMode] = useState<'wind' | 'region'>('wind');
  const [activeRegion, setActiveRegion] = useState<string>('ALL');

  const normalizedSelectedKey = normalizeCountyKey(selectedCounty);

  // Group counties list
  const countyEntries = useMemo(() => {
    return Object.entries(FLORIDA_COUNTIES_GEO).map(([key, info]) => ({
      key,
      ...info
    }));
  }, []);

  const filteredCounties = useMemo(() => {
    if (activeRegion === 'ALL') return countyEntries;
    return countyEntries.filter((c) => c.region === activeRegion);
  }, [countyEntries, activeRegion]);

  const activeCountyInfo: CountyGeoInfo | null = useMemo(() => {
    if (hoveredCountyKey) return FLORIDA_COUNTIES_GEO[hoveredCountyKey] || null;
    if (normalizedSelectedKey) return FLORIDA_COUNTIES_GEO[normalizedSelectedKey] || null;
    return null;
  }, [hoveredCountyKey, normalizedSelectedKey]);

  // Color resolution
  const getCountyColor = (info: CountyGeoInfo, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return '#0066c0'; // Selected blue
    if (isHovered) return '#f59e0b'; // Amber hover

    if (colorMode === 'wind') {
      // Terrain C (coastal / high wind) vs Terrain B (inland)
      return info.defaultTerrain === 'C' ? '#38bdf8' : '#34d399';
    }

    // Region mode
    switch (info.region) {
      case 'Panhandle':
        return '#f87171';
      case 'North':
        return '#fb923c';
      case 'Central':
        return '#fbbf24';
      case 'Tampa Bay':
        return '#a3e635';
      case 'Treasure Coast':
        return '#2dd4bf';
      case 'Southwest':
        return '#818cf8';
      case 'South':
        return '#c084fc';
      case 'Keys':
        return '#f472b6';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className={`bg-white border border-[#d5d5d5] rounded-[3px] p-3 sm:p-4 shadow-xs font-sans ${className}`}>
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#e5e5e5]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#e8f4fd] border border-[#b8daf7] flex items-center justify-center text-[#004b91]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-[13.5px] text-[#222] leading-tight">
              {isSpanish ? 'Mapa Interactivo de Florida (67 Condados)' : 'Interactive Florida County Map (67 Count)'}
            </h3>
            <p className="text-[11px] text-[#666]">
              {isSpanish
                ? 'Haga clic en cualquier condado o use los filtros regionales para explorar registros'
                : 'Click any county to filter directory records or explore by region'}
            </p>
          </div>
        </div>

        {/* Color Mode & Reset */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-[#f0f2f5] border border-[#ccc] rounded-[2px] p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setColorMode('wind')}
              className={`px-2 py-0.5 rounded-[2px] font-bold cursor-pointer transition-colors ${
                colorMode === 'wind' ? 'bg-[#004b91] text-white' : 'text-[#555] hover:text-[#222]'
              }`}
            >
              Wind Exposure
            </button>
            <button
              type="button"
              onClick={() => setColorMode('region')}
              className={`px-2 py-0.5 rounded-[2px] font-bold cursor-pointer transition-colors ${
                colorMode === 'region' ? 'bg-[#004b91] text-white' : 'text-[#555] hover:text-[#222]'
              }`}
            >
              Regions
            </button>
          </div>

          {selectedCounty && selectedCounty !== 'ALL' && (
            <button
              type="button"
              onClick={() => onSelectCounty('ALL')}
              className="text-[11px] text-[#004b91] hover:underline font-bold bg-transparent border-0 cursor-pointer"
            >
              {isSpanish ? 'Ver Todo FL' : 'Show All FL'}
            </button>
          )}
        </div>
      </div>

      {/* Region Selector Pills */}
      {!compact && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-b border-[#f0f0f0] text-[11px] scrollbar-thin">
          <span className="text-[#777] font-semibold flex items-center gap-1 shrink-0 text-[10.5px]">
            <Filter className="w-3 h-3" /> Region:
          </span>
          {FLORIDA_REGIONS.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setActiveRegion(reg.id)}
              className={`px-2 py-0.5 rounded-[2px] shrink-0 font-medium cursor-pointer transition-all border ${
                activeRegion === reg.id
                  ? 'bg-[#286090] text-white border-[#286090] font-bold shadow-2xs'
                  : 'bg-white text-[#444] border-[#d0d0d0] hover:bg-[#f7f9fa]'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Map View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3 items-start">
        {/* Left: Florida Interactive Vector SVG Map */}
        <div className="lg:col-span-8 bg-[#f8fafc] border border-[#e2e8f0] rounded-[3px] p-2 sm:p-3 relative overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
          {/* Legend */}
          <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs border border-[#cbd5e1] rounded-[2px] p-1.5 text-[10.5px] shadow-xs flex flex-col gap-1">
            <span className="font-bold text-[#334155] uppercase tracking-wider text-[9.5px]">
              {colorMode === 'wind' ? 'Wind Debris Code' : 'Regions'}
            </span>
            {colorMode === 'wind' ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] inline-block border border-sky-400"></span>
                  <span className="text-[#333]">Terrain C (Coastal)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] inline-block border border-emerald-400"></span>
                  <span className="text-[#333]">Terrain B (Inland)</span>
                </span>
              </div>
            ) : (
              <div className="text-[10px] text-[#64748b]">
                Color-coded by Florida Geographic Region
              </div>
            )}
          </div>

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 600 480"
            className="w-full h-auto max-h-[420px] select-none filter drop-shadow-xs"
            role="img"
            aria-label="Florida Counties Map"
          >
            {/* Background Florida Coastline Silhouette Guide */}
            <path
              d="M 20 60 L 260 70 L 280 90 L 360 90 L 420 70 L 440 85 L 430 130 L 460 170 L 515 280 L 530 360 L 530 430 L 490 440 L 440 400 L 400 370 L 360 300 L 340 260 L 360 210 L 320 140 L 250 90 L 190 120 L 140 90 L 20 60 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinejoin="round"
              opacity="0.55"
            />

            {/* Florida Keys Arc Guide */}
            <path
              d="M 500 440 Q 450 460 410 470"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Connecting County Grid Network / Lines */}
            {countyEntries.map((c) => {
              const isSelected = c.key === normalizedSelectedKey;
              const isHovered = c.key === hoveredCountyKey;
              const isDimmed = activeRegion !== 'ALL' && c.region !== activeRegion;

              const fillColor = getCountyColor(c, isSelected, isHovered);

              return (
                <g
                  key={c.key}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => onSelectCounty(c.name.toUpperCase())}
                  onMouseEnter={() => setHoveredCountyKey(c.key)}
                  onMouseLeave={() => setHoveredCountyKey(null)}
                >
                  {/* Selected / Active glowing radar aura */}
                  {isSelected && (
                    <circle
                      cx={c.svgX}
                      cy={c.svgY}
                      r="16"
                      fill="#0066c0"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* County Node Center Circle */}
                  <circle
                    cx={c.svgX}
                    cy={c.svgY}
                    r={isSelected ? 9 : isHovered ? 8 : 6.5}
                    fill={fillColor}
                    stroke={isSelected ? '#003366' : isHovered ? '#b45309' : '#ffffff'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={isDimmed ? 0.25 : 1}
                    className="transition-all duration-150"
                  />

                  {/* Text Label on selected or large counties */}
                  {(isSelected || isHovered || compact || c.name === 'Miami-Dade' || c.name === 'Orange' || c.name === 'Hillsborough' || c.name === 'Duval' || c.name === 'Escambia') && (
                    <text
                      x={c.svgX}
                      y={c.svgY - 9}
                      textAnchor="middle"
                      className={`text-[9.5px] font-bold pointer-events-none select-none ${
                        isSelected
                          ? 'fill-[#004b91] font-extrabold'
                          : isHovered
                          ? 'fill-amber-900 font-bold'
                          : 'fill-[#334155]'
                      }`}
                      style={{
                        paintOrder: 'stroke',
                        stroke: '#ffffff',
                        strokeWidth: '2.5px',
                        strokeLinejoin: 'round'
                      }}
                    >
                      {c.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Quick Hover / Selection Bar */}
          <div className="w-full bg-white border border-[#e2e8f0] rounded-[2px] p-2 mt-2 flex items-center justify-between text-[11px] text-[#475569]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-[#1e293b]">
                {activeCountyInfo ? activeCountyInfo.name + ' County' : 'Select any Florida county node above'}
              </span>
              {activeCountyInfo && (
                <span className="text-[#64748b]">
                  • Seat: {activeCountyInfo.seat} • {activeCountyInfo.region} Florida
                </span>
              )}
            </div>
            {activeCountyInfo && (
              <button
                type="button"
                onClick={() => onSelectCounty(activeCountyInfo.name.toUpperCase())}
                className="text-[#0066c0] hover:underline font-bold shrink-0 ml-2 cursor-pointer"
              >
                Apply Filter →
              </button>
            )}
          </div>
        </div>

        {/* Right: County Details & Quick Municipalities Card */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          {activeCountyInfo ? (
            <div className="bg-[#f0f7ff] border border-[#b8daf7] rounded-[3px] p-3 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#0066c0] uppercase tracking-wider block">
                    Florida County Profile
                  </span>
                  <h4 className="text-[15px] font-bold text-[#111]">
                    {activeCountyInfo.name} County
                  </h4>
                  <div className="text-[11.5px] text-[#555] mt-0.5">
                    County Seat: <strong>{activeCountyInfo.seat}</strong>
                  </div>
                </div>

                <span
                  className={`text-[10.5px] px-2 py-0.5 rounded font-bold border ${
                    activeCountyInfo.defaultTerrain === 'C'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  Terrain {activeCountyInfo.defaultTerrain}
                </span>
              </div>

              {/* Badges / Stats */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#d8ebfa] text-[11px]">
                <div>
                  <span className="text-[10px] text-[#666] block">Wind Zone:</span>
                  <span className="font-bold text-[#222]">
                    Zone {activeCountyInfo.windZone} ({activeCountyInfo.windZone <= 2 ? '140–160+ MPH' : '120–140 MPH'})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block">Region:</span>
                  <span className="font-bold text-[#222]">{activeCountyInfo.region} FL</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block">Coordinates:</span>
                  <span className="font-mono text-[10.5px] text-[#444]">
                    {activeCountyInfo.lat.toFixed(2)}°N, {Math.abs(activeCountyInfo.lon).toFixed(2)}°W
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] block">Debris Zone:</span>
                  <span className="font-bold text-[#222]">
                    {activeCountyInfo.defaultTerrain === 'C' ? 'Wind-Borne (Coast)' : 'Standard Inland'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2 border-t border-[#d8ebfa] flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectCounty(activeCountyInfo.name.toUpperCase())}
                  className="w-full py-1.5 px-3 bg-[#0066c0] hover:bg-[#004e92] text-white font-bold text-[12px] rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Filter Directory by {activeCountyInfo.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeCountyInfo.name} County FL`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1 px-3 bg-white hover:bg-neutral-50 text-[#333] border border-[#c0d4e8] text-[11px] rounded-[2px] flex items-center justify-center gap-1.5 font-medium cursor-pointer"
                >
                  <span>Open County in Maps</span>
                  <ExternalLink className="w-3 h-3 text-[#666]" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#f8f9fa] border border-[#e5e5e5] rounded-[3px] p-4 text-center text-[#666]">
              <Info className="w-6 h-6 text-[#999] mx-auto mb-1.5" />
              <div className="text-[12px] font-bold text-[#333]">No County Selected</div>
              <div className="text-[11px] text-[#777] mt-1">
                Hover or click on any county circle on the Florida map to preview its wind zone, seat, and permits.
              </div>
            </div>
          )}

          {/* Quick County List for Direct Selection */}
          <div className="bg-white border border-[#d5d5d5] rounded-[3px] p-2.5 shadow-2xs">
            <div className="text-[11px] font-bold text-[#333] mb-1.5 flex items-center justify-between">
              <span>{activeRegion === 'ALL' ? 'Quick Counties' : `${activeRegion} Counties`}</span>
              <span className="text-[10px] text-[#777] font-normal">
                {filteredCounties.length} available
              </span>
            </div>

            <div className="max-h-[160px] overflow-y-auto space-y-0.5 text-[11.5px] pr-1 scrollbar-thin">
              {filteredCounties.map((c) => {
                const isSelected = c.name.toUpperCase() === selectedCounty.toUpperCase();
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => onSelectCounty(c.name.toUpperCase())}
                    className={`w-full text-left px-2 py-1 rounded-[2px] flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0066c0] text-white font-bold'
                        : 'hover:bg-[#f0f4f8] text-[#333]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span
                      className={`text-[9.5px] px-1 py-0.2 rounded font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : c.defaultTerrain === 'C'
                          ? 'text-sky-700 bg-sky-50'
                          : 'text-emerald-700 bg-emerald-50'
                      }`}
                    >
                      {c.defaultTerrain}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
