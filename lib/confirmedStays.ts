/**
 * lib/confirmedStays.ts — re-export shim
 * Source of truth is lib/data/stays.ts
 */
export type { StayWindow } from './data/stays'
export type { Stay as ConfirmedStay } from './data/stays'
export { CONFIRMED_STAYS, CONFIRMED_STAY_BY_ID } from './data/stays'
