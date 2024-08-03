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

import java.util.Arrays;

import static org.mockito.Mockito.*;

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
        dataInitializer.init();

        verify(zipCodeRepository, times(1)).saveAll(
            Arrays.asList(
                    new ZipCode(null, "Plano", "75075"),
                    new ZipCode(null, "New York", "10001"),
                    new ZipCode(null, "San Francisco", "94114")
            )
        );
    }

    @Test
    public void testInitWithExistingData() {
        // Simulate existing data in the repository
        when(zipCodeRepository.count()).thenReturn(3L);

        dataInitializer.init();

        verify(zipCodeRepository, never()).save(any(ZipCode.class));
    }
}
