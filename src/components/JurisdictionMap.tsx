import React, { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Layers,
  Compass,
  Navigation,
  Globe,
  Maximize2,
  Wind
} from 'lucide-react';
import { FloridaZipRecord } from '../types/permits';
import { getCountyGeoInfo, normalizeCountyKey } from '../data/floridaCountyData';
import { useLanguage } from '../context/LanguageContext';

interface JurisdictionMapProps {
  record: FloridaZipRecord;
  className?: string;
}

export function JurisdictionMap({ record, className = '' }: JurisdictionMapProps) {
  const { isSpanish } = useLanguage();
  const [mapType, setMapType] = useState<'street' | 'county'>('street');
  const [isInteractive, setIsInteractive] = useState(false);

  const city = (record.City || '').trim();
  const county = (record.County || '').trim();
  const zip = String(record.zip || '');

  // Retrieve geographic coordinates
  const countyInfo = getCountyGeoInfo(county);
  const lat = typeof record.lat === 'number' ? record.lat : countyInfo ? countyInfo.lat : 27.9944;
  const lon = typeof record.long === 'number' ? record.long : countyInfo ? countyInfo.lon : -81.7603;

  // OpenStreetMap Bounding Box (±0.06 deg for clean city-level zoom)
  const bboxDelta = 0.05;
  const minLon = (lon - bboxDelta).toFixed(4);
  const maxLon = (lon + bboxDelta).toFixed(4);
  const minLat = (lat - bboxDelta * 0.8).toFixed(4);
  const maxLat = (lat + bboxDelta * 0.8).toFixed(4);

  // OpenStreetMap embed URL
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat.toFixed(4)},${lon.toFixed(4)}`;

  // Navigation Links
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city || ''} ${county} County FL ${zip}`.trim())}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(`${city || ''} ${county} County FL ${zip}`.trim())}`;
  const osmFullUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`;

  return (
    <div className={`bg-white border border-[#d5d5d5] rounded-[3px] overflow-hidden shadow-xs font-sans ${className}`}>
      {/* Map Bar Header */}
      <div className="bg-[#f8f9fa] border-b border-[#e5e5e5] px-3 py-2 flex items-center justify-between gap-2 text-[12px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#0066c0] shrink-0" />
          <span className="font-bold text-[#222] truncate">
            {city ? `${city}, ` : ''}{county} County, FL {zip}
          </span>
          <span className="text-[10px] text-[#777] font-mono shrink-0 hidden sm:inline">
            ({lat.toFixed(2)}°N, {Math.abs(lon).toFixed(2)}°W)
          </span>
        </div>

        {/* View Switcher: Interactive Street Map vs Regional County Locator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center bg-white border border-[#ccc] rounded-[2px] p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setMapType('street')}
              className={`px-2 py-0.5 rounded-[2px] font-bold cursor-pointer transition-colors ${
                mapType === 'street'
                  ? 'bg-[#0066c0] text-white'
                  : 'text-[#555] hover:text-[#222]'
              }`}
            >
              Street (OSM)
            </button>
            <button
              type="button"
              onClick={() => setMapType('county')}
              className={`px-2 py-0.5 rounded-[2px] font-bold cursor-pointer transition-colors ${
                mapType === 'county'
                  ? 'bg-[#0066c0] text-white'
                  : 'text-[#555] hover:text-[#222]'
              }`}
            >
              State Locator
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Frame */}
      <div
        className="relative w-full h-[220px] bg-[#f1f5f9] flex items-center justify-center overflow-hidden"
        onMouseLeave={() => setIsInteractive(false)}
      >
        {mapType === 'street' ? (
          <>
            {/* Interactive OpenStreetMap Embed (Scroll-Protected) */}
            <iframe
              title={`Street map of ${city}, ${county} County, Florida`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={osmEmbedUrl}
              className={`w-full h-full border-0 select-none ${
                isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              loading="lazy"
            />

            {/* Click to Activate Overlay (Prevents scroll trapping) */}
            {!isInteractive ? (
              <button
                type="button"
                onClick={() => setIsInteractive(true)}
                className="absolute inset-0 w-full h-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer transition-colors group z-10"
                title="Click to interact with street map"
              >
                <span className="bg-slate-900/85 group-hover:bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-[4px] shadow-md flex items-center gap-1.5 transition-all">
                  <Maximize2 className="w-3.5 h-3.5 text-sky-300" />
                  <span>{isSpanish ? 'Haga clic para interactuar con el mapa' : 'Click to interact / zoom map'}</span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsInteractive(false)}
                className="absolute top-2 right-2 z-20 bg-white/95 hover:bg-white text-[#333] border border-[#cbd5e1] text-[10.5px] font-bold px-2 py-0.5 rounded-[3px] shadow-sm cursor-pointer"
                title="Lock map to scroll page smoothly"
              >
                ✓ {isSpanish ? 'Bloquear mapa' : 'Lock map scroll'}
              </button>
            )}
          </>
        ) : (
          /* Florida County Locator SVG View */
          <div className="w-full h-full p-2 flex items-center justify-center bg-[#f8fafc] relative">
            <svg
              viewBox="0 0 600 480"
              className="w-full h-full max-h-[210px] select-none filter drop-shadow-xs"
              role="img"
              aria-label="Florida State County Locator"
            >
              {/* Florida Coastline Silhouette */}
              <path
                d="M 20 60 L 260 70 L 280 90 L 360 90 L 420 70 L 440 85 L 430 130 L 460 170 L 515 280 L 530 360 L 530 430 L 490 440 L 440 400 L 400 370 L 360 300 L 340 260 L 360 210 L 320 140 L 250 90 L 190 120 L 140 90 L 20 60 Z"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M 500 440 Q 450 460 410 470"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Pinpoint on Selected County */}
              {countyInfo && (
                <g>
                  {/* Glowing Radar Pulse */}
                  <circle
                    cx={countyInfo.svgX}
                    cy={countyInfo.svgY}
                    r="22"
                    fill="#0066c0"
                    fillOpacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    cx={countyInfo.svgX}
                    cy={countyInfo.svgY}
                    r="9"
                    fill="#0066c0"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Pin label */}
                  <text
                    x={countyInfo.svgX}
                    y={countyInfo.svgY - 14}
                    textAnchor="middle"
                    className="text-[14px] font-extrabold fill-[#003366]"
                    style={{
                      paintOrder: 'stroke',
                      stroke: '#ffffff',
                      strokeWidth: '4px',
                      strokeLinejoin: 'round'
                    }}
                  >
                    📍 {city || county} ({county} Co.)
                  </text>
                </g>
              )}
            </svg>

            {/* Inset Badge */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs border border-[#cbd5e1] rounded-[2px] p-1.5 text-[10.5px] shadow-xs">
              <span className="font-bold text-[#1e293b] block">
                {county} County, {countyInfo?.region || 'Florida'}
              </span>
              <span className="text-[#64748b]">
                County Seat: {countyInfo?.seat || '—'} • Wind Zone {countyInfo?.windZone || '—'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Launch Buttons */}
      <div className="bg-[#f8f9fa] border-t border-[#e5e5e5] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="text-[#666] flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-[#888]" />
          <span>{isSpanish ? 'Mapa Geográfico • OpenStreetMap' : 'Geographic Street Map • OpenStreetMap'}</span>
        </div>

        {/* 1-Click Launch Buttons */}
        <div className="flex items-center gap-1.5">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-white hover:bg-[#edf2f7] border border-[#ccc] rounded-[2px] text-[#0066c0] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="Open coordinates in Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>

          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-white hover:bg-[#edf2f7] border border-[#ccc] rounded-[2px] text-[#333] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="Open in Apple Maps"
          >
            <span>Apple Maps</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>

          <a
            href={osmFullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-white hover:bg-[#edf2f7] border border-[#ccc] rounded-[2px] text-[#555] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="Open on OpenStreetMap.org"
          >
            <span>OSM</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
}
