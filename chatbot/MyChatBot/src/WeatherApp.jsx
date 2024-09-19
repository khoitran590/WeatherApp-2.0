// WeatherApp.js
import React, { useState } from 'react';
import './style.css';

const apiKey = '381349b1f47a31c8dbb9e00405692cd1';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  // Fetch weather data
  const fetchWeather = () => {
    if (!location) {
      setError('Please enter a city name');
      return;
    }

    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          const celsius = data.main.temp;
          const fahrenheit = (celsius * 9/5) + 32;
          setWeatherData({
            name: data.name,
            temperature: `${Math.round(celsius)}°C / ${Math.round(fahrenheit)}°F`,
            description: data.weather[0].description,
          });
          setError(''); // Clear any previous error
        } else {
          setError('City not found. Please try again.');
        }
      })
      .catch(() => {
        setError('Error fetching weather data. Please try again later.');
      });
  };

  // Reset weather data
  const resetWeather = () => {
    setLocation('');
    setWeatherData(null);
    setError('');
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="container">
      <h1>Weather App</h1>
      <input
        type="text"
        id="locationInput"
        placeholder="Enter a city"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for keydown events
      />
      <button onClick={fetchWeather}>Search</button>
      <button className="resetBtn" onClick={resetWeather}>Reset</button>
      <p className="errorMessage">{error}</p>
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>{weatherData.temperature}</p>
          <p>{weatherData.description}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;