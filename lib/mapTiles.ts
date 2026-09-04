// CARTO Voyager — muted, high-legibility basemap (free, no API key).
// Replaces stock OSM standard, whose saturated colors fought the neon route
// overlays. Consumed by both HeroMap and PhaseMap.
const CARTO_VOYAGER_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'

export const MAP_TILE_URL = CARTO_VOYAGER_TILE_URL
export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
