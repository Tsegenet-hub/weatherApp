document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weatherForm');
    const addZipForm = document.getElementById('addZipForm');
    const zipCodeInput = document.getElementById('zipCode');
    const addZipCodeInput = document.getElementById('addZipCode');
    const weatherResult = document.getElementById('weatherResult');
    const zipCodeList = document.getElementById('zipCodeList');
    const savedWeatherResults = document.getElementById('savedWeatherResults');

    // Load stored zip codes and display weather for each
    loadStoredZipCodes();

    // Add event listener to the weather form
    weatherForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = zipCodeInput.value;
        fetchWeather(zipCode, weatherResult);
    });

    // Add event listener to the add zip code form
    addZipForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zipCode = addZipCodeInput.value;
        addZipCodeToList(zipCode);
    });

    function fetchWeather(zipCode, resultElement) {
        fetch(`/api/weather?zipCode=${zipCode}`)
            .then(response => response.json())
            .then(data => {
                const weatherInfo = `Temperature in ${zipCode}: ${data.temperature} °F`;
                resultElement.innerHTML = weatherInfo;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                resultElement.innerHTML = 'Error fetching weather data';
            });
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
            listItem.textContent = zipCode;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete from list';
            deleteButton.addEventListener('click', () => removeZipCode(zipCode));
            listItem.appendChild(deleteButton);
            zipCodeList.appendChild(listItem);
        });
    }

    function fetchWeatherForSavedZipCode(zipCode) {
        const resultElement = document.createElement('div');
        resultElement.id = `weatherResult-${zipCode}`;
        savedWeatherResults.appendChild(resultElement);
        fetchWeather(zipCode, resultElement);
    }

    function removeZipCode(zipCode) {
        let storedZipCodes = JSON.parse(localStorage.getItem('zipCodes')) || [];
        storedZipCodes = storedZipCodes.filter(storedZipCode => storedZipCode !== zipCode);
        localStorage.setItem('zipCodes', JSON.stringify(storedZipCodes));
        displayStoredZipCodes(storedZipCodes);
        document.getElementById(`weatherResult-${zipCode}`).remove();
    }
});