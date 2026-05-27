import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (severity) => {
  return L.divIcon({
    className: `custom-marker marker-${severity}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

const MapUpdater = ({ alerts }) => {
  const map = useMap();
  useEffect(() => {}, [alerts, map]);
  return null;
};

const MapComponent = ({ alerts, onAlertClick }) => {
  const theme = document.documentElement.getAttribute('data-theme');
  const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={3} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={theme === 'light' ? lightTiles : darkTiles}
      />
      
      {alerts.map(alert => (
        <Marker 
          key={alert.id} 
          position={[alert.lat, alert.lng]}
          icon={createCustomIcon(alert.severity)}
          eventHandlers={{
            click: () => onAlertClick && onAlertClick(alert),
          }}
        >
          <Popup>
            <div style={{ padding: '4px', minWidth: '180px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 600 }}>{alert.title}</h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                Type: <span style={{ textTransform: 'capitalize' }}>{alert.type}</span>
              </p>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                Severity: <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{alert.severity}</span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <MapUpdater alerts={alerts} />
    </MapContainer>
  );
};

export default MapComponent;
