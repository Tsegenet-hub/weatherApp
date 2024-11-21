package com.service.weather.service;

import com.service.weather.model.OpenWeatherMapResponse;
import com.service.weather.model.WeatherRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * The WeatherService class is responsible for fetching and processing weather data from the OpenWeatherMap API.
 * It retrieves weather information based on a provided zip code and converts the response into a WeatherRecord object.
 */
@Service
public class WeatherService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final String BASE_URL = "http://api.openweathermap.org/data/2.5/weather";
    private final String ICON_URL = "https://openweathermap.org/img/wn/";

    /**
     * Fetches weather data for a given zip code from the OpenWeatherMap API.
     *
     * @param zipCode the zip code for which to fetch the weather
     * @return a WeatherRecord object containing the fetched weather data
     */
    public WeatherRecord getWeatherByZipCode(String zipCode) {
        String url = String.format("%s?zip=%s,us&units=imperial&appid=%s", BASE_URL, zipCode, apiKey);
        OpenWeatherMapResponse response = restTemplate.getForObject(url, OpenWeatherMapResponse.class);

        if (response != null) {
            WeatherRecord record = new WeatherRecord();
            record.setZipCode(zipCode);
            record.setTemperature(response.getMain().getTemp());
            record.setFeelsLike(response.getMain().getFeels_like());
            record.setTempMin(response.getMain().getTemp_min());
            record.setTempMax(response.getMain().getTemp_max());
            record.setHumidity(response.getMain().getHumidity());
            record.setWindSpeed(response.getWind().getSpeed());
            record.setCity(response.getName());
            String iconCode = response.getWeather().get(0).getIcon();
            String iconUrl = String.format("%s%s@2x.png", ICON_URL, iconCode);
            record.setIcon(iconUrl);
            record.setConditionCode(response.getWeather().get(0).getId());
            return record;
        } else {
            throw new RuntimeException("Unable to fetch weather data");
        }
    }
}
