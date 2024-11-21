package com.service.weather;

import com.service.weather.model.ZipCode;
import com.service.weather.repository.ZipCodeRepository;
import com.service.weather.service.DataInitializer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

/**
 * The DataInitializerTest class tests the DataInitializer class to ensure that it initializes the database correctly.
 * It uses Mockito to mock the ZipCodeRepository and verifies interactions with it.
 */
@ExtendWith(MockitoExtension.class)
public class DataInitializerTest {

    @Mock
    private ZipCodeRepository zipCodeRepository;

    @InjectMocks
    private DataInitializer dataInitializer;

    @BeforeEach
    public void setUp() {
        // Ensure the mock repository is empty before each test
        when(zipCodeRepository.count()).thenReturn(0L);
    }

    @Test
    public void testInit() {
        when(zipCodeRepository.count()).thenReturn(0L);

        dataInitializer.init();

        verify(zipCodeRepository, times(1)).count();

        verify(zipCodeRepository, times(1)).save(argThat(zipCode ->
                zipCode.getCity().equals("New York") && zipCode.getZipCode().equals("10001")
        ));

        verify(zipCodeRepository, times(1)).save(argThat(zipCode ->
                zipCode.getCity().equals("San Francisco") && zipCode.getZipCode().equals("94114")
        ));

        verify(zipCodeRepository, times(1)).save(argThat(zipCode ->
                zipCode.getCity().equals("Plano") && zipCode.getZipCode().equals("75075")
        ));
    }

    @Test
    public void testInitWithExistingData() {
        // Simulate existing data in the repository
        when(zipCodeRepository.count()).thenReturn(3L);

        dataInitializer.init();

        verify(zipCodeRepository, never()).save(any(ZipCode.class));
    }
}
