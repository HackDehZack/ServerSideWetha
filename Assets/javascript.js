// Function to display current weather conditions
function displayCurrentWeather(weatherData) {
    // Update the HTML elements with the relevant weather data
    document.getElementById('city-name').textContent = weatherData.cityName;
    document.getElementById('current-date').textContent = weatherData.date;
    document.getElementById('weather-icon').src = weatherData.iconUrl;
    document.getElementById('temperature').textContent = `Temperature: ${weatherData.temperature}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${weatherData.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${weatherData.windSpeed}m/s`;
  }