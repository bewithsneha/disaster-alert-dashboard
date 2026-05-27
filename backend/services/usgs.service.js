const axios = require('axios');

const fetchUSGS = async () => {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
  const response = await axios.get(url);
  const data = response.data;
  
  const alerts = [];
  
  for (const feature of data.features) {
    const mag = feature.properties.mag;
    let severity = 'low';
    if (mag >= 5) severity = 'high';
    else if (mag >= 3) severity = 'medium';

    alerts.push({
      id: feature.id,
      title: feature.properties.title,
      type: 'quake',
      severity: severity,
      country: feature.properties.place.split(', ').pop() || 'Unknown',
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      timestamp: new Date(feature.properties.time).toISOString()
    });
  }
  
  return alerts;
};

module.exports = { fetchUSGS };
