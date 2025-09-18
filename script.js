
const apiKey = "739a2cb97c43dc6cb6d97acea7ecd05a";


const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfo = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".country-txt");
const currentDateTxt = document.querySelector(".current-date-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherImg = document.querySelector(".weather-summary-img");
const forecastContainer = document.querySelector(".forecast-container");

const searchCitySection = document.querySelector(".search-city");
const notFound = document.querySelector(".not-found");


function getIcon(main) {
    main = main.toLowerCase();
    if(main.includes("clear")) return "clear.svg";
    if(main.includes("cloud")) return "clouds.svg";
    if(main.includes("drizzle")) return "drizzle.svg";
    if(main.includes("rain")) return "rain.svg";
    if(main.includes("snow")) return "snow.svg";
    if(main.includes("thunderstorm")) return "thunderstorm.svg";
    if(main.includes("mist") || main.includes("fog") || main.includes("atmosphere")) return "atmosphere.svg";
    return "clouds.svg"; 
}
async function getWeather(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if(!res.ok) throw new Error("City not found");
        const data = await res.json();

        
        countryTxt.textContent = `${data.name}, ${data.sys.country}`;
        const date = new Date();
        currentDateTxt.textContent = date.toDateString().slice(0, 10);
        tempTxt.textContent = `${Math.round(data.main.temp)}°C`;
        conditionTxt.textContent = data.weather[0].main;
        humidityValueTxt.textContent = `${data.main.humidity}%`;
        windValueTxt.textContent = `${data.wind.speed} m/s`;
        weatherImg.src = getIcon(data.weather[0].main);

        
        weatherInfo.style.display = "flex";
        searchCitySection.style.display = "none";
        notFound.style.display = "none";

        
        getForecast(city);

    } catch (err) {
        
        weatherInfo.style.display = "none";
        searchCitySection.style.display = "none";
        notFound.style.display = "flex";
    }
}


async function getForecast(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if(!res.ok) return;

        const data = await res.json();
        forecastContainer.innerHTML = "";

        
        const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 4);

        daily.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("forecast-card");
            card.innerHTML = `
                <h5>${new Date(item.dt * 1000).toDateString().slice(0, 10)}</h5>
                <img src="${getIcon(item.weather[0].main)}" alt="${item.weather[0].main}">
                <p class="forecast-temp">${Math.round(item.main.temp)}°C</p>
            `;
            forecastContainer.appendChild(card);
        });

    } catch(err) {
        console.log("Forecast error:", err);
    }
}


function showSearchCity() {
    weatherInfo.style.display = "none";
    notFound.style.display = "none";
    searchCitySection.style.display = "flex";
}


searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if(city) getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter") {
        const city = cityInput.value.trim();
        if(city) getWeather(city);
    }
});


showSearchCity();
