'use client'
import { useState } from 'react'
import { MapPin, Navigation, Maximize2, Minimize2, ExternalLink, ShieldAlert, Compass } from 'lucide-react'
import Link from 'next/link'
import { IncidentLocation } from '@/lib/rescueBotEngine'

interface Props {
  incident: IncidentLocation
}

export default function IncidentMapCard({ incident }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewEngine, setViewEngine] = useState<'osm' | 'google'>('google')
  const isShelter = incident.type === 'shelter'

  const badgeColor =
    incident.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
    incident.severity === 'HIGH' ? 'bg-orange-500 text-white' :
    incident.severity === 'MODERATE' ? 'bg-amber-500 text-white' :
    'bg-emerald-500 text-white'

  // OpenStreetMap embed URL with calibrated bounding box around incident coordinates
  const zoomSpan = incident.radiusKm ? Math.max(incident.radiusKm * 0.02, 0.08) : 0.06
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${incident.lng - zoomSpan}%2C${incident.lat - (zoomSpan * 0.7)}%2C${incident.lng + zoomSpan}%2C${incident.lat + (zoomSpan * 0.7)}&layer=mapnik&marker=${incident.lat}%2C${incident.lng}`
  const gmapUrl = `https://www.google.com/maps?q=${incident.lat},${incident.lng}&z=12&output=embed`

  return (
    <div className={`mt-3 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden text-slate-800 transition-all duration-300 ${
      isExpanded ? 'ring-2 ring-rescue-blue shadow-xl' : ''
    }`}>
      {/* Top Map Card Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{isShelter ? '🏠' : '🚨'}</span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {incident.name}
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">
              GPS: {incident.lat.toFixed(4)}°N, {incident.lng.toFixed(4)}°E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Engine toggle pill */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-semibold">
            <button
              onClick={() => setViewEngine('google')}
              className={`px-2 py-0.5 rounded-md transition ${
                viewEngine === 'google' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Map
            </button>
            <button
              onClick={() => setViewEngine('osm')}
              className={`px-2 py-0.5 rounded-md transition ${
                viewEngine === 'osm' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OSM
            </button>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs ${badgeColor}`}>
            {incident.severity}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
            title={isExpanded ? 'Collapse map' : 'Expand map view'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Map Frame with Generous Height */}
      <div className={`relative w-full transition-all duration-300 bg-slate-100 ${
        isExpanded ? 'h-96' : 'h-64'
      }`}>
        <iframe
          title={incident.name}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={viewEngine === 'google' ? gmapUrl : osmUrl}
          className="w-full h-full border-0"
          loading="lazy"
        />

        {/* Hazard Perimeter Overlay Badge */}
        {incident.radiusKm && (
          <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1.5 pointer-events-none">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Danger Radius: {incident.radiusKm} km</span>
          </div>
        )}

        {/* Center Target Indicator & Direct Google Link */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold text-slate-700 shadow-md border border-slate-200 pointer-events-none flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-rescue-blue" />
            <span>Active Centroid</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${incident.lat},${incident.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/95 hover:bg-white backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-700 shadow-md border border-slate-200 flex items-center gap-1 transition"
          >
            <span>Google Maps ↗</span>
          </a>
        </div>
      </div>

      {/* Incident / Facility Directive Details */}
      <div className="p-4 bg-white">
        <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          {incident.affectedCount && (
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span>Estimated Affected Population:</span>
              <span className="text-rescue-red font-bold font-mono">{incident.affectedCount.toLocaleString()} evacuees</span>
            </div>
          )}
          <p className="text-xs text-slate-600">{incident.description}</p>
          {incident.evacuationDirective && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs font-medium">
              <span className="font-bold">🚨 Evacuation Directive: </span>
              {incident.evacuationDirective}
            </div>
          )}
        </div>

        {/* Action Link to Full Map */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Live Disaster GIS</span>
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rescue-blue text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <Navigation className="w-3 h-3" />
            <span>Open in Full Command Map</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
