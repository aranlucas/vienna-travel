"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
// eslint-disable-next-line import/no-unassigned-import -- Load the Leaflet augmentation before using or declaring its API.
import "leaflet-arrowheads";

const DEFAULT_ARROWS: ArrowOptions = { size: "8px", frequency: "100px", fill: true, yawn: 50 };

export type ArrowOptions = Parameters<L.Polyline["arrowheads"]>[0];

interface PolylineWithArrowsProps {
  positions: [number, number][];
  color: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
  arrows?: ArrowOptions;
}

export function PolylineWithArrows({
  positions,
  color,
  weight = 3,
  opacity = 0.8,
  dashArray,
  arrows = DEFAULT_ARROWS,
}: PolylineWithArrowsProps) {
  const map = useMap();
  const layerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (positions.length) {
      const polyline = L.polyline(positions, { color, weight, opacity, dashArray }).arrowheads({
        ...arrows,
        color,
      });

      polyline.addTo(map);
      layerRef.current = polyline;
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [positions, color, weight, opacity, dashArray, arrows, map]);

  return null;
}
