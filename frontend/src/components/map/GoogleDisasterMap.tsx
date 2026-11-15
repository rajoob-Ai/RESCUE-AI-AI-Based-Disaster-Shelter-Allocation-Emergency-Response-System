'use client'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Layers, Key, Check, ExternalLink, ShieldAlert, Sparkles, Navigation } from 'lucide-react'

interface Props {
  shelterMarkers: any[]
  disasterZones: any[]
  evacuationRoutes: any[]
  apiKey?: string
}

declare global {
  interface Window {
    google?: any
    initRescueAiGoogleMap?: () => void
  }
}

const PRESET_LOCATIONS = [
  { name: 'Cyclone Fengal Landfall', lat: 11.9416, lng: 79.8083, type: 'cyclone', severity: 'CRITICAL' },
  { name: 'Chennai Adyar Flood Basin', lat: 13.0569, lng: 80.2425, type: 'flood', severity: 'CRITICAL' },
  { name: 'Wayanad Chooralmala Landslide', lat: 11.6854, lng: 76.1320, type: 'landslide', severity: 'CRITICAL' },
  { name: 'Delhi Yamuna Floodplain', lat: 28.6450, lng: 77.2300, type: 'flood', severity: 'HIGH' },
  { name: 'Teesta GLOF Basin, Sikkim', lat: 27.3516, lng: 88.6138, type: 'flood', severity: 'CRITICAL' },
  { name: 'Coimbatore Seismic Zone', lat: 11.0168, lng: 76.9558, type: 'earthquake', severity: 'HIGH' },
]

export default function GoogleDisasterMap({ shelterMarkers, disasterZones, evacuationRoutes, apiKey }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [customKey, setCustomKey] = useState<string>('')
  const [savedKey, setSavedKey] = useState<string>('')
  const [selectedIncident, setSelectedIncident] = useState(PRESET_LOCATIONS[1])
  const [mapType, setMapType] = useState<'satellite' | 'roadmap' | 'terrain' | 'hybrid'>('terrain')
  const [showKeyInput, setShowKeyInput] = useState(false)

  // Retrieve saved key from localStorage or env
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rescue_google_maps_key') || ''
      if (stored) {
        setSavedKey(stored)
        setCustomKey(stored)
      }
    }
  }, [])

  const effectiveKey = apiKey || savedKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rescue_google_maps_key', customKey.trim())
      setSavedKey(customKey.trim())
      setLoadError(null)
      setShowKeyInput(false)
      // Force reload script if key provided
      if (customKey.trim()) {
        const existingScript = document.getElementById('google-maps-script-rescue-ai')
        if (existingScript) existingScript.remove()
        setScriptLoaded(false)
      }
    }
  }

  // Load Google Maps API Script dynamically if key is available
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!effectiveKey) {
      setScriptLoaded(false)
      return
    }

    if (window.google?.maps) {
      setScriptLoaded(true)
      return
    }

    const scriptId = 'google-maps-script-rescue-ai'
    if (document.getElementById(scriptId)) {
      setScriptLoaded(true)
      return
    }

    window.initRescueAiGoogleMap = () => {
      setScriptLoaded(true)
      setLoadError(null)
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${effectiveKey}&callback=initRescueAiGoogleMap&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onerror = () => {
      setLoadError('Failed to authenticate Google Maps API key. Showing interactive Google Maps embed view.')
    }
    document.head.appendChild(script)

    return () => {}
  }, [effectiveKey])

  // Initialize interactive Google Maps JS Instance
  useEffect(() => {
    if (!scriptLoaded || !mapContainerRef.current || !window.google?.maps) return

    try {
      const google = window.google
      const center = { lat: selectedIncident.lat, lng: selectedIncident.lng }

      const map = new google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 11,
        mapTypeId: mapType,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      })
      mapInstanceRef.current = map

      const infoWindow = new google.maps.InfoWindow()

      // 1. Draw Disaster Zones
      const zones = (disasterZones && disasterZones.length > 0) ? disasterZones : PRESET_LOCATIONS.map(p => ({
        lat: p.lat,
        lng: p.lng,
        radius_km: 25,
        color: p.severity === 'CRITICAL' ? 'red' : 'orange',
        data: {
          name: p.name,
          disaster_type: p.type,
          risk_level: p.severity.toLowerCase(),
          affected_population: 25000,
          description: `Active ${p.type} zone monitored by NDMA / State Disaster Authority.`
        }
      }))

      zones.forEach(z => {
        const color = z.color === 'red' ? '#EF4444' : z.color === 'orange' ? '#F97316' : '#F59E0B'
        const circle = new google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.9,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.22,
          map,
          center: { lat: z.lat, lng: z.lng },
          radius: (z.radius_km || 20) * 1000
        })

        circle.addListener('click', (ev: any) => {
          const d = z.data || {}
          infoWindow.setContent(`
            <div style="font-family:Inter,sans-serif;padding:8px;max-width:270px;">
              <div style="color:#dc2626;font-weight:bold;font-size:13px;margin-bottom:4px;">⚠️ ${d.name || 'Disaster Incident'}</div>
              <div style="font-size:11px;color:#334155;line-height:1.5;">
                <div>Hazard: <b>${(d.disaster_type || 'Disaster').toUpperCase()}</b></div>
                <div>Severity: <b style="color:${color}">${(d.risk_level || 'CRITICAL').toUpperCase()}</b></div>
                <div>Estimated Affected: <b>${(d.affected_population || 10000).toLocaleString()} evacuees</b></div>
                <p style="margin-top:6px;color:#64748b;font-size:10px;">${d.description || ''}</p>
              </div>
            </div>
          `)
          infoWindow.setPosition(ev.latLng)
          infoWindow.open(map)
        })
      })

      // 2. Draw Shelter Markers
      if (shelterMarkers && shelterMarkers.length > 0) {
        shelterMarkers.forEach(s => {
          const isDamaged = s.data?.status === 'damaged' || s.data?.status === 'closed'
          const markerColor = isDamaged ? '#94A3B8' : s.color === 'green' ? '#10B981' : s.color === 'orange' ? '#F97316' : '#EF4444'

          const marker = new google.maps.Marker({
            position: { lat: s.lat, lng: s.lng },
            map,
            title: s.title || s.data?.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: markerColor,
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            }
          })

          marker.addListener('click', () => {
            const d = s.data || {}
            infoWindow.setContent(`
              <div style="font-family:Inter,sans-serif;padding:8px;max-width:260px;">
                <div style="font-weight:bold;font-size:13px;color:#0f172a;margin-bottom:4px;">🏠 ${d.name || s.title}</div>
                <div style="font-size:11px;color:#475569;line-height:1.5;">
                  <div>ID: <b>${d.shelter_id || s.id}</b></div>
                  <div>Capacity: <b>${d.occupancy || 0} / ${d.capacity || 1000}</b> (${d.available || 500} available)</div>
                  <div>Medical Facility: <b>${d.has_medical ? '✅ Yes' : '❌ Basic'}</b></div>
                  <div>Risk Score: <b>${d.risk_score || 0.05}</b></div>
                  <div>Status: <span style="font-weight:bold;color:${markerColor}">${(d.status || 'OPERATIONAL').toUpperCase()}</span></div>
                </div>
              </div>
            `)
            infoWindow.open(map, marker)
          })
        })
      }

      // 3. Draw Evacuation Routes
      if (evacuationRoutes && evacuationRoutes.length > 0) {
        evacuationRoutes.forEach(r => {
          if (!r.points) return
          const poly = new google.maps.Polyline({
            path: r.points.map((p: any) => ({ lat: p.lat, lng: p.lng })),
            geodesic: true,
            strokeColor: r.color || '#3B82F6',
            strokeOpacity: 0.85,
            strokeWeight: 4,
            map
          })

          poly.addListener('click', (ev: any) => {
            infoWindow.setContent(`
              <div style="font-family:Inter,sans-serif;font-size:12px;padding:4px;">
                <b>Evacuation Corridor:</b> ${r.name || 'Emergency Route'}
              </div>
            `)
            infoWindow.setPosition(ev.latLng)
            infoWindow.open(map)
          })
        })
      }

    } catch (e) {
      console.error('Google Maps init error', e)
    }
  }, [scriptLoaded, shelterMarkers, disasterZones, evacuationRoutes, selectedIncident, mapType])

  // Google Maps Embed URL when interactive JS API key is not yet configured or on error
  const gmapEmbedUrl = `https://www.google.com/maps?q=${selectedIncident.lat},${selectedIncident.lng}&z=11&t=${mapType === 'satellite' ? 'k' : mapType === 'terrain' ? 'p' : 'm'}&output=embed`

  return (
    <div className="relative w-full h-full min-h-[560px] flex flex-col bg-slate-900 overflow-hidden">
      
      {/* ── TOP GOOGLE MAPS CONTROLS BAR ── */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-10">
        
        {/* Left: Provider & Incident Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-xs font-bold tracking-wide flex items-center gap-1.5">
              <span>Google Maps API Engine</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono">
                {scriptLoaded ? 'LIVE WEBGL JS SDK' : 'INTERACTIVE EMBED VIEW'}
              </span>
            </span>
          </div>

          {/* Quick Disaster Focus Dropdown */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-0.5">
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                onClick={() => {
                  setSelectedIncident(loc)
                  if (mapInstanceRef.current && window.google?.maps) {
                    mapInstanceRef.current.panTo({ lat: loc.lat, lng: loc.lng })
                    mapInstanceRef.current.setZoom(11)
                  }
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition ${
                  selectedIncident.name === loc.name
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {loc.type === 'cyclone' ? '🌀' : loc.type === 'flood' ? '🌊' : loc.type === 'landslide' ? '⛰️' : '🏚️'} {loc.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Map Layers & API Key controls */}
        <div className="flex items-center gap-2">
          
          {/* Map Layer Toggle */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
            {(['terrain', 'satellite', 'roadmap'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setMapType(t)
                  if (mapInstanceRef.current) mapInstanceRef.current.setMapTypeId(t)
                }}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                  mapType === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* API Key Modal / Popover Toggle */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              savedKey
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{savedKey ? 'API Key Active' : 'Enter API Key'}</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${selectedIncident.lat},${selectedIncident.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition"
            title="Open in Google Maps external app"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── OPTIONAL API KEY DROPDOWN BANNER ── */}
      {showKeyInput && (
        <div className="bg-slate-800/95 border-b border-slate-700 p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>
              Enter your <b>Google Cloud Maps JavaScript API Key</b> for live markers &amp; 3D terrain:
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveKey}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition"
            >
              Save &amp; Load
            </button>
          </div>
        </div>
      )}

      {/* ── MAP CONTAINER ── */}
      <div className="flex-1 relative w-full h-full">
        
        {scriptLoaded ? (
          // Full Live Google Maps SDK View
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          // High-Res Interactive Google Maps Satellite / Terrain Embed
          <div className="relative w-full h-full min-h-[500px]">
            <iframe
              title="Google Maps Disaster Operations Center"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={gmapEmbedUrl}
              className="w-full h-full min-h-[500px] border-0"
            />

            {/* Tactical Incident Overlay Pill */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl max-w-sm pointer-events-none">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{selectedIncident.type === 'cyclone' ? '🌀' : selectedIncident.type === 'flood' ? '🌊' : '⛰️'}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedIncident.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    GPS: {selectedIncident.lat.toFixed(4)}°N, {selectedIncident.lng.toFixed(4)}°E
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-md">
                  {selectedIncident.severity} HAZARD
                </span>
                <span className="text-[10px] text-slate-300">
                  Google Maps Terrain Centroid
                </span>
              </div>
            </div>

            {/* Quick Action Overlay (Bottom Right) */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-xl flex items-center gap-2 text-xs">
              <span className="text-slate-300 text-[11px]">Looking at live hazard zone?</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedIncident.lat},${selectedIncident.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 transition shadow-sm"
              >
                <span>Google Maps Full View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
