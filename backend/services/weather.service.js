const axios = require('axios');

const fetchWeather = async (apiKey) => {
  const cities = [
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
    { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
    { name: 'New Delhi', lat: 28.6139, lng: 77.2090, country: 'India' }
  ];

  const alerts = [];

  for (const city of cities) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&appid=${apiKey}`;
      const response = await axios.get(url);
      const data = response.data;

      const mainWeather = data.weather[0];
      if (mainWeather && (mainWeather.id < 600 || mainWeather.id === 781 || city.country === 'India')) {
        alerts.push({
          id: `weather-${city.name}-${data.dt}`,
          title: `Weather: ${mainWeather.description} in ${city.name}`,
          type: 'weather',
          severity: (mainWeather.id === 781 || mainWeather.id < 600) ? 'high' : 'low',
          country: city.country,
          lat: city.lat,
          lng: city.lng,
          timestamp: new Date(data.dt * 1000).toISOString()
        });
      }
    } catch (error) {
      console.error(`Error fetching weather for ${city.name}:`, error.message);
    }
  }

  return alerts;
};

module.exports = { fetchWeather };
