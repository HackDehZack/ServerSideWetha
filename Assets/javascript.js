const API_KEY = '3f5eeb3cccfc79369776a3c555cdb288';

// Function to fetch current weather using the OpenWeatherMap API
function fetchCurrentWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  return fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Unable to fetch weather data for the requested city.');
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

// Function to fetch forecast data using the OpenWeatherMap API
function fetchForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  return fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Unable to fetch forecast data for the requested city.');
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

function saveSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Check if city already exists in search history
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
}

// Function to load search history from local storage
function loadSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

  if (searchHistory) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    searchHistory.forEach((city) => {
      const listItem = document.createElement('li');
      listItem.textContent = city;

      // Add click event listener to search history item
      listItem.addEventListener('click', (event) => {
        document.getElementById('search-input').value = city;
        handleFormSubmit(event);
      });

      historyList.appendChild(listItem);
    });
  }
}

// Function to display current weather conditions
function displayCurrentWeather(data) {
  const cityName = document.getElementById('city-name');
  const currentDate = document.getElementById('current-date');
  const weatherIcon = document.getElementById('weather-icon');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');

  cityName.textContent = data.name;
  currentDate.textContent = new Date().toLocaleDateString();
  weatherIcon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
}

// Function to display 5-day forecast
function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';

  const forecasts = data.list.slice(0, 5); // Get only the first 5 forecasts

  forecasts.forEach((forecast) => {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');

    const forecastDate = document.createElement('p');
    forecastDate.classList.add('forecast-date');
    forecastDate.textContent = new Date(forecast.dt * 1000).toLocaleDateString();

    const forecastIcon = document.createElement('img');
    forecastIcon.classList.add('forecast-icon');
    forecastIcon.src = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

    const forecastInfo = document.createElement('div');
    forecastInfo.classList.add('forecast-info');

    const forecastTemperature = document.createElement('p');
    forecastTemperature.classList.add('forecast-temperature');
    forecastTemperature.textContent = `Temperature: ${forecast.main.temp}°C`;

    const forecastHumidity = document.createElement('p');
    forecastHumidity.classList.add('forecast-humidity');
    forecastHumidity.textContent = `Humidity: ${forecast.main.humidity}%`;

    const forecastWindSpeed = document.createElement('p');
    forecastWindSpeed.classList.add('forecast-wind-speed');
    forecastWindSpeed.textContent = `Wind Speed: ${forecast.wind.speed} m/s`;

    forecastInfo.appendChild(forecastTemperature);
    forecastInfo.appendChild(forecastHumidity);
    forecastInfo.appendChild(forecastWindSpeed);

    forecastCard.appendChild(forecastDate);
    forecastCard.appendChild(forecastIcon);
    forecastCard.appendChild(forecastInfo);

    forecastContainer.appendChild(forecastCard);
  });
}

  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();
    const city = document.getElementById('search-input').value;
  
    fetchCurrentWeather(city)
      .then((data) => {
        displayCurrentWeather(data);
        saveSearchHistory(city);
      })
      .catch((error) => {
        showError(error.message);
      });
  
    fetchForecast(city)
      .then((data) => {
        displayForecast(data);
      })
      .catch((error) => {
        showError(error.message);
      });
  
    document.getElementById('search-input').value = '';
  }
  
  // Function to initialize the weather dashboard
  function initializeWeatherDashboard() {
    loadSearchHistory();
  
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleFormSubmit);
  }
  
  initializeWeatherDashboard();