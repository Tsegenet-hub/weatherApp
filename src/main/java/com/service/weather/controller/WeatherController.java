package com.service.weather.controller;

import com.service.weather.model.WeatherRecord;
import com.service.weather.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping
    public WeatherRecord getWeatherByZipCode(@RequestParam String zipCode) {
        return weatherService.getWeatherByZipCode(zipCode);
    }

}

