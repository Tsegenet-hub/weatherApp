package com.service.weather;

import com.service.weather.model.ZipCode;
import com.service.weather.repository.ZipCodeRepository;
import com.service.weather.service.ZipCodeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ZipCodeServiceTest {

    @Mock
    private ZipCodeRepository zipCodeRepository;

    @InjectMocks
    private ZipCodeService zipCodeService;

    private ZipCode zipCode1;
    private ZipCode zipCode2;

    @BeforeEach
    public void setUp() {
        zipCode1 = new ZipCode(1L, "City1", "10001");
        zipCode2 = new ZipCode(2L, "City2", "10002");
    }

    @Test
    public void testGetAllZipCodes() {
        when(zipCodeRepository.findAll()).thenReturn(Arrays.asList(zipCode1, zipCode2));
        List<ZipCode> zipCodes = zipCodeService.getAllZipCodes();
        assertEquals(2, zipCodes.size());
        verify(zipCodeRepository, times(1)).findAll();
    }

    @Test
    public void testAddZipCode() {
        when(zipCodeRepository.save(zipCode1)).thenReturn(zipCode1);
        ZipCode savedZipCode = zipCodeService.addZipCode(zipCode1);
        assertNotNull(savedZipCode);
        assertEquals("10001", savedZipCode.getZipCode());
        verify(zipCodeRepository, times(1)).save(zipCode1);
    }

    @Test
    public void testRemoveZipCode() {
        doNothing().when(zipCodeRepository).deleteById(1L);
        zipCodeService.removeZipCode(1L);
        verify(zipCodeRepository, times(1)).deleteById(1L);
    }
}
