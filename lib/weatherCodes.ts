export type WeatherCodeTone = 'clear' | 'partly-cloudy' | 'overcast' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm'

export type WeatherCodeInfo = {
  code: number
  emoji: string
  label: string
  tone: WeatherCodeTone
}

export const WEATHER_CODES: readonly WeatherCodeInfo[] = [
  { code: 0, emoji: '☀️', label: 'Clear', tone: 'clear' },
  { code: 1, emoji: '🌤️', label: 'Mostly clear', tone: 'partly-cloudy' },
  { code: 2, emoji: '⛅', label: 'Partly cloudy', tone: 'partly-cloudy' },
  { code: 3, emoji: '☁️', label: 'Overcast', tone: 'overcast' },
  { code: 45, emoji: '🌫️', label: 'Fog possible', tone: 'fog' },
  { code: 48, emoji: '🌫️', label: 'Fog possible', tone: 'fog' },
  { code: 51, emoji: '🌦️', label: 'Light drizzle', tone: 'drizzle' },
  { code: 53, emoji: '🌦️', label: 'Drizzle', tone: 'drizzle' },
  { code: 55, emoji: '🌦️', label: 'Drizzle', tone: 'drizzle' },
  { code: 56, emoji: '🌧️', label: 'Icy drizzle', tone: 'drizzle' },
  { code: 57, emoji: '🌧️', label: 'Icy drizzle', tone: 'drizzle' },
  { code: 61, emoji: '🌧️', label: 'Light rain', tone: 'rain' },
  { code: 63, emoji: '🌧️', label: 'Rain', tone: 'rain' },
  { code: 65, emoji: '🌧️', label: 'Heavy rain', tone: 'rain' },
  { code: 66, emoji: '🌧️', label: 'Icy rain', tone: 'rain' },
  { code: 67, emoji: '🌧️', label: 'Icy rain', tone: 'rain' },
  { code: 71, emoji: '🌨️', label: 'Snow possible', tone: 'snow' },
  { code: 73, emoji: '🌨️', label: 'Snow', tone: 'snow' },
  { code: 75, emoji: '❄️', label: 'Heavy snow', tone: 'snow' },
  { code: 77, emoji: '❄️', label: 'Snow grains', tone: 'snow' },
  { code: 80, emoji: '🌦️', label: 'Showers', tone: 'rain' },
  { code: 81, emoji: '🌧️', label: 'Showers', tone: 'rain' },
  { code: 82, emoji: '🌧️', label: 'Violent showers', tone: 'rain' },
  { code: 85, emoji: '🌨️', label: 'Snow showers', tone: 'snow' },
  { code: 86, emoji: '🌨️', label: 'Snow showers', tone: 'snow' },
  { code: 95, emoji: '⛈️', label: 'Thunderstorm risk', tone: 'storm' },
  { code: 96, emoji: '⛈️', label: 'Storm w/ hail risk', tone: 'storm' },
  { code: 99, emoji: '⛈️', label: 'Storm w/ hail risk', tone: 'storm' },
]

const WEATHER_CODE_BY_CODE = new Map(WEATHER_CODES.map((entry) => [entry.code, entry]))

const WEATHER_CODE_NOTES: Record<WeatherCodeTone, string> = {
  clear: 'Clear conditions are most likely.',
  'partly-cloudy': 'Mostly clear to partly cloudy conditions are likely.',
  overcast: 'Cloud cover is likely for much of the day.',
  fog: 'Low cloud or fog is possible.',
  drizzle: 'Light rain or drizzle is possible.',
  rain: 'Rain is possible, so keep the shell handy.',
  snow: 'Cold conditions or even snow are possible at elevation.',
  storm: 'Storm risk is present; watch the alpine forecast closely.',
}

export function getWeatherCode(code?: number | null): WeatherCodeInfo | undefined {
  if (code == null) return undefined
  return WEATHER_CODE_BY_CODE.get(code)
}

export function describeWeatherCode(code?: number | null): string | undefined {
  const entry = getWeatherCode(code)
  return entry ? WEATHER_CODE_NOTES[entry.tone] : undefined
}

export function isRainWeatherCode(code?: number | null): boolean {
  const tone = getWeatherCode(code)?.tone
  return tone === 'drizzle' || tone === 'rain'
}

export function isSnowOrStormWeatherCode(code?: number | null): boolean {
  const tone = getWeatherCode(code)?.tone
  return tone === 'snow' || tone === 'storm'
}
