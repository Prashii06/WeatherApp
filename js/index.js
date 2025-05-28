document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('city-select');
    const weatherForecast = document.getElementById('weather-forecast');
    const errorMessage = document.getElementById('error-message');

    // Load city coordinates from CSV
    fetch('city_coordinates.csv')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load city_coordinates.csv!');
            return response.text();
        })
        .then(data => {
            const cities = parseCSV(data);
            populateCityDropdown(cities);
        })
        .catch(error => {
            errorMessage.textContent = 'Error loading city data. Please try again.';
            console.error('Error loading CSV:', error);
        });

    // Parse CSV data (latitude,longitude,city,country)
    function parseCSV(data) {
        const lines = data.trim().split('\n');
        const cities = [];
        lines.slice(1).forEach(line => {
            const [lat, lon, city, country] = line.split(',');
            if (lat && lon && city && country) {
                cities.push({ city, country, lat: parseFloat(lat), lon: parseFloat(lon) });
            }
        });
        return cities;
    }

    // Populate city dropdown with city and country
    function populateCityDropdown(cities) {
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = `${city.lat},${city.lon}`;
            option.textContent = `${city.city}, ${city.country}`;
            citySelect.appendChild(option);
        });
    }

    // Fetch weather data from 7Timer API (civillight endpoint)
    async function fetchWeather(lat, lon) {
        const url = `http://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log('API Response:', data); // Debug: Log the full API response
            if (!data.dataseries || !Array.isArray(data.dataseries)) {
                throw new Error('Invalid API response: No valid dataseries found');
            }
            return data;
        } catch (error) {
            errorMessage.textContent = 'Unable to fetch weather data. Please try another city.';
            console.error('Error fetching weather:', error);
            return null;
        }
    }

    // Map 7Timer weather codes to images in the 'images' folder
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
    function displayForecast(data, city) {
        weatherForecast.innerHTML = '';
        if (!data || !data.dataseries || data.dataseries.length === 0) {
            errorMessage.textContent = 'No weather data available for this location.';
            return;
        }

        const today = new Date(); 
        data.dataseries.slice(0, 7).forEach((day, index) => {
            // Calculate the date for each forecast day
            const forecastDate = new Date(today);
            forecastDate.setDate(today.getDate() + index);
            const dateString = forecastDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            // Handle missing or undefined weather field
            const weatherCondition = day.weather && typeof day.weather === 'string' 
                ? day.weather.charAt(0).toUpperCase() + day.weather.slice(1) 
                : 'Unknown';

            console.log(`Day ${index + 1}: Weather=${day.weather}, Temp Max=${day.temp2m?.max}, Temp Min=${day.temp2m?.min}`); // Debug: Log each day's data

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <h3>${dateString}</h3>
                <img src="${weatherIcons[day.weather] || 'images/clear.png'}" alt="${weatherCondition}">
                <p>Max: ${day.temp2m?.max ?? 'N/A'}°C</p>
                <p>Min: ${day.temp2m?.min ?? 'N/A'}°C</p>
                <p>${weatherCondition}</p>
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
        displayForecast(data, citySelect.options[citySelect.selectedIndex].text);
    });
});