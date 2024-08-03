package com.service.weather.service;

import com.service.weather.model.ZipCode;
import com.service.weather.repository.ZipCodeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataInitializer {

    @Autowired
    private ZipCodeRepository zipCodeRepository;

    @PostConstruct
    public void init() {
        // Check if zip codes are already in the database
        if (zipCodeRepository.count() == 0) {
            // Add initial zip codes
            zipCodeRepository.save(new ZipCode(null, "New York", "10001"));
            zipCodeRepository.save(new ZipCode(null, "San Francisco", "94114"));
            zipCodeRepository.save(new ZipCode(null, "Plano", "75075"));
        }
    }
}
