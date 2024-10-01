// WeatherApp.js
import React, { useState } from 'react';
import './style.css';

const apiKey = '381349b1f47a31c8dbb9e00405692cd1';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const cities = ['Los Angeles', 'Moscow', 'London', 'Hanoi', 'Beijing', 'Seoul', 'Osaka', 'Tokyo', 'Kyoto', 'Sydney', 'New York', 'Singapore'];

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  // Fetch weather data
  const fetchWeather = (city = location) => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }

    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          const celsius = data.main.temp;
          const fahrenheit = (celsius * 9 / 5) + 32;
          setWeatherData({
            name: data.name,
            temperature: `${Math.round(celsius)}°C / ${Math.round(fahrenheit)}°F`,
            description: data.weather[0].description,
          });
          setError(''); // Clear any previous error

          // Save the search to the database
          saveSearchToDatabase(data.name);
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

  // Fetch weather for a random city from the cities array
  const fetchRandomWeather = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    fetchWeather(randomCity);
  };

  const saveSearchToDatabase = (location) => {
    fetch('http://localhost:5001/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location }),
    })
      .then(response => response.json())
      .then(data => console.log('Search saved:', data))
      .catch(error => console.error('Error saving search:', error));
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
      <button className="resetBtn" onClick={resetWeather}>Reset</button>
      <button onClick={fetchWeather}>Search</button>
      <button className="randomizeBtn" onClick={fetchRandomWeather}>Randomize</button>
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