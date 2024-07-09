package com.service.weather.controller;

import com.service.weather.model.WeatherRecord;
import com.service.weather.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping
    public WeatherRecord getWeatherByZipCode(@RequestParam String zipCode) {
        return weatherService.getWeatherByZipCode(zipCode);
    }

//    @PostMapping("/add")
//    public WeatherRecord addWeatherRecord(@RequestParam String zipCode, @RequestParam double temperature) {
//        return weatherService.saveWeatherRecord(zipCode, temperature);
//    }
//
//    @GetMapping("/all")
//    public List<WeatherRecord> getAllWeatherRecords() {
//        return weatherService.getAllRecords();
//    }
}

