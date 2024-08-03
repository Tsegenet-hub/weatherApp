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
    loadZipCodesFromDB();

    // Add event listener to the weather form
    weatherForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = zipCodeInput.value;
        fetchWeather(zipCode, weatherResult);
    });

    // Add event listener to the add zip code form
    addZipForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = addZipCode.value;
        addZipCodeToList(zipCode);
    });

    function fetchWeather(zipCode, resultElement) {
        fetch(`/api/weather?zipCode=${zipCode}`)
            .then(response => {
                if (response.status === 500) {
                    throw new Error('Invalid zip code');
                }
                return response.json();
            })
            .then(data => {
                    const weatherIcon = getWeatherIcon(data.temperature);
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
                }
            )
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

    function getWeatherIcon(temperature) {
        if (temperature <= 32) {
            return '/images/snowflake.png';
        } else if (temperature <= 60) {
            return '/images/cloudy.png';
        } else {
            return '/images/sunny.png';
        }
    }

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

    function loadStoredZipCodes() {
        const storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
        displayStoredZipCodes(storedZipCodes);
        storedZipCodes.forEach(zipCode => fetchWeatherForSavedZipCode(zipCode));
    }

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

    function fetchWeatherForPopularZipCode(zipCode) {
        const resultElement = document.getElementById(`popularWeatherResult-${zipCode}`);
        if (resultElement) {
            fetchWeather(zipCode, resultElement);
        }
    }

    function fetchWeatherForSavedZipCode(zipCode) {
        const resultElement = document.getElementById(`weatherResult-${zipCode}`);
        if (resultElement) {
            fetchWeather(zipCode, resultElement);
        }
    }

    function removeZipCode(zipCode) {
        let storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
        storedZipCodes = storedZipCodes.filter(storedZipCode => storedZipCode !== zipCode);
        localStorage.setItem('zipCodes', JSON.stringify(storedZipCodes));
        displayStoredZipCodes(storedZipCodes);
    }
});
