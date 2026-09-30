// ===============================
// AI WEATHERWISE - SCRIPT.JS
// ===============================

// Your OpenWeatherMap API Key
const API_KEY = "YOUR_API_KEY";

// Get HTML elements
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");


// ===============================
// SEARCH WEATHER
// ===============================

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    getWeather(city);
});


// ===============================
// GET WEATHER FROM API
// ===============================

async function getWeather(city) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        // Display weather information
        cityName.textContent = data.name;

        temperature.textContent =
            `${Math.round(data.main.temp)}°C`;

        weatherDescription.textContent =
            data.weather[0].description;

        humidity.textContent =
            `${data.main.humidity}%`;

        windSpeed.textContent =
            `${data.wind.speed} m/s`;

        // Weather icon
        const iconCode = data.weather[0].icon;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherIcon.alt =
            data.weather[0].description;

    }

    catch (error) {

        alert("Unable to find weather for this city.");

        console.error(error);
    }
}


// ===============================
// ENTER KEY SEARCH
// ===============================

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});
