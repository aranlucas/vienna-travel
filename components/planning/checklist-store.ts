import { z } from "zod";
import type { DepartureChecklistItem } from "@/lib/data/logistics";

const STORAGE_KEY = "predeparture-checklist-v2";
const LEGACY_KEY = "predeparture-checklist-v1";
const STORAGE_EVENT = "predeparture-checklist-change";
const checkedSchema = z.record(z.string(), z.boolean());

// A store instance owns a session fallback when browser persistence is denied.
export function createChecklistStore() {
  let session: string | null = null;

  return {
    subscribe(this: void, onChange: () => void) {
      window.addEventListener("storage", onChange);
      window.addEventListener(STORAGE_EVENT, onChange);

      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(STORAGE_EVENT, onChange);
      };
    },
    getSnapshot(this: void) {
      if (session !== null) {
        return session;
      }

      try {
        return (
          window.localStorage.getItem(STORAGE_KEY) ??
          window.localStorage.getItem(LEGACY_KEY) ??
          "{}"
        );
      } catch {
        return "{}";
      }
    },
    getServerSnapshot: () => "{}",
    read(snapshot: string, items: DepartureChecklistItem[]): Record<string, boolean> {
      try {
        const checked = checkedSchema.parse(JSON.parse(snapshot));

        return Object.fromEntries(
          items.map(({ id, legacyIndex }) => [
            id,
            checked[id] ?? checked[String(legacyIndex)] ?? false,
          ]),
        );
      } catch {
        return {};
      }
    },
    write(checked: Record<string, boolean>) {
      const snapshot = JSON.stringify(checked);

      try {
        window.localStorage.setItem(STORAGE_KEY, snapshot);
        session = null;
      } catch {
        session = snapshot;
      }

      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
  };
}

export const checklistStore = createChecklistStore();
