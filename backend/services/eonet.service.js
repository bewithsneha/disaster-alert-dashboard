const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, retries = 3, baseDelay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, { timeout: 10000 });
      return response;
    } catch (error) {
      const isRetryable = error.response?.status === 503 || error.response?.status === 502 || error.code === 'ECONNABORTED';
      
      if (attempt < retries && isRetryable) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`[EONET] Attempt ${attempt}/${retries} failed (${error.message}). Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
};

const fetchEONET = async () => {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=1';
  const response = await fetchWithRetry(url);
  const data = response.data;
  
  const alerts = [];
  
  for (const event of data.events) {
    let type = 'other';
    const category = event.categories[0]?.id;
    if (category === 'severeStorms') type = 'storm';
    else if (category === 'floods') type = 'flood';
    else if (category === 'wildfires') type = 'wildfire';
    else if (category === 'volcanoes') type = 'volcano';

    const point = event.geometry.find(g => g.type === 'Point');
    if (!point) continue;

    alerts.push({
      id: event.id,
      title: event.title,
      type: type,
      severity: 'medium',
      country: 'Unknown',
      lat: point.coordinates[1],
      lng: point.coordinates[0],
      timestamp: event.geometry[0].date
    });
  }
  
  return alerts;
};

module.exports = { fetchEONET };
