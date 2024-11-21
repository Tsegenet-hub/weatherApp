package com.service.weather.controller;

import com.service.weather.model.ZipCode;
import com.service.weather.service.ZipCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * The ZipCodeController class handles HTTP requests related to zip codes.
 * It provides endpoints to fetch all zip codes, add a new zip code, and remove an existing zip code.
 */
@RestController
@RequestMapping("/api/zipcodes")
public class ZipCodeController {

    @Autowired
    private ZipCodeService zipCodeService;

    @GetMapping
    public List<ZipCode> getAllZipCodes() {
        return zipCodeService.getAllZipCodes();
    }

    @PostMapping
    public ZipCode addZipCode(@RequestBody ZipCode zipCode) {
        return zipCodeService.addZipCode(zipCode);
    }

    @DeleteMapping("/{id}")
    public void removeZipCode(@PathVariable Long id) {
        zipCodeService.removeZipCode(id);
    }
}
