'use client'
import { useState } from 'react'
import { Filter, Layers, Globe, MapPin, RefreshCw, AlertTriangle, Shield, Users, Building2, TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import { ALL_OPERATIONS } from '@/components/map/DisasterMap'

const DisasterMap = dynamic(() => import('@/components/map/DisasterMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[640px] flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
          <div className="absolute inset-3 w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        <p className="text-blue-200 font-semibold text-sm">Initializing Geospatial Engine...</p>
        <p className="text-blue-400 text-xs mt-1">Loading {ALL_OPERATIONS.disasters.length} incidents · {ALL_OPERATIONS.shelters.length} shelters</p>
      </div>
    </div>
  ),
})

const GoogleDisasterMap = dynamic(() => import('@/components/map/GoogleDisasterMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[640px] flex items-center justify-center bg-slate-900 text-slate-300">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading Google Maps API Engine...</p>
      </div>
    </div>
  ),
})

const STAT_CARDS = [
  {
    label: 'Active Disasters', value: ALL_OPERATIONS.disasters.length,
    icon: AlertTriangle, color: 'from-red-500 to-red-600', textColor: 'text-red-100',
    sub: `${ALL_OPERATIONS.disasters.filter(d => d.severity === 'CRITICAL').length} CRITICAL`
  },
  {
    label: 'Operational Shelters', value: ALL_OPERATIONS.shelters.filter(s => s.data.status === 'operational').length,
    icon: Building2, color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-100',
    sub: `${ALL_OPERATIONS.shelters.filter(s => s.data.status === 'damaged').length} damaged / closed`
  },
  {
    label: 'People at Risk', value: ALL_OPERATIONS.disasters.reduce((s, d) => s + (d.data.affected_population || 0), 0).toLocaleString(),
    icon: Users, color: 'from-orange-500 to-orange-600', textColor: 'text-orange-100',
    sub: 'Across all disaster zones'
  },
  {
    label: 'Shelter Spaces Free', value: ALL_OPERATIONS.shelters.filter(s => s.data.status === 'operational').reduce((s, sh) => s + sh.data.available, 0).toLocaleString(),
    icon: Shield, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-100',
    sub: `of ${ALL_OPERATIONS.shelters.reduce((s, sh) => s + sh.data.capacity, 0).toLocaleString()} total capacity`
  },
  {
    label: 'Evacuation Routes', value: ALL_OPERATIONS.routes.length,
    icon: TrendingUp, color: 'from-purple-500 to-purple-600', textColor: 'text-purple-100',
    sub: 'Active corridors mapped'
  },
]

const INCIDENT_TABLE = ALL_OPERATIONS.disasters.map(d => ({
  id: d.id.toUpperCase(),
  name: d.data.name,
  type: d.type,
  severity: d.severity,
  affected: d.data.affected_population?.toLocaleString(),
  agency: d.data.agency,
  coords: d.data.coords || `${d.lat.toFixed(3)}°N, ${d.lng.toFixed(3)}°E`,
}))

const TYPE_ICONS: Record<string, string> = {
  flood: '🌊', cyclone: '🌀', earthquake: '🏚️', wildfire: '🔥', landslide: '⛰️', shelter: '🏕️'
}
const SEV_CLASS: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700 border border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border border-orange-200',
  MODERATE: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
}

export default function MapPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'google'>('leaflet')

  return (
    <div className="flex flex-col h-full bg-[#F0F4F8]">

      {/* ── HERO HEADER ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-navy-900 via-[#1e3a5f] to-[#1E56A0] px-6 py-5 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">Disaster Operations Command Map</h1>
                <p className="text-blue-200 text-xs mt-0.5">Real-time geospatial intelligence · NDMA / TNSDMA / KSDMA / IMD Live Feed</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Map Engine Toggle: Leaflet OSM vs Google Maps API */}
            <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/20 backdrop-blur-md">
              <button
                onClick={() => setMapEngine('leaflet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  mapEngine === 'leaflet'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <span>🗺️ Leaflet / OSM</span>
              </button>
              <button
                onClick={() => setMapEngine('google')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  mapEngine === 'google'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <span>🛰️ Google Maps API</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              NDMA Active Feed
            </div>
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition"
              title="Refresh map"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
          {STAT_CARDS.map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-3.5 shadow-lg`}>
                <div className="flex items-start justify-between mb-2">
                  <p className={`text-xs font-medium ${card.textColor} leading-tight`}>{card.label}</p>
                  <Icon className="w-4 h-4 text-white/60 flex-shrink-0" />
                </div>
                <p className="text-white font-black text-xl leading-none">{card.value}</p>
                <p className={`text-xs ${card.textColor} mt-1 opacity-80`}>{card.sub}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── MAIN MAP (Full Frame) ────────────────────────────── */}
      <div className="flex-1 relative min-h-[540px] overflow-hidden">
        {mapEngine === 'leaflet' ? (
          <DisasterMap
            key={`leaflet-${refreshKey}`}
            shelterMarkers={[]}
            disasterZones={[]}
            evacuationRoutes={[]}
          />
        ) : (
          <GoogleDisasterMap
            key={`google-${refreshKey}`}
            shelterMarkers={ALL_OPERATIONS.shelters}
            disasterZones={ALL_OPERATIONS.disasters}
            evacuationRoutes={ALL_OPERATIONS.routes}
          />
        )}
      </div>

      {/* ── LEGEND + OPERATIONS TABLE ────────────────────────── */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 flex-shrink-0">

        {/* Legend row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Map Legend:</span>
          {[
            { icon: '🌊', label: 'Flood Zone', cls: 'text-blue-700 bg-blue-50 border-blue-200' },
            { icon: '🌀', label: 'Cyclone', cls: 'text-red-700 bg-red-50 border-red-200' },
            { icon: '🏚️', label: 'Earthquake', cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
            { icon: '🔥', label: 'Wildfire', cls: 'text-orange-700 bg-orange-50 border-orange-200' },
            { icon: '⛰️', label: 'Landslide', cls: 'text-purple-700 bg-purple-50 border-purple-200' },
            { icon: '🏕️', label: 'Open Shelter', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { icon: '⛔', label: 'Damaged Shelter', cls: 'text-gray-700 bg-gray-50 border-gray-200' },
            { icon: '🛣️', label: 'Evac Route', cls: 'text-blue-700 bg-blue-50 border-blue-200' },
          ].map(({ icon, label, cls }) => (
            <div key={label} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>

        {/* Operations table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Operation Name</th>
                <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Affected</th>
                <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Agency</th>
                <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {INCIDENT_TABLE.map((row, i) => (
                <tr key={row.id} className={`hover:bg-blue-50/40 transition group ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {row.id.toUpperCase().slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{row.name}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-sm">{TYPE_ICONS[row.type] || '⚠️'}</span>
                    <span className="ml-1.5 text-xs text-gray-600 capitalize">{row.type}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEV_CLASS[row.severity] || 'bg-gray-100 text-gray-700'}`}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-bold text-gray-900">{row.affected}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-gray-600">{row.agency}</span>
                  </td>
                  <td className="px-4 py-2.5 hidden lg:table-cell">
                    <span className="text-xs font-mono text-gray-500">{row.coords}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
