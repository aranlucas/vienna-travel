const KM_TO_MILES = 0.621371
const M_TO_FEET = 3.28084

function trimTrailingZero(value: string): string {
  return value.replace(/\.0$/, '')
}

export function toMiles(km: number): number {
  return km * KM_TO_MILES
}

export function toFeet(meters: number): number {
  return meters * M_TO_FEET
}

export function formatMiles(km: number, fractionDigits = 1): string {
  return `${trimTrailingZero(toMiles(km).toFixed(fractionDigits))} mi`
}

export function formatFeet(meters: number): string {
  return `${Math.round(toFeet(meters)).toLocaleString()} ft`
}
