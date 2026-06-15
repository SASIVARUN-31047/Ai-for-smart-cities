import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Approximate coordinates for a fictional city
const ZONE_CORDS = {
  1: [40.7128, -74.0060], // Downtown
  2: [40.7300, -73.9900], // Suburb
  3: [40.7000, -74.0150], // Industrial
  4: [40.7200, -74.0100], // Commercial
  5: [40.7400, -73.9800], // Residential
};

export default function DigitalTwin() {
  const [liveData, setLiveData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/v1/dashboard/live');
        setLiveData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getMarkerColor = (aqiLevel) => {
    if (aqiLevel < 50) return '#10b981'; // Green
    if (aqiLevel < 100) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="h-full space-y-6 flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-white bg-clip-text text-transparent">Interactive Digital Twin</h2>
          <p className="text-gray-400 text-sm">Real-time geographical tracking of city resources</p>
        </div>
      </div>
      
      <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative z-0 min-h-[600px]">
        <MapContainer center={[40.7200, -73.9950]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {liveData.map(zone => {
            const coords = ZONE_CORDS[zone.zone_id] || [40.7128, -74.0060];
            return (
              <CircleMarker
                key={zone.zone_id}
                center={coords}
                radius={zone.vehicle_count / 10 + 10} // dynamic radius based on traffic size
                pathOptions={{ 
                  fillColor: getMarkerColor(zone.pollution_level), 
                  fillOpacity: 0.6, 
                  color: getMarkerColor(zone.pollution_level),
                  weight: 2
                }}
              >
                <Tooltip direction="top" className="bg-gray-900 text-white border-0 shadow-xl pointer-events-auto">
                  <div className="p-2 w-48 pointer-events-auto">
                    <h3 className="font-bold border-b border-gray-700 pb-2 mb-2">{zone.zone_name} Zone</h3>
                    <div className="space-y-1 text-sm">
                      <p className="flex justify-between"><span>Traffic:</span> <span>{zone.vehicle_count}</span></p>
                      <p className="flex justify-between"><span>Speed:</span> <span>{Math.round(zone.traffic_speed)} km/h</span></p>
                      <p className="flex justify-between"><span>AQI:</span> <span>{Math.round(zone.pollution_level)}</span></p>
                      <p className="flex justify-between"><span>Energy:</span> <span>{Math.round(zone.energy_consumption)} MW</span></p>
                      <p className="flex justify-between pt-2 mt-2 border-t border-gray-700 font-semibold text-emerald-400 pointer-events-none">
                        AI Status: {zone.predicted_pollution_risk} Risk
                      </p>
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
        
        {/* Overlay Legend */}
        <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur border border-gray-800 p-4 rounded-xl z-[1000] pointer-events-none">
          <h4 className="text-sm font-bold text-gray-200 mb-2">Air Quality Index (AQI)</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>Good (0-50)</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>Moderate (51-100)</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>Unhealthy (100+)</div>
          </div>
          <p className="mt-3 text-xs text-gray-400">Circle size represents traffic density</p>
        </div>
      </div>
    </div>
  );
}
