SkyOverEurope - 7-Day Weather Forecast
SkyOverEurope is a minimalistic web application that provides a 7-day weather forecast for various European cities. It fetches weather data using the 7Timer API (civillight.php endpoint) and displays daily forecasts with a clean, starry-sky-themed interface. The app features a simple dropdown to select cities, flat forecast cards with distinct styling for dates, temperatures, and weather conditions, and a responsive design.

Features:
7-Day Forecast: Displays daily weather forecasts for the next 7 days, starting from the current date.
Minimalistic UI: A clean, flat design with a bluish starry sky background.
Responsive Design: Adapts to various screen sizes for a seamless experience on mobile and desktop.
European Cities: Uses a CSV file (city_coordinates.csv) to provide a list of European cities with their coordinates.

File Structure:
SkyOverEurope/
├── index.html          # Main HTML file for the app structure
├── README.md           # Project documentation
├── city_coordinates.csv # CSV file containing city names, coordinates, and countries
├── css/
│   └── style.css       # Styles for the minimalistic UI and starry background
├── js/
│   └── index.js        # JavaScript for fetching and displaying weather data
├── images/
│   ├── clear.png       # Weather icons for different conditions
│   ├── cloudy.png
│   ├── fog.png
│   ├── lightrain.png
│   └── ... (other weather icons)

Prerequisites:
A modern web browser (e.g., Chrome, Firefox, Safari).
A local server to run the app (e.g., http-server or VS Code Live Server) for development.
Internet connection to fetch weather data from the 7Timer API.

Setup Instructions:
Local Development-

Clone the Repository:
git clone https://github.com/<your-username>/SkyOverEurope.git
cd SkyOverEurope


Install a Local Server (if not already installed):
Install http-server via npm:npm install -g http-server

Alternatively, use VS Code's Live Server extension or any other local server tool.


Verify Files:
Ensure the images folder contains all required weather icons (e.g., clear.png, cloudy.png, rain.png).
Confirm that city_coordinates.csv is present and contains valid city data in the format: latitude,longitude,city,country.


Run the App:
Start the local server in the project directory:http-server .


Open your browser and navigate to http://localhost:8080 (or the port provided by your server).



Deploy on GitHub Pages
Push to GitHub:

Initialize a Git repository (if not already done), commit your files, and push to GitHub:git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/SkyOverEurope.git
git push -u origin main




Enable GitHub Pages:
Go to your repository on GitHub.
Navigate to Settings > Pages.
Under "Source", select the main branch and the / (root) folder, then click Save.
Wait a few minutes for GitHub Pages to deploy your site. It will be accessible at https://<your-username>.github.io/SkyOverEurope/.


Handle CORS for Deployment:
The 7Timer API may block requests due to CORS when hosted on GitHub Pages. As a temporary workaround, you can modify the API URL in index.js to use a CORS proxy:const url = `https://cors-anywhere.herokuapp.com/http://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
Note: cors-anywhere.herokuapp.com is for testing only. For production, set up your own CORS proxy server or use a backend to handle API requests.



Usage:
Select a City:

Use the dropdown menu to select a city (e.g., "Paris, France").
The dropdown is populated from city_coordinates.csv, which includes cities like Paris, Berlin, and Stockholm.


View the Forecast:
Once a city is selected, the app fetches a 7-day forecast from the 7Timer API.
Forecast cards display:
Date (e.g., "Wed, May 28" for the first day, based on the current date: May 28, 2025).
Weather icon (e.g., clear.png for clear weather).
Max and min temperatures (e.g., "Max: 22°C", "Min: 15°C").
Weather condition (e.g., "Clear").




Error Handling:
If the API request fails or no data is available, an error message will appear (e.g., "Unable to fetch weather data.").



API Details
SkyOverEurope uses the 7Timer API (civillight.php endpoint) to fetch weather data.

Endpoint: http://www.7timer.info/bin/civillight.php
Parameters:
lon: Longitude of the city.
lat: Latitude of the city.
ac=0: Altitude correction (set to 0).
unit=metric: Temperature in Celsius.
output=json: JSON response format.
tzshift=0: Timezone shift (set to 0 for UTC).


Example Request (for Paris, lat: 48.856, lon: 2.352):http://www.7timer.info/bin/civillight.php?lon=2.352&lat=48.856&ac=0&unit=metric&output=json&tzshift=0


Response Structure:{
  "product": "civillight",
  "init": "2025052800",
  "dataseries": [
    {
      "date": 20250528,
      "weather": "clear",
      "temp2m": { "max": 22, "min": 15 },
      "wind10m_max": 3
    },
    ...
  ]
}



Troubleshooting:
CORS Errors:
If the API request fails due to CORS (especially on GitHub Pages), use the cors-anywhere workaround mentioned in the deployment section.
For a production environment, set up your own CORS proxy or use a backend server to handle API requests.


Weather Condition Shows "Unknown":
Verify that the weather field in the API response matches the keys in the weatherIcons mapping in index.js.
Check the browser console for errors if the issue persists.


Images Not Loading:
Ensure all weather icons (e.g., clear.png, cloudy.png) are in the images folder and their filenames match the weatherIcons mapping.
Check the browser's Network tab for 404 errors on image requests.


City Dropdown Empty:
Confirm that city_coordinates.csv is in the root directory and contains valid data.



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch for your feature or bug fix.
Make your changes and test thoroughly.
Submit a pull request with a detailed description of your changes.

License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.
Acknowledgments

7Timer API: For providing free weather forecast data. Visit 7Timer for more information.
Starry Sky Background: Inspired by CSS animation techniques for a celestial effect.


Last Updated: May 28, 2025
