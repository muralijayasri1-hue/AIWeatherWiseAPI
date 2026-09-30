// OpenWeatherMap API Key
const API_KEY = "YOUR_API_KEY_HERE";

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        document.getElementById("cityName").innerText =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").innerText =
            `${Math.round(data.main.temp)} °C`;

        document.getElementById("description").innerText =
            data.weather[0].description;

        document.getElementById("humidity").innerText =
            `${data.main.humidity} %`;

        document.getElementById("wind").innerText =
            `${data.wind.speed} m/s`;

        document.getElementById("feelsLike").innerText =
            `${Math.round(data.main.feels_like)} °C`;

        updateWeatherIcon(data.weather[0].main);

        generateSuggestion(
            data.main.temp,
            data.main.humidity,
            data.weather[0].main
        );

    } catch (error) {

        alert("City not found. Please enter a valid city name.");

        console.log(error);
    }
}


// Weather icon
function updateWeatherIcon(condition) {

    const icon = document.getElementById("weatherIcon");

    if (condition === "Clear") {
        icon.innerText = "☀️";
    }
    else if (condition === "Clouds") {
        icon.innerText = "☁️";
    }
    else if (condition === "Rain") {
        icon.innerText = "🌧️";
    }
    else if (condition === "Thunderstorm") {
        icon.innerText = "⛈️";
    }
    else if (condition === "Snow") {
        icon.innerText = "❄️";
    }
    else {
        icon.innerText = "🌤️";
    }
}


// AI-style weather suggestion
function generateSuggestion(temp, humidity, condition) {

    const suggestion = document.getElementById("suggestion");

    if (condition === "Rain") {

        suggestion.innerText =
            "Rain is expected. Carry an umbrella and avoid unnecessary outdoor travel.";

    }
    else if (temp >= 35) {

        suggestion.innerText =
            "The weather is very hot. Stay hydrated, avoid direct sunlight, and wear light clothing.";

    }
    else if (temp >= 28) {

        suggestion.innerText =
            "The weather is warm. Drink enough water and take breaks if you are outdoors.";

    }
    else if (temp <= 20) {

        suggestion.innerText =
            "The weather is cool. Carry a light jacket if you are going outside.";

    }
    else if (humidity >= 80) {

        suggestion.innerText =
            "Humidity is high. Stay hydrated and choose comfortable, breathable clothing.";

    }
    else {

        suggestion.innerText =
            "The weather looks comfortable. It is a good time for normal outdoor activities.";

    }
}


// Press Enter to search
document.getElementById("cityInput").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});
