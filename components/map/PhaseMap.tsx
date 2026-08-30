'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Phase } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { buildGoogleMapsUrl } from '@/lib/mapLinks'
import { formatFeet, formatMiles } from '@/lib/units'
import { PolylineWithArrows } from './PolylineWithArrows'
import { MapInvalidator } from './MapInvalidator'

export interface PhaseMapProps {
  phase: Phase
  height?: string
  /** Pre-fetched OSRM routes keyed by DrivingSegment.id */
  drivingRoutes: Record<string, LatLng[]>
  /** Pre-fetched GPX/hiking routes keyed by Hike.id */
  hikingRoutes: Record<string, LatLng[]>
}

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

const POI_COLORS: Record<string, string> = {
  culture: '#8b9ed4',
  food: '#d4a853',
  nature: '#4a7c59',
  hotel: '#c9856a',
  transport: '#8e8e8e',
}

function createPoiIcon(type = 'nature') {
  const color = POI_COLORS[type] ?? '#d4a853'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:12px;height:12px;background:${color};border-radius:50%;
      border:2px solid #f5f0e8;box-shadow:0 1px 4px rgba(0,0,0,0.6);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  })
}

function createHikeIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;background:#4a7c59;border-radius:50%;
      border:2px solid #d4a853;box-shadow:0 1px 4px rgba(0,0,0,0.6);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -9],
  })
}

// High-contrast neon day-route colors — distinct from each other and from the
// neon-orange driving lines / green hiking trails on dark tiles.
const DAY_ROUTE_COLORS = ['#22d3ee', '#f472b6', '#a3e635', '#c084fc']

// Driving lines share this color on both HeroMap and PhaseMap.
const DRIVING_COLOR = '#fb923c'

export default function PhaseMap({ phase, height = '400px', drivingRoutes, hikingRoutes }: PhaseMapProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: '/leaflet/marker-icon.png',
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    })
  }, [])

  const center: [number, number] = [phase.mapCenter.lat, phase.mapCenter.lng]

  const hasDriving = phase.drivingSegments.some((s) => s.waypoints && s.waypoints.length >= 2)
  const hasHiking = phase.hikes.length > 0
  const hasDayRoutes = (phase.dayRoutes?.length ?? 0) > 0
  const showLegend = hasDriving || hasHiking || hasDayRoutes

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <MapContainer
        center={center}
        zoom={phase.mapZoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
        <MapInvalidator />

        {/* Per-segment OSRM driving routes */}
        {phase.drivingSegments.map((seg) => {
          const route = drivingRoutes[seg.id]
          if (!route?.length) return null
          return (
            <PolylineWithArrows
              key={seg.id}
              positions={route}
              color={DRIVING_COLOR}
              weight={3}
              opacity={0.7}
              dashArray="8 5"
              arrows={{ size: '9px', frequency: '100px', fill: true, yawn: 50 }}
            />
          )
        })}

        {/* Day-specific walking overlays */}
        {phase.dayRoutes?.map((route, i) => (
          <PolylineWithArrows
            key={`day-route-${route.label}`}
            positions={route.coordinates.map((c) => [c.lat, c.lng] as LatLng)}
            color={DAY_ROUTE_COLORS[i % DAY_ROUTE_COLORS.length]}
            weight={3}
            opacity={0.8}
            dashArray={i % 2 === 0 ? undefined : '8 5'}
            arrows={{ size: '8px', frequency: '80px', fill: true, yawn: 50 }}
          />
        ))}

        {/* Train routes shown on HeroMap only */}

        {/* Pre-fetched hiking routes */}
        {phase.hikes.map((hike) => {
          const route = hikingRoutes[hike.id]
          if (!route?.length) return null
          return (
            <PolylineWithArrows
              key={hike.id}
              positions={route}
              color="#4a7c59"
              weight={4}
              opacity={0.85}
              arrows={{ size: '8px', frequency: '80px', fill: true, yawn: 50 }}
            />
          )
        })}

        {/* POI markers */}
        {phase.pois.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.coordinates.lat, poi.coordinates.lng]}
            icon={createPoiIcon(poi.icon)}
          >
            <Popup>
              <div style={{ fontFamily: 'Georgia, serif', maxWidth: '220px' }}>
                <div style={{ color: '#d4a853', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                  {poi.name}
                </div>
                <div style={{ color: '#444', fontSize: '12px', lineHeight: '1.4' }}>
                  {poi.description}
                </div>
                {poi.warning && (
                  <div style={{ color: '#c0392b', fontSize: '11px', marginTop: '4px', fontWeight: 'bold' }}>
                    ⚠️ {poi.warning}
                  </div>
                )}
                {poi.tip && (
                  <div style={{ color: '#27ae60', fontSize: '11px', marginTop: '4px' }}>
                    💡 {poi.tip}
                  </div>
                )}
                <a
                  href={buildGoogleMapsUrl(poi.name, poi.coordinates, poi.googleMapsUrl)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    color: '#2c7be5',
                    fontSize: '11px',
                    textDecoration: 'underline',
                  }}
                >
                  Open in Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Hike start markers */}
        {phase.hikes.map((hike) => (
          <Marker
            key={`${hike.id}-start`}
            position={[hike.start.lat, hike.start.lng]}
            icon={createHikeIcon()}
          >
            <Popup>
              <div style={{ fontFamily: 'Georgia, serif', maxWidth: '220px' }}>
                <div style={{ color: '#4a7c59', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                  🥾 {hike.name}
                </div>
                <div style={{ color: '#444', fontSize: '12px' }}>{hike.description}</div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#777' }}>
                  {formatMiles(hike.distanceKm)} · {formatFeet(hike.elevationGainM)} gain · {hike.difficulty}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend */}
      {showLegend && (
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(15,26,15,0.88)',
          border: '1px solid rgba(212,168,83,0.2)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '11px',
          fontFamily: 'Georgia, serif',
          color: '#c8c0b0',
          pointerEvents: 'none',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}>
          {hasDayRoutes && (
            phase.dayRoutes?.map((route, i) => (
              <div key={`day-route-legend-${route.label}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="24" height="4" viewBox="0 0 24 4">
                  <line
                    x1="0"
                    y1="2"
                    x2="24"
                    y2="2"
                    stroke={DAY_ROUTE_COLORS[i % DAY_ROUTE_COLORS.length]}
                    strokeWidth="2.5"
                    strokeDasharray={i % 2 === 0 ? undefined : '8 5'}
                  />
                </svg>
                <span>{route.label}</span>
              </div>
            ))
          )}
          {hasDriving && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="4" viewBox="0 0 24 4"><line x1="0" y1="2" x2="24" y2="2" stroke={DRIVING_COLOR} strokeWidth="2.5" strokeDasharray="8 5" /></svg>
              <span>Driving</span>
            </div>
          )}
          {hasHiking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="4" viewBox="0 0 24 4"><line x1="0" y1="2" x2="24" y2="2" stroke="#4a7c59" strokeWidth="3" /></svg>
              <span>Hiking</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
