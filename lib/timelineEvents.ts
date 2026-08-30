import { PHASES } from '@/lib/tripData'
import { STAYS } from '@/lib/data/stays'
import { FLIGHT_SEGMENTS, LAYOVERS, DRIVING_SEGMENTS } from '@/lib/data/transport'

export type TimelineEventType =
  | 'flight'
  | 'layover'
  | 'hotel-checkin'
  | 'hotel-checkout'
  | 'train'
  | 'drive'
  | 'activity'
  | 'hike'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  /** ISO date string for grouping, e.g. '2026-09-04' */
  date: string
  /** Display label for the date group, e.g. 'Friday, Sep 04' */
  dateLabel: string
  /** Sort key within a day — minutes from midnight (approximate) */
  sortTime: number
  /** Primary line, e.g. 'SEA – MUC' */
  title: string
  /** Secondary details */
  details: string[]
  /** Optional subtitle shown below title */
  subtitle?: string
  /** Optional location/address */
  location?: string
  /** Phase id for accent color */
  phaseId?: string
}

/** Parses "3:30 PM", "6:45 AM", "14:56", or "2:56 PM" into minutes from midnight. */
function timeToMinutes(timeStr: string): number {
  const match12 = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (match12) {
    let hours = parseInt(match12[1], 10)
    const minutes = parseInt(match12[2], 10)
    const ampm = match12[3].toUpperCase()
    if (ampm === 'PM' && hours !== 12) hours += 12
    if (ampm === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
  }
  const match24 = timeStr.match(/(\d{1,2}):(\d{2})/)
  if (match24) {
    return parseInt(match24[1], 10) * 60 + parseInt(match24[2], 10)
  }
  return 0
}

/** Extract the first time token from a window string like "3:00 PM - 6:00 PM". */
function parseTimeFromWindow(window: string): string {
  const match = window.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i)
  return match ? match[0] : '3:00 PM'
}

export function buildTimelineEvents(): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // ── Pre-scan: collect segment IDs claimed by activities ───────────────────
  // A claimed segment is suppressed in its own loop; the activity generates the
  // consolidated event instead (activity title + segment metadata).
  const claimedSegmentIds = new Set<string>()
  for (const phase of PHASES) {
    for (const day of phase.days) {
      for (const activity of day.activities) {
        if (activity.segmentId) claimedSegmentIds.add(activity.segmentId)
      }
    }
  }

  // Lookup maps for enrichment in the activity loop
  const driveById = new Map(DRIVING_SEGMENTS.map((s) => [s.id, s]))
  const flightById = new Map(FLIGHT_SEGMENTS.map((s) => [s.id, s]))

  // ── Flights — skip segments claimed by an activity ────────────────────────
  for (const flight of FLIGHT_SEGMENTS) {
    if (claimedSegmentIds.has(flight.id)) continue
    events.push({
      id: `flight-${flight.id}`,
      type: 'flight',
      date: flight.date,
      dateLabel: formatDateLabel(flight.date),
      sortTime: timeToMinutes(flight.departureTime),
      title: `${flight.from} \u2013 ${flight.to}`,
      subtitle: `${flight.flightNumber} (${flight.airline})`,
      details: flight.notes ?? [],
      phaseId: flight.phaseId,
    })
  }

  // ── Layovers ──────────────────────────────────────────────────────────────
  for (const layover of LAYOVERS) {
    const hours = Math.floor(layover.durationMinutes / 60)
    const mins = layover.durationMinutes % 60
    const duration = mins > 0 ? `${hours}h${mins}m` : `${hours}h`
    events.push({
      id: layover.id,
      type: 'layover',
      date: layover.date,
      dateLabel: formatDateLabel(layover.date),
      sortTime: timeToMinutes(layover.time),
      title: `${duration} layover in ${layover.city}`,
      details: [`Airport: ${layover.airport}`],
      phaseId: layover.phaseId,
    })
  }

  // ── Hotel check-ins / check-outs — all STAYS (confirmed + unconfirmed) ────
  // Vienna check-in is overridden: flight lands 4:35 PM so realistic arrival is ~5 PM.
  const CHECKIN_TIME_OVERRIDES: Record<string, number> = {
    vienna: timeToMinutes('5:00 PM'),
  }

  for (const stay of STAYS) {
    const checkinTime = CHECKIN_TIME_OVERRIDES[stay.id] ?? timeToMinutes(parseTimeFromWindow(stay.checkIn.window))

    events.push({
      id: `checkin-${stay.id}`,
      type: 'hotel-checkin',
      date: stay.checkIn.isoDate,
      dateLabel: formatDateLabel(stay.checkIn.isoDate),
      sortTime: checkinTime,
      title: stay.propertyName,
      subtitle: `${stay.checkIn.window} CEST`,
      details: stay.checkInDetails ?? [],
      location: stay.address,
      phaseId: stay.phaseId,
    })

    events.push({
      id: `checkout-${stay.id}`,
      type: 'hotel-checkout',
      date: stay.checkOut.isoDate,
      dateLabel: formatDateLabel(stay.checkOut.isoDate),
      sortTime: timeToMinutes(parseTimeFromWindow(stay.checkOut.window)),
      title: stay.propertyName,
      subtitle: `${stay.checkOut.window} CEST`,
      details: [],
      location: stay.address,
      phaseId: stay.phaseId,
    })
  }

  // ── Train segments ────────────────────────────────────────────────────────
  for (const phase of PHASES) {
    if (!phase.trainSegments) continue
    for (const train of phase.trainSegments) {
      events.push({
        id: `train-${train.id}`,
        type: 'train',
        date: train.isoDate,
        dateLabel: formatDateLabel(train.isoDate),
        sortTime: train.departureTime ? timeToMinutes(train.departureTime) : timeToMinutes('12:00 PM'),
        title: `${train.from} \u2013 ${train.to}`,
        subtitle: train.operator,
        details: [
          ...(train.departureTime ? [`Departs: ${train.departureTime}`] : []),
          ...(train.arrivalTime ? [`Arrives: ${train.arrivalTime}`] : []),
          ...(train.notes ? [train.notes] : []),
        ],
        phaseId: phase.id,
      })
    }
  }

  // ── Driving segments — skip segments claimed by an activity ──────────────
  for (const phase of PHASES) {
    for (const drive of phase.drivingSegments) {
      if (claimedSegmentIds.has(drive.id)) continue
      // Extract a time hint from notes if present (e.g. "Depart 8:00 AM")
      const notesTime = drive.notes ? drive.notes.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)|\d{2}:\d{2})/i) : null
      const sortTime = notesTime ? timeToMinutes(notesTime[0]) : timeToMinutes('10:00 AM')

      events.push({
        id: `drive-${drive.id}`,
        type: 'drive',
        date: drive.isoDate,
        dateLabel: formatDateLabel(drive.isoDate),
        sortTime,
        title: `${drive.from} \u2013 ${drive.to}`,
        subtitle: `${Math.round(drive.durationHours * 60)}min drive`,
        details: [
          ...(drive.scenic ? ['Scenic route'] : []),
          ...(drive.toll ? [`Toll: ${drive.toll.description} (~\u20AC${drive.toll.amountEur})`] : []),
          ...(drive.notes ? [drive.notes] : []),
        ],
        phaseId: phase.id,
      })
    }
  }

  // ── Daily activities ──────────────────────────────────────────────────────
  // Activities with a segmentId consolidate: activity title + segment metadata.
  // Activities without segmentId generate a plain event (no duplicate risk).
  for (const phase of PHASES) {
    for (const day of phase.days) {
      for (let i = 0; i < day.activities.length; i++) {
        const activity = day.activities[i]
        if (!activity.time) continue

        if (activity.segmentId) {
          // ── Consolidated drive event ──────────────────────────────────────
          const drive = driveById.get(activity.segmentId)
          if (drive) {
            events.push({
              id: `drive-${drive.id}`,
              type: 'drive',
              date: day.isoDate,
              dateLabel: formatDateLabel(day.isoDate),
              sortTime: timeToMinutes(activity.time),
              title: activity.title,
              subtitle: `${Math.round(drive.durationHours * 60)}min drive`,
              details: [
                ...(drive.scenic ? ['Scenic route'] : []),
                ...(drive.toll ? [`Toll: ${drive.toll.description} (~\u20AC${drive.toll.amountEur})`] : []),
                ...(drive.notes ? [drive.notes] : []),
              ],
              phaseId: phase.id,
            })
            continue
          }
          // ── Consolidated flight event ─────────────────────────────────────
          const flight = flightById.get(activity.segmentId)
          if (flight) {
            events.push({
              id: `flight-${flight.id}`,
              type: 'flight',
              date: day.isoDate,
              dateLabel: formatDateLabel(day.isoDate),
              sortTime: timeToMinutes(activity.time),
              title: activity.title,
              subtitle: `${flight.flightNumber} (${flight.airline})`,
              details: flight.notes ?? [],
              phaseId: phase.id,
            })
            continue
          }
        }

        // ── Plain activity event ──────────────────────────────────────────
        events.push({
          id: `activity-${phase.id}-${day.isoDate}-${i}`,
          type: activity.type ?? 'activity',
          date: day.isoDate,
          dateLabel: formatDateLabel(day.isoDate),
          sortTime: timeToMinutes(activity.time),
          title: activity.title,
          details: [],
          phaseId: phase.id,
        })
      }
    }
  }

  // ── Sort: by date, then by time within each day ───────────────────────────
  events.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.sortTime - b.sortTime
  })

  return events
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate + 'T12:00:00')
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, '0')}`
}
