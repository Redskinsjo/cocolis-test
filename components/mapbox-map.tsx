import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
  onMapLoaded?(): void;
  onMapRemoved?(): void;
  rides: any;
}

function MapboxMap({
  initialOptions,
  onMapLoaded,
  onMapRemoved,
  rides,
}: MapboxMapProps) {
  const [map, setMap] = useState<mapboxgl.Map>();

  const mapNode = useRef(null);

  const getNewMap = (map: any) => {
    rides.forEach((r: any) => {
      new mapboxgl.Marker()
        .setLngLat([r._source.from_lng, r._source.from_lat])
        .addTo(map);
      new mapboxgl.Marker()
        .setLngLat([r._source.to_lng, r._source.to_lat])
        .addTo(map);
    });
    setMap(map);
    return map;
  };

  const setMapLayers = (map: any) => {
    rides.forEach((r: any) => {
      if (!map.getSource(r._id)) {
        map
          .addSource(r._id, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      [r._source.from_lng, r._source.from_lat],
                      [r._source.to_lng, r._source.to_lat],
                    ],
                  },
                },
              ],
            },
          })
          .addLayer({
            id: r._id,
            type: "line",
            source: r._id,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": r._color,
              "line-width": 4,
            },
          });
      }
    });
  };

  useEffect(() => {
    const node = mapNode.current;
    // if the window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [3, 49],
      zoom: 4.5,
      ...initialOptions,
    });

    if (onMapLoaded)
      mapboxMap.on("load", () => {
        const newMap = getNewMap(mapboxMap);
        setMapLayers(newMap);
        onMapLoaded();
      });

    return () => {
      mapboxMap.remove();
      if (onMapRemoved) onMapRemoved();
    };
  }, []);

  useEffect(() => {
    if (map) {
      const newMap = getNewMap(map);
      setMapLayers(newMap);
    }
  }, [rides.length]);

  return (
    <div
      ref={mapNode}
      style={{
        width: "800px",
        minHeight: "800px",
      }}
    />
  );
}

export default MapboxMap;
