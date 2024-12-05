let timeEl = document.getElementById("time");
let dateEl = document.getElementById("date");
let timeZone = document.getElementById("time-zone");
let countryEl = document.getElementById("country");
let weatherForecast = document.getElementById("weather-forecast");
let currentTemp = document.getElementById("current-temp");
let cityInput = document.getElementById("city-input");
let searchBtn = document.getElementById("search-btn");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const API_KEY = "6b499aeff8e44568a6041418240512";  

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12Hr = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    timeEl.innerHTML = hoursIn12Hr + ":" + minutes + `<span class="pm-am">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

 
function getWeatherByCity(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`)
        .then(res => res.json())
        .then(data => {
            displayWeatherData(data);
        })
        .catch(err => {
            alert("City not found, please try again.");
            console.error("Error fetching weather data:", err);
        });
}

 
function getWeatherByLocation() {
    
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`)
            .then(res => res.json())
            .then(data => {
                displayWeatherData(data);
            })
            .catch(err => {
                alert("Could not fetch weather data for your location.");
                console.error("Error fetching weather data:", err);
            });
    }, (error) => {
        alert("Please enable location services.");
        console.error("Error getting location:", error);
    });
}
 
function displayWeatherData(data) {
    
    const currentWeather = data.current;
    const location = data.location;

     
    countryEl.innerHTML = `${location.country} / ${location.name}`;

     
    currentTemp.innerHTML = `
        <img src="https:${currentWeather.condition.icon}" alt="Weather Icon">
        <div class="others">
            <div class="day">${days[new Date().getDay()]}</div>
            <div class="temp">Night - ${currentWeather.temp_c}&#176;C</div>
            <div class="temp">Day - ${currentWeather.temp_c}&#176;C</div>
        </div>
    `;

    
    let forecastHTML = "";
    data.forecast.forecastday.forEach((day, idx) => {
        if (idx === 0) return;  

        forecastHTML += `
            <div class="wither-forecast-item">
                <div class="day">${days[new Date(day.date).getDay()]}</div>
                <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                <div class="temp">Night - ${day.day.mintemp_c}&#176;C</div>
                <div class="temp">Day - ${day.day.maxtemp_c}&#176;C</div>
            </div>
        `;
    });

  
    weatherForecast.innerHTML = forecastHTML;
}
 
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        alert("Please enter a city name.");
    }
});

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        } else {
            alert("Please enter a city name.");
        }
    }
});

// Call the function to get weather by location when the page loads
window.onload = getWeatherByLocation;
