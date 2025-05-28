document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('city-select');
    const weatherForecast = document.getElementById('weather-forecast');
    const errorMessage = document.getElementById('error-message');

    // Load city coordinates from CSV
    fetch('city_coordinates.csv')
        .then(response => response.ok ? response.text() : Promise.reject('Failed to load city data'))
        .then(data => {
            const cities = parseCSV(data);
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = `${city.lat},${city.lon}`;
                option.textContent = `${city.city}, ${city.country}`;
                citySelect.appendChild(option);
            });
        })
        .catch(error => {
            errorMessage.textContent = 'Error loading city data.';
            console.error(error);
        });

    // Parse CSV data
    function parseCSV(data) {
        return data.trim().split('\n').slice(1).map(line => {
            const [lat, lon, city, country] = line.split(',');
            return lat && lon && city && country ? { city, country, lat: parseFloat(lat), lon: parseFloat(lon) } : null;
        }).filter(Boolean);
    }

    // Fetch weather data from 7Timer API (civillight endpoint) with CORS proxy
    async function fetchWeather(lat, lon) {
        const baseUrl = `http://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
        const url = `https://cors-anywhere.herokuapp.com/${baseUrl}`;
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log('API Response:', data); // Debug: Log the API response
            return data.dataseries && Array.isArray(data.dataseries) ? data : null;
        } catch (error) {
            errorMessage.textContent = 'Unable to fetch weather data.';
            console.error('Fetch Error:', error);
            return null;
        }
    }

    // Map 7Timer weather codes to images
    const weatherIcons = {
        clear: 'images/clear.png',
        pcloudy: 'images/cloudy.png',
        mcloudy: 'images/mcloudy.png',
        cloudy: 'images/cloudy.png',
        rain: 'images/rain.png',
        lightrain: 'images/lightrain.png',
        oshower: 'images/oshower.png',
        ishower: 'images/ishower.png',
        lightsnow: 'images/lightsnow.png',
        snow: 'images/snow.png',
        rainsnow: 'images/rainsnow.png',
        tsrain: 'images/tsrain.png',
        tstorm: 'images/tstorm.png',
        fog: 'images/fog.png'
    };

    // Display 7-day forecast
    function displayForecast(data) {
        weatherForecast.innerHTML = '';
        if (!data) {
            errorMessage.textContent = 'No weather data available.';
            return;
        }

        const today = new Date(); // Current date: May 28, 2025
        data.slice(0, 7).forEach((day, index) => {
            const forecastDate = new Date(today);
            forecastDate.setDate(today.getDate() + index);
            const dateString = forecastDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            const weatherCondition = day.weather && typeof day.weather === 'string' 
                ? day.weather.charAt(0).toUpperCase() + day.weather.slice(1) 
                : 'Unknown';

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <h3>${dateString}</h3>
                <img src="${weatherIcons[day.weather] || 'images/clear.png'}" alt="${weatherCondition}">
                <p class="temp-max">Max: ${day.temp2m?.max ?? 'N/A'}°C</p>
                <p class="temp-min">Min: ${day.temp2m?.min ?? 'N/A'}°C</p>
                <p class="weather">${weatherCondition}</p>
            `;
            weatherForecast.appendChild(card);
        });
    }

    // Handle city selection
    citySelect.addEventListener('change', async () => {
        errorMessage.textContent = '';
        const [lat, lon] = citySelect.value.split(',');
        if (!lat || !lon) {
            weatherForecast.innerHTML = '';
            errorMessage.textContent = 'Please select a valid city.';
            return;
        }
        const data = await fetchWeather(lat, lon);
        displayForecast(data);
    });
});