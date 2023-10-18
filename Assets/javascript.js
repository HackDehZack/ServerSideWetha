const apiKey = '3f5eeb3cccfc79369776a3c555cdb288';

// Function to fetch weather data
async function fetchWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Unable to fetch weather data');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Implement the search functionality
function handleSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search-input');
  const city = searchInput.value.trim();

  if (city) {
    fetchWeatherData(city)
      .then((data) => {
        // Process the retrieved data and update the HTML elements accordingly
        displayCurrentWeather({
          cityName: data.name,
          date: new Date().toDateString(),
          iconUrl: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
          temperature: Math.round(data.main.temp - 273.15),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
        });
        // Show the 5-day forecast
        // Update the search history
      })
      .catch((error) => {
        console.error('Error:', error);
        // Display an error message to the user
        displayErrorMessage('Failed to fetch weather data. Please try again.');
      });
  }

  searchInput.value = '';
}

// Function to display an error message
function displayErrorMessage(message) {
  const errorContainer = document.getElementById('error-container');
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
}

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

// Add an event listener to the form submit event
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', handleSearch);