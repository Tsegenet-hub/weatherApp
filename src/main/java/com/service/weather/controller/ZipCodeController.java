package com.service.weather.controller;

import com.service.weather.model.ZipCode;
import com.service.weather.service.ZipCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
