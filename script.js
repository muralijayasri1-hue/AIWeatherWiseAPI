// 1. Get a free API key from https://openweathermap.org/api and paste it here
const API_KEY = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const result = document.getElementById("weatherResult");

function showLoading(show) {
  loading.style.display = show ? "block" : "none";
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = "block";
  result.style.display = "none";
}

function formatTime(unixSeconds, timezoneOffset) {
  // Shows the time in the searched city's own timezone
  const date = new Date((unixSeconds + timezoneOffset) * 1000);
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function getTip(temp, condition) {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return "Carry an umbrella or raincoat today.";
  if (c.includes("thunderstorm")) return "Stay indoors if possible. Thunderstorms are expected.";
  if (c.includes("snow")) return "Wear warm layers and drive carefully.";
  if (temp >= 35) return "Very hot. Drink plenty of water and avoid the midday sun.";
  if (temp >= 28) return "Warm weather. Light clothes and sunscreen are a good idea.";
  if (temp <= 10) return "It's cold. Wear a jacket.";
  return "The weather is pleasant. Enjoy your day!";
}

async function getWeather(city) {
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  errorBox.style.display = "none";
  result.style.display = "none";
  showLoading(true);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 401) throw new Error("Invalid API key. Check API_KEY in script.js.");
    if (response.status === 404) throw new Error("City not found. Check the spelling.");
    if (!response.ok) throw new Error(data.message || "Something went wrong.");

    displayWeather(data);
  } catch (err) {
    if (err instanceof TypeError) {
      showError("Network error. Check your internet connection.");
    } else {
      showError(err.message);
    }
  } finally {
    showLoading(false);
  }
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const condition = data.weather[0].main;
  const tz = data.timezone;

  document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("dateTime").textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("temperature").textContent = `${temp}°C`;
  document.getElementById("description").textContent = data.weather[0].description;

  document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

  document.getElementById("aiText").textContent = getTip(temp, condition);

  document.getElementById("sunrise").textContent = formatTime(data.sys.sunrise, tz);
  document.getElementById("sunset").textContent = formatTime(data.sys.sunset, tz);

  result.style.display = "block";
}

searchBtn.addEventListener("click", () => getWeather(cityInput.value.trim()));

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather(cityInput.value.trim());
});
