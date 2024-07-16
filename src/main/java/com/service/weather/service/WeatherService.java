package com.service.weather.service;

import com.service.weather.model.OpenWeatherMapResponse;
import com.service.weather.model.WeatherRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final String BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

    public WeatherRecord getWeatherByZipCode(String zipCode) {
        String url = String.format("%s?zip=%s,us&units=imperial&appid=%s", BASE_URL, zipCode, apiKey);
        OpenWeatherMapResponse response = restTemplate.getForObject(url, OpenWeatherMapResponse.class);

        if (response != null) {
            WeatherRecord record = new WeatherRecord();
            record.setZipCode(zipCode);
            record.setTemperature(response.getMain().getTemp());
            return record;
        } else {
            throw new RuntimeException("Unable to fetch weather data");
        }
    }
}
