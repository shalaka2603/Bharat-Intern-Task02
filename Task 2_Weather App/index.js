document.getElementById('get-weather').addEventListener('click', function() {
    const city = document.getElementById('city-name').value;
    fetchWeather(city);
});

document.getElementById('current-location').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, error => {
            console.error('Error:', error);
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

document.querySelectorAll('.city-button').forEach(button => {
    button.addEventListener('click', function() {
        fetchWeather(this.textContent);
    });
});

function fetchWeather(city) {
    const apiKey = '0acf419621d6058ec345c2752ae34f95';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                getForecast(data.coord.lat, data.coord.lon, apiKey);
            } else {
                document.getElementById('weather-result').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            document.getElementById('weather-result').innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
            console.error('Error:', error);
        });
}

function fetchWeatherByCoords(lat, lon) {
    const apiKey = '0acf419621d6058ec345c2752ae34f95';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                getForecast(lat, lon, apiKey);
            } else {
                document.getElementById('weather-result').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            document.getElementById('weather-result').innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
            console.error('Error:', error);
        });
}

function displayWeather(data) {
    const weatherResult = `
        <p><strong>City:</strong> ${data.name}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="weather-icon" alt="Weather icon">
    `;
    document.getElementById('weather-result').innerHTML = weatherResult;
    changeBackgroundImage(data.weather[0].main);
}

function changeBackgroundImage(weather) {
    let backgroundImage = '';
    switch(weather.toLowerCase()) {
        case 'clear':
            backgroundImage = 'url(clear-sky.jpg)';
            break;
        case 'clouds':
            backgroundImage = 'url(cloudy.jpg)';
            break;
        case 'rain':
            backgroundImage = 'url(rainy.jpg)';
            break;
        case 'snow':
            backgroundImage = 'url(snowy.jpg)';
            break;
        case 'thunderstorm':
            backgroundImage = 'url(thunderstorm.jpg)';
            break;
        case 'mist':
            backgroundImage = 'url(mist.jpg)';
            break;
        case 'haze':
            backgroundImage = 'url(haze.jpg)';
            break;
        case 'drizzle':
            backgroundImage = 'url(drizzle.jpg)';
            break;
        default:
            backgroundImage = 'url(bgi.jpg)';
            break;
    }
    document.body.style.backgroundImage = backgroundImage;
}

function getForecast(lat, lon, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastDiv = document.getElementById('weather-cards');
            forecastDiv.innerHTML = '';
            let forecastHTML = '';

            data.list.forEach((item, index) => {
                if (index % 8 === 0) {
                    forecastHTML += `
                        <div class="weather-cards">
                            <p><strong>${new Date(item.dt_txt).toLocaleDateString()}</strong></p>
                            <p>Temp: ${item.main.temp} °C</p>
                            <p>Weather: ${item.weather[0].description}</p>
                            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" class="weather-icon" alt="Weather icon">
                        </div>
                    `;
                }
            });

            forecastDiv.innerHTML += forecastHTML;
        })
        .catch(error => {
            document.getElementById('forecast').innerHTML = `<p>Error fetching forecast data. Please try again later.</p>`;
            console.error('Error:', error);
        });
}
