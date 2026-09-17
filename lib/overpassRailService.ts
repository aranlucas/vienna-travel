import type { Coordinates } from './tripData'

export type LatLng = [number, number]

const OVERPASS_HEADERS = { 'User-Agent': 'vienna-travel-route-prefetch/1.0' }
const OSM_API_URL = 'https://api.openstreetmap.org/api/0.6'

interface OverpassNode {
  lat: number
  lon: number
}

interface OverpassRelationMember {
  type: string
  ref: number
  role: string
  geometry?: OverpassNode[]
}

interface OverpassRelation {
  type: 'relation'
  id: number
  members: OverpassRelationMember[]
}

interface OsmFullResponse {
  elements: Array<
    | { type: 'node'; id: number; lat: number; lon: number }
    | { type: 'way'; id: number; nodes: number[] }
    | { type: 'relation'; id: number; members: OverpassRelationMember[] }
  >
}

function dist(a: OverpassNode, b: OverpassNode): number {
  return Math.sqrt((a.lat - b.lat) ** 2 + (a.lon - b.lon) ** 2)
}

/**
 * Assemble an ordered polyline from a route relation's member ways.
 * Handles forward/backward roles and connectivity-based reversal.
 * Returns points oriented so the start is closest to `from`.
 */
function assembleRelationGeometry(relation: OverpassRelation, from: Coordinates): LatLng[] {
  const wayMembers = relation.members.filter(
    (m): m is OverpassRelationMember & { geometry: OverpassNode[] } =>
      m.type === 'way' && Array.isArray(m.geometry) && m.geometry.length > 0
  )
  if (wayMembers.length === 0) return []

  const fromNode: OverpassNode = { lat: from.lat, lon: from.lng }
  const firstGeom = wayMembers[0].geometry
  const lastGeom = wayMembers[wayMembers.length - 1].geometry
  const members =
    dist(fromNode, lastGeom[lastGeom.length - 1]) < dist(fromNode, firstGeom[0])
      ? [...wayMembers].reverse()
      : wayMembers

  const result: LatLng[] = []
  for (const member of members) {
    let geom = member.role === 'backward' ? [...member.geometry].reverse() : member.geometry
    if (result.length > 0) {
      const tail: OverpassNode = { lat: result[result.length - 1][0], lon: result[result.length - 1][1] }
      const dFwd = dist(tail, geom[0])
      const dRev = dist(tail, geom[geom.length - 1])
      if (dRev < dFwd && dFwd > 0.0005) geom = [...geom].reverse()
    }
    const startAt = result.length === 0 ? 0 : 1
    for (let i = startAt; i < geom.length; i++) result.push([geom[i].lat, geom[i].lon])
  }
  return result
}

/**
 * Trim an assembled polyline to the portion between `from` and `to` by finding
 * the closest points and slicing.
 */
function trimToSegment(pts: LatLng[], from: Coordinates, to: Coordinates): LatLng[] {
  if (pts.length === 0) return []
  const fromNode: OverpassNode = { lat: from.lat, lon: from.lng }
  const toNode: OverpassNode = { lat: to.lat, lon: to.lng }

  let startIdx = 0, startDist = Infinity, endIdx = pts.length - 1, endDist = Infinity
  for (let i = 0; i < pts.length; i++) {
    const p: OverpassNode = { lat: pts[i][0], lon: pts[i][1] }
    const df = dist(p, fromNode)
    const dt = dist(p, toNode)
    if (df < startDist) { startDist = df; startIdx = i }
    if (dt < endDist) { endDist = dt; endIdx = i }
  }

  if (startIdx > endIdx) return pts.slice(endIdx, startIdx + 1).reverse()
  return pts.slice(startIdx, endIdx + 1)
}

/**
 * Fetch the geometry of a specific OSM route relation by ID and trim to from→to.
 * Use this for known long-distance ÖBB routes where relation IDs are verified.
 */
export async function fetchRelationGeometry(
  relationId: number,
  from: Coordinates,
  to: Coordinates
): Promise<LatLng[]> {
  try {
    const res = await fetch(`${OSM_API_URL}/relation/${relationId}/full.json`, {
      headers: OVERPASS_HEADERS,
    })
    if (!res.ok) return []
    const data: OsmFullResponse = await res.json()
    const nodes = new Map<number, OverpassNode>()
    const ways = new Map<number, number[]>()
    for (const element of data.elements) {
      if (element.type === 'node') nodes.set(element.id, { lat: element.lat, lon: element.lon })
      if (element.type === 'way') ways.set(element.id, element.nodes)
    }

    const sourceRelation = data.elements.find(
      (element): element is Extract<OsmFullResponse['elements'][number], { type: 'relation' }> =>
        element.type === 'relation' && element.id === relationId
    )
    if (!sourceRelation) return []

    const relation: OverpassRelation = {
      type: 'relation',
      id: relationId,
      members: sourceRelation.members.map((member) => ({
        ...member,
        geometry: member.type === 'way'
          ? ways
            .get(member.ref)
            ?.map((nodeId) => nodes.get(nodeId))
            .filter((node): node is OverpassNode => Boolean(node))
          : undefined,
      })),
    }
    const assembled = assembleRelationGeometry(relation, from)
    return trimToSegment(assembled, from, to)
  } catch {
    return []
  }
}
