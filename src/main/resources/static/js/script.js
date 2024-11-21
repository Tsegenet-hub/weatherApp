document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weatherForm');
    const addZipForm = document.getElementById('addZipForm');
    const zipCodeInput = document.getElementById('zipCode');
    const addZipCodeInput = document.getElementById('addZipCode');
    const weatherResult = document.getElementById('weatherResult');
    const zipCodeList = document.getElementById('zipCodeList');
    const savedWeatherResults = document.getElementById('savedWeatherResults');
    const popularZipCodeList = document.getElementById('popularZipCodeList');

    // Load stored zip codes and display weather for each
    loadStoredZipCodes();
    // Load popular zip codes from the database
    loadZipCodesFromDB();

    // Add event listener to the weather form for fetching weather data
    weatherForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = zipCodeInput.value;
        fetchWeather(zipCode, weatherResult);
    });

    // Add event listener to the add zip code form for adding a new zip code to the list
    addZipForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = addZipCode.value;
        addZipCodeToList(zipCode);
    });

    // Function to fetch weather data for a given zip code and display it
    function fetchWeather(zipCode, resultElement) {
        fetch(`/api/weather?zipCode=${zipCode}`)
            .then(response => {
                if (response.status === 500) {
                    throw new Error('Invalid zip code');
                }
                return response.json();
            })
            .then(data => {
                // Check for severe weather conditions
                if (isSevereWeather(data.conditionCode)) {
                    alert(`Severe weather condition detected in ${data.city} (ZIP: ${zipCode}): ${getDescriptionForConditionCode(data.conditionCode)}`);
                }
                const weatherIcon = data.icon;
                const weatherInfo = `
                    <div id="weatherResult" class="weather-container">
                        <div class="weather-header">
                            <div class="city-name">${data.city}</div>
                            <img src="${weatherIcon}" alt="Weather Icon" class="weather-icon" onerror="this.onerror=null; this.src='/images/default.png';">
                            <div class="temperature">${data.temperature} °F</div>
                        </div>
                        <div class="weather-details">
                            <p>Feels Like: ${data.feelsLike} °F</p>
                            <p>Min Temp: ${data.tempMin} °F</p>
                            <p>Max Temp: ${data.tempMax} °F</p>
                            <p>Humidity: ${data.humidity} %</p>
                            <p>Wind Speed: ${data.windSpeed} mph</p>
                        </div>
                    </div>
                `;
                resultElement.innerHTML = weatherInfo;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                if (error.message === 'Invalid zip code') {
                    alert('The provided zip code does not exist. Please enter a valid zip code.');
                    resultElement.innerHTML = 'Error: Invalid zip code';
                } else {
                    resultElement.innerHTML = 'Error fetching weather data';
                }
            });
    }

    // Function to check if the weather condition is severe based on the condition code
    function isSevereWeather(conditionCode) {
        const severeConditions = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 502, 503, 504, 511, 522, 531, 601, 602, 622, 711, 731, 741, 751, 761, 762, 771, 781];
        return severeConditions.includes(conditionCode);
    }

    // Function to get the description for a specific weather condition code
    function getDescriptionForConditionCode(conditionCode) {
        const conditionDescriptions = {
            200: 'thunderstorm with light rain',
            201: 'thunderstorm with rain',
            202: 'thunderstorm with heavy rain',
            210: 'light thunderstorm',
            211: 'thunderstorm',
            212: 'heavy thunderstorm',
            221: 'ragged thunderstorm',
            230: 'thunderstorm with light drizzle',
            231: 'thunderstorm with drizzle',
            232: 'thunderstorm with heavy drizzle',
            502: 'heavy intensity rain',
            503: 'very heavy rain',
            504: 'extreme rain',
            511: 'freezing rain',
            522: 'heavy intensity shower rain',
            531: 'ragged shower rain',
            601: 'snow',
            602: 'heavy snow',
            622: 'heavy shower snow',
            711: 'smoke',
            731: 'sand/dust whirls',
            741: 'fog',
            751: 'sand',
            761: 'dust',
            762: 'volcanic ash',
            771: 'squalls',
            781: 'tornado'
        };
        return conditionDescriptions[conditionCode] || 'Unknown severe condition';
    }

    // Function to add a new zip code to the list and fetch its weather data
    function addZipCodeToList(zipCode) {
        const tempResultElement = document.createElement('div');
        fetch(`/api/weather?zipCode=${zipCode}`)
            .then(response => {
                if (response.status === 500) {
                    throw new Error('Invalid zip code');
                }
                return response.json();
            })
            .then(data => {
                let storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
                if (!storedZipCodes.includes(zipCode)) {
                    storedZipCodes.push(zipCode);
                    localStorage.setItem('zipCodes', JSON.stringify(storedZipCodes));
                    displayStoredZipCodes(storedZipCodes);
                    fetchWeatherForSavedZipCode(zipCode);
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                if (error.message === 'Invalid zip code') {
                    alert('The provided zip code does not exist. Please enter a valid zip code.');
                }
            });
    }

    // Function to load stored zip codes from localStorage and display their weather data
    function loadStoredZipCodes() {
        const storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
        displayStoredZipCodes(storedZipCodes);
        storedZipCodes.forEach(zipCode => fetchWeatherForSavedZipCode(zipCode));
    }

    // Function to load popular zip codes from the database and display their weather data
    function loadZipCodesFromDB() {
        fetch('/api/zipcodes')
            .then(response => response.json())
            .then(data => {
                const zipCodes = data.map(item => item.zipCode);
                displayPopularZipCodes(zipCodes);
                zipCodes.forEach(zipCode => fetchWeatherForPopularZipCode(zipCode));
            })
            .catch(error => console.error('Error fetching zip codes from DB:', error));
    }

    // Function to display stored zip codes in the UI
    function displayStoredZipCodes(zipCodes) {
        zipCodeList.innerHTML = '';
        zipCodes.forEach(zipCode => {
            const listItem = document.createElement('li');

            const zipCodeText = document.createElement('span');
            zipCodeText.textContent = zipCode;

            const resultElement = document.createElement('div');
            resultElement.id = `weatherResult-${zipCode}`;
            resultElement.classList.add('weather-info');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete from list';
            deleteButton.addEventListener('click', () => removeZipCode(zipCode));

            listItem.appendChild(zipCodeText);
            listItem.appendChild(resultElement);
            listItem.appendChild(deleteButton);

            zipCodeList.appendChild(listItem);
        });
    }

    // Function to display popular zip codes in the UI
    function displayPopularZipCodes(zipCodes) {
        popularZipCodeList.innerHTML = '';
        zipCodes.forEach(zipCode => {
            const listItem = document.createElement('li');

            const zipCodeText = document.createElement('span');
            zipCodeText.textContent = zipCode;

            const resultElement = document.createElement('div');
            resultElement.id = `popularWeatherResult-${zipCode}`;
            resultElement.classList.add('weather-info');

            listItem.appendChild(zipCodeText);
            listItem.appendChild(resultElement);

            popularZipCodeList.appendChild(listItem);
        });
    }

    // Function to fetch weather data for a popular zip code and display it
    function fetchWeatherForPopularZipCode(zipCode) {
        const resultElement = document.getElementById(`popularWeatherResult-${zipCode}`);
        if (resultElement) {
            fetchWeather(zipCode, resultElement);
        }
    }

    // Function to fetch weather data for a saved zip code and display it
    function fetchWeatherForSavedZipCode(zipCode) {
        const resultElement = document.getElementById(`weatherResult-${zipCode}`);
        if (resultElement) {
            fetchWeather(zipCode, resultElement);
        }
    }

    // Function to remove a zip code from the list
    function removeZipCode(zipCode) {
        let storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
        storedZipCodes = storedZipCodes.filter(storedZipCode => storedZipCode !== zipCode);
        localStorage.setItem('zipCodes', JSON.stringify(storedZipCodes));
        displayStoredZipCodes(storedZipCodes);
    }
});
