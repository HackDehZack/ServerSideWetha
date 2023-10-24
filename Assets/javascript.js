const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const cityNameElem = document.getElementById("city-name");
const dateElem = document.getElementById("date");
const weatherIconElem = document.getElementById("weather-icon");
const temperatureElem = document.getElementById("temperature");
const humidityElem = document.getElementById("humidity");
const windSpeedElem = document.getElementById("wind-speed");
const forecastContainer = document.getElementById("forecast-container");
const searchHistoryContainer = document.getElementById("search-history");

searchForm.addEventListener("submit", handleSearch);

function handleSearch(event) {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    clearWeatherData();
    getWeather(city);
    saveSearchToLocalStorage(city);
    displaySearchHistory();
  }
}

function getWeather(city) {
  const apiKey = "3f5eeb3cccfc79369776a3c555cdb288";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(handleResponse)
    .then(displayCurrentWeather)
    .catch(handleError);

  fetch(forecastUrl)
    .then(handleResponse)
    .then(displayForecast)
    .catch(handleError);
}

function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }
  throw new Error("Error: " + response.status);
}

function displayCurrentWeather(data) {
  cityNameElem.textContent = "City: " + data.name;
  dateElem.textContent = "Date: " + new Date().toLocaleDateString();
  weatherIconElem.innerHTML = '<img src="/assets/weather-icons/' + data.weather[0].icon + '.png" alt="Weather Icon">';
  temperatureElem.textContent = "Temperature: " + data.main.temp + " °C";
  humidityElem.textContent = "Humidity: " + data.main.humidity + "%";
  windSpeedElem.textContent = "Wind Speed: " + data.wind.speed + " m/s";
}

function displayForecast(data) {
  const forecastData = data.list;
  const fiveDayForecast = forecastData.filter((forecast, index) => index % 8 === 0);

  fiveDayForecast.forEach(function (forecast) {
    const date = forecast.dt_txt.split(" ")[0];
    const icon = forecast.weather[0].icon;
    const temperature = forecast.main.temp;
    const windSpeed = forecast.wind.speed;
    const humidity = forecast.main.humidity;

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");
    forecastCard.innerHTML = `
      <div class="date">${date}</div>
      <div class="weather-icon"><img src="/assets/weather-icons/${icon}.png" alt="Weather Icon"></div>
      <div class="temperature">Temperature: ${temperature} °C</div>
      <div class="wind-speed">Wind Speed: ${windSpeed} m/s</div>
      <div class="humidity">Humidity: ${humidity}%</div>
    `;

    forecastContainer.appendChild(forecastCard);
  });
}

function handleError(error) {
  console.error("An error occurred:", error);
}

function clearWeatherData() {
  cityNameElem.textContent = "";
  dateElem.textContent = "";
  weatherIconElem.innerHTML = "";
  temperatureElem.textContent = "";
  humidityElem.textContent = "";
  windSpeedElem.textContent = "";
  forecastContainer.innerHTML = "";
}

function saveSearchToLocalStorage(city) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.push(city);
  localStorage.setItem("searches", JSON.stringify(searches));
}

function displaySearchHistory() {
  searchHistoryContainer.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach(function (search) {
    const historyItem = document.createElement("div");
    historyItem.classList.add("search-history-item");
    historyItem.textContent = search;
    searchHistoryContainer.appendChild(historyItem);
  });
}