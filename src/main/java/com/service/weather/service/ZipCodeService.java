package com.service.weather.service;

import com.service.weather.model.ZipCode;
import com.service.weather.repository.ZipCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZipCodeService {

    @Autowired
    private ZipCodeRepository zipCodeRepository;

    public List<ZipCode> getAllZipCodes() {
        return zipCodeRepository.findAll();
    }

    public ZipCode addZipCode(ZipCode zipCode) {
        return zipCodeRepository.save(zipCode);
    }

    public void removeZipCode(Long id) {
        zipCodeRepository.deleteById(id);
    }
}
