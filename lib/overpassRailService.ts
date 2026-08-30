import type { Coordinates } from './tripData'
import { RAIL_SEGMENT_OVERRIDES } from './heroRouteData'

export type LatLng = [number, number]

const OVERPASS_URL = 'https://overpass.private.coffee/api/interpreter'
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

interface OverpassWay {
  type: 'way'
  id: number
  nodes: number[]
  geometry: OverpassNode[]
}

interface OverpassResponse {
  elements: Array<{
    type: string
    id: number
    nodes?: number[]
    geometry?: OverpassNode[]
    members?: OverpassRelationMember[]
  }>
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

type RailEdge = { nodeId: number; weight: number }
type HeapItem = { nodeId: number; distance: number }

class MinHeap {
  private items: HeapItem[] = []

  push(item: HeapItem): void {
    this.items.push(item)
    let index = this.items.length - 1
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.items[parent].distance <= item.distance) break
      this.items[index] = this.items[parent]
      index = parent
    }
    this.items[index] = item
  }

  pop(): HeapItem | undefined {
    const root = this.items[0]
    const tail = this.items.pop()
    if (!root || !tail || this.items.length === 0) return root

    let index = 0
    while (true) {
      const left = index * 2 + 1
      const right = left + 1
      if (left >= this.items.length) break
      const child = right < this.items.length && this.items[right].distance < this.items[left].distance
        ? right
        : left
      if (this.items[child].distance >= tail.distance) break
      this.items[index] = this.items[child]
      index = child
    }
    this.items[index] = tail
    return root
  }

  get size(): number {
    return this.items.length
  }
}

/** Find the shortest connected path through actual OSM rail nodes. */
function shortestRailPath(ways: OverpassWay[], from: Coordinates, to: Coordinates): LatLng[] {
  const nodeCoordinates = new Map<number, OverpassNode>()
  const graph = new Map<number, RailEdge[]>()

  const addEdge = (fromId: number, toId: number, weight: number) => {
    const edges = graph.get(fromId) ?? []
    edges.push({ nodeId: toId, weight })
    graph.set(fromId, edges)
  }

  for (const way of ways) {
    if (way.nodes.length !== way.geometry.length) continue
    way.nodes.forEach((nodeId, index) => nodeCoordinates.set(nodeId, way.geometry[index]))
    for (let i = 1; i < way.nodes.length; i++) {
      const previousId = way.nodes[i - 1]
      const currentId = way.nodes[i]
      const weight = dist(way.geometry[i - 1], way.geometry[i])
      addEdge(previousId, currentId, weight)
      addEdge(currentId, previousId, weight)
    }
  }

  // Route relations occasionally switch between parallel OSM ways without a
  // shared node at a station throat. Join only very close way endpoints so the
  // graph stays continuous without inventing long cross-country connectors.
  const endpoints = ways.flatMap((way) => {
    if (way.nodes.length === 0 || way.nodes.length !== way.geometry.length) return []
    return [way.nodes[0], way.nodes[way.nodes.length - 1]]
  })
  for (let i = 0; i < endpoints.length; i++) {
    const fromId = endpoints[i]
    const fromCoordinate = nodeCoordinates.get(fromId)
    if (!fromCoordinate) continue
    for (let j = i + 1; j < endpoints.length; j++) {
      const toId = endpoints[j]
      if (fromId === toId) continue
      const toCoordinate = nodeCoordinates.get(toId)
      if (!toCoordinate) continue
      const weight = dist(fromCoordinate, toCoordinate)
      if (weight > 0.005) continue
      addEdge(fromId, toId, weight)
      addEdge(toId, fromId, weight)
    }
  }
  if (nodeCoordinates.size === 0) return []

  const nearestNode = (target: Coordinates): number | undefined => {
    const targetNode = { lat: target.lat, lon: target.lng }
    let nearest: number | undefined
    let nearestDistance = Infinity
    for (const [nodeId, coordinate] of nodeCoordinates) {
      const distance = dist(targetNode, coordinate)
      if (distance < nearestDistance) {
        nearest = nodeId
        nearestDistance = distance
      }
    }
    return nearest
  }

  const startId = nearestNode(from)
  const endId = nearestNode(to)
  if (startId === undefined || endId === undefined) return []

  const distances = new Map<number, number>([[startId, 0]])
  const previous = new Map<number, number>()
  const queue = new MinHeap()
  queue.push({ nodeId: startId, distance: 0 })

  while (queue.size > 0) {
    const current = queue.pop()!
    if (current.distance !== distances.get(current.nodeId)) continue
    if (current.nodeId === endId) break

    for (const edge of graph.get(current.nodeId) ?? []) {
      const nextDistance = current.distance + edge.weight
      if (nextDistance >= (distances.get(edge.nodeId) ?? Infinity)) continue
      distances.set(edge.nodeId, nextDistance)
      previous.set(edge.nodeId, current.nodeId)
      queue.push({ nodeId: edge.nodeId, distance: nextDistance })
    }
  }
  if (!distances.has(endId)) return []

  const nodeIds = [endId]
  while (nodeIds[0] !== startId) {
    const prior = previous.get(nodeIds[0])
    if (prior === undefined) return []
    nodeIds.unshift(prior)
  }
  return nodeIds.map((nodeId) => {
    const coordinate = nodeCoordinates.get(nodeId)!
    return [coordinate.lat, coordinate.lon]
  })
}

/**
 * Fetch actual railway geometry from the Overpass API between two coordinates.
 * Queries for main-line railway ways in the bounding box and stitches them
 * into a single ordered polyline.
 */
export async function fetchRailRoute(
  from: Coordinates,
  to: Coordinates,
  relationId?: number
): Promise<LatLng[]> {
  const south = Math.min(from.lat, to.lat) - 0.06
  const north = Math.max(from.lat, to.lat) + 0.06
  const west = Math.min(from.lng, to.lng) - 0.06
  const east = Math.max(from.lng, to.lng) + 0.06

  const query = relationId
    ? `[out:json][timeout:60];rel(${relationId})->.route;way(r.route)(${south},${west},${north},${east});out geom;`
    : `[out:json][timeout:60];way["railway"="rail"]["usage"="main"][!"service"](${south},${west},${north},${east});out geom;`

  try {
    const res = await fetch(`${OVERPASS_URL}?data=${encodeURIComponent(query)}`, {
      headers: OVERPASS_HEADERS,
    })
    if (!res.ok) return []
    const data: OverpassResponse = await res.json()
    const ways = data.elements.filter(
      (el): el is OverpassWay =>
        el.type === 'way' &&
        Array.isArray(el.nodes) &&
        Array.isArray(el.geometry) &&
        el.geometry.length > 0
    )
    return shortestRailPath(ways, from, to)
  } catch {
    return []
  }
}

/**
 * Fetch rail geometry for a multi-segment journey (array of station waypoints).
 * Queries each adjacent pair of stations and concatenates the results.
 */
export async function fetchMultiSegmentRailRoute(
  waypoints: Coordinates[],
  relationId?: number
): Promise<LatLng[]> {
  if (waypoints.length < 2) return []

  const segments: LatLng[][] = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i]
    const to = waypoints[i + 1]
    const key = `${from.lat},${from.lng}->${to.lat},${to.lng}`
    const segment = RAIL_SEGMENT_OVERRIDES[key] ?? await fetchRailRoute(from, to, relationId)
    if (segment.length === 0) return []
    segments.push(segment)
  }

  // Concatenate segments, skipping the duplicate connection point between each pair
  const result: LatLng[] = []
  for (const seg of segments) {
    if (seg.length === 0) continue
    const startAt = result.length === 0 ? 0 : 1
    result.push(...seg.slice(startAt))
  }
  return result
}
