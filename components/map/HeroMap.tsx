'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { FLIGHT, PHASES } from '@/lib/tripData'
import { CONFIRMED_STAYS } from '@/lib/confirmedStays'
import type { LatLng } from '@/lib/routingService'
import { DRIVE_WAYPOINTS, HERO_TRAIN_SEGMENTS } from '@/lib/heroRouteData'
import { buildGoogleMapsUrl } from '@/lib/mapLinks'
import { PolylineWithArrows } from './PolylineWithArrows'
import { MapInvalidator } from './MapInvalidator'

export interface HeroMapProps {
  driveCoords: LatLng[]
  trainRoutes: Record<string, LatLng[]>
  onPhaseClick?: (phaseId: string) => void
}

function createPhaseIcon(number: number, compact: boolean) {
  const size = compact ? 26 : 32
  const fontSize = compact ? 12 : 14
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;background:#d4a853;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-family:Georgia,serif;font-weight:bold;font-size:${fontSize}px;color:#0f1a0f;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);border:2px solid #f5f0e8;
    ">${number}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  })
}

function createLabelIcon(label: string, tone: 'flight' | 'stay') {
  const palette =
    tone === 'flight'
      ? {
          bg: '#c0626a',
          border: '#f5d0d4',
          text: '#fff7f7',
        }
      : {
          bg: '#1d4d3d',
          border: '#d8e9df',
          text: '#f4f1ea',
        }

  const width = Math.max(88, Math.min(148, label.length * 7 + 28))

  return L.divIcon({
    className: '',
    html: `<div style="
      padding:6px 10px;border-radius:999px;background:${palette.bg};
      color:${palette.text};border:1px solid ${palette.border};
      font-family:Georgia,serif;font-size:11px;font-weight:bold;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);white-space:nowrap;
    ">${label}</div>`,
    iconSize: [width, 28],
    iconAnchor: [Math.round(width / 2), 14],
    popupAnchor: [0, -14],
  })
}

/**
 * Compact icon for crowded viewports. Same tap target size as the pill labels
 * but with only a glyph — the Popup still carries full details.
 */
function createCompactIcon(tone: 'flight' | 'stay') {
  const palette =
    tone === 'flight'
      ? { bg: '#c0626a', border: '#f5d0d4', glyph: '✈' }
      : { bg: '#1d4d3d', border: '#d8e9df', glyph: '●' }
  return L.divIcon({
    className: '',
    html: `<div style="
      width:22px;height:22px;background:${palette.bg};border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:12px;line-height:1;
      font-family:system-ui,sans-serif;
      border:2px solid ${palette.border};box-shadow:0 2px 6px rgba(0,0,0,0.45);
    ">${palette.glyph}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  })
}

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

// Vienna included in bounds even though it's not part of the drive
const ALL_BOUND_POINTS: LatLng[] = [[48.2085, 16.3731], ...DRIVE_WAYPOINTS]

function useIsMobile(breakpoint = 640): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export default function HeroMap({ driveCoords, trainRoutes, onPhaseClick }: HeroMapProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: '/leaflet/marker-icon.png',
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    })
  }, [])

  const isMobile = useIsMobile()
  const bounds = L.latLngBounds(ALL_BOUND_POINTS)
  const boundsPadding: [number, number] = isMobile ? [20, 20] : [40, 40]

  const stayIcon = isMobile ? createCompactIcon('stay') : null
  const flightIcon = isMobile ? createCompactIcon('flight') : createLabelIcon('Flight · VIE', 'flight')

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: boundsPadding }}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
        <MapInvalidator />

        {/* Driving route — pre-fetched OSRM, neon orange with direction arrows */}
        <PolylineWithArrows
          positions={driveCoords}
          color="#fb923c"
          weight={3}
          opacity={0.9}
          arrows={{ size: '10px', frequency: '120px', fill: true, yawn: 50 }}
        />

        {/* Train routes — pre-baked Overpass OSM geometry, neon cyan.
            Dashed pattern reads as "rail" against the solid orange drive line. */}
        {HERO_TRAIN_SEGMENTS.map((seg) => {
          const route = trainRoutes[seg.id]
          const positions: LatLng[] = route?.length
            ? route
            : seg.waypoints.map((c) => [c.lat, c.lng])
          return (
            <PolylineWithArrows
              key={seg.id}
              positions={positions}
              color="#22d3ee"
              weight={3}
              opacity={0.9}
              dashArray="6 6"
              arrows={{ size: '9px', frequency: '120px', fill: true, yawn: 50 }}
            />
          )
        })}

        {PHASES.map((phase) => (
          <Marker
            key={phase.id}
            position={[phase.mapCenter.lat, phase.mapCenter.lng]}
            icon={createPhaseIcon(phase.number, isMobile)}
            eventHandlers={{ click: () => onPhaseClick?.(phase.id) }}
          >
            <Popup>
              <div style={{ fontFamily: 'Georgia, serif', minWidth: '160px' }}>
                <div style={{ color: '#d4a853', fontWeight: 'bold', fontSize: '13px' }}>
                  Phase {phase.number}
                </div>
                <div style={{ color: '#222', fontSize: '15px', fontWeight: 'bold' }}>
                  {phase.title}
                </div>
                <div style={{ color: '#666', fontSize: '11px' }}>{phase.dates}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {CONFIRMED_STAYS.map((stay) => (
          <Marker
            key={stay.id}
            position={[stay.coordinates.lat, stay.coordinates.lng]}
            icon={stayIcon ?? createLabelIcon(stay.shortLabel, 'stay')}
          >
            <Popup>
              <div style={{ fontFamily: 'Georgia, serif', minWidth: '220px' }}>
                <div style={{ color: '#1d4d3d', fontWeight: 'bold', fontSize: '13px' }}>
                  Confirmed Stay
                </div>
                <div style={{ color: '#222', fontSize: '15px', fontWeight: 'bold' }}>
                  {stay.propertyName}
                </div>
                <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>{stay.address}</div>
                <div style={{ color: '#666', fontSize: '12px', marginTop: '6px' }}>
                  In: {stay.checkIn.label} · {stay.checkIn.window}
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>
                  Out: {stay.checkOut.label} · {stay.checkOut.window}
                </div>
                <a
                  href={buildGoogleMapsUrl(stay.propertyName, stay.coordinates)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#1d4d3d', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}
                >
                  Open in Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        <Marker
          position={[48.1103, 16.5697]}
          icon={flightIcon}
        >
          <Popup>
            <div style={{ fontFamily: 'Georgia, serif', minWidth: '220px' }}>
              <div style={{ color: '#c0626a', fontWeight: 'bold', fontSize: '13px' }}>
                Flight
              </div>
              <div style={{ color: '#222', fontSize: '15px', fontWeight: 'bold' }}>
                {FLIGHT.departure.airport} → {FLIGHT.arrival.airport}
              </div>
              <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                {FLIGHT.flightNumbers.join(' + ')} via {FLIGHT.layover}
              </div>
              <div style={{ color: '#666', fontSize: '12px', marginTop: '6px' }}>
                Arrive: {FLIGHT.arrival.datetime}
              </div>
              <a
                href={buildGoogleMapsUrl('Vienna Airport', { lat: 48.1103, lng: 16.5697 })}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#c0626a', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}
              >
                Open in Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Legend — compacts on mobile to reclaim screen real estate */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '24px' : '32px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(15,26,15,0.88)',
        border: '1px solid rgba(212,168,83,0.2)',
        borderRadius: '6px',
        padding: isMobile ? '6px 8px' : '8px 12px',
        fontSize: isMobile ? '10px' : '11px',
        fontFamily: 'Georgia, serif',
        color: '#c8c0b0',
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '3px' : '5px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="4" viewBox="0 0 24 4">
            <line x1="0" y1="2" x2="24" y2="2" stroke="#fb923c" strokeWidth="2.5" />
          </svg>
          <span>Driving</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="4" viewBox="0 0 24 4">
            <line x1="0" y1="2" x2="24" y2="2" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="4 3" />
          </svg>
          <span>Train (ÖBB)</span>
        </div>
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a8576', fontSize: '9px', marginTop: '2px' }}>
            <span>Tap markers for details</span>
          </div>
        )}
      </div>
    </div>
  )
}
