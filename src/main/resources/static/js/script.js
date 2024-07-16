document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weatherForm');
    const addZipForm = document.getElementById('addZipForm');
    const zipCodeInput = document.getElementById('zipCode');
    const addZipCodeInput = document.getElementById('addZipCode');
    const weatherResult = document.getElementById('weatherResult');
    const zipCodeList = document.getElementById('zipCodeList');
    const savedWeatherResults = document.getElementById('savedWeatherResults');

    loadStoredZipCodes();

    weatherForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = zipCodeInput.value;
        fetchWeather(zipCode, weatherResult);
    });

    addZipForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = addZipCodeInput.value;
        addZipCodeToList(zipCode);
    });

    function fetchWeather(zipCode, resultElement) {
        fetch(`/api/weather?zipCode=${zipCode}`)
            .then(response => response.json())
            .then(data => {
                const weatherIcon = getWeatherIcon(data.temperature);
                const weatherInfo = `
                    <div class="weather-info">
                        <img src="${weatherIcon}" alt="Weather Icon" class="weather-icon" onerror="this.onerror=null; this.src='/images/default.png';">
                        <div class="weather-details">
                            <p>${data.temperature} °F</p>
                        </div>
                    </div>
                `;
                resultElement.innerHTML = weatherInfo;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                resultElement.innerHTML = 'Error fetching weather data';
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
        let storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
        if (!storedZipCodes.includes(zipCode)) {
            storedZipCodes.push(zipCode);
            localStorage.setItem('zipCodes', JSON.stringify(storedZipCodes));
            displayStoredZipCodes(storedZipCodes);
            fetchWeatherForSavedZipCode(zipCode);
        }
    }

    function loadStoredZipCodes() {
        const storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
        displayStoredZipCodes(storedZipCodes);
        storedZipCodes.forEach(zipCode => fetchWeatherForSavedZipCode(zipCode));
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