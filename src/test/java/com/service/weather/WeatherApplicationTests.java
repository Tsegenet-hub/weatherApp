package com.service.weather;

import com.service.weather.model.OpenWeatherMapResponse;
import com.service.weather.model.WeatherRecord;
import com.service.weather.service.WeatherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WeatherApplicationTests {


	@Mock
	private RestTemplate restTemplate;

	@InjectMocks
	private WeatherService weatherService;

	@Value("${openweathermap.api.key}")
	private String apiKey;

	private final String zipCode = "90210";
	private OpenWeatherMapResponse mockResponse;

	@BeforeEach
	public void setUp() {
		mockResponse = new OpenWeatherMapResponse();
		OpenWeatherMapResponse.Main main = new OpenWeatherMapResponse.Main();
		main.setTemp(72.0);
		main.setFeels_like(70.0);
		main.setTemp_min(68.0);
		main.setTemp_max(75.0);
		main.setHumidity(50);
		OpenWeatherMapResponse.Wind wind = new OpenWeatherMapResponse.Wind();
		wind.setSpeed(5.0);
		OpenWeatherMapResponse.Weather weather = new OpenWeatherMapResponse.Weather();
		mockResponse.setMain(main);
		mockResponse.setWind(wind);
		mockResponse.setWeather(Arrays.asList(weather));
		mockResponse.setName("New York");

		when(restTemplate.getForObject(anyString(), any())).thenReturn(mockResponse);
	}

	@Test
	public void testGetWeatherByZipCode() {
		WeatherRecord result = weatherService.getWeatherByZipCode(zipCode);

		assertNotNull(result);
		assertEquals(zipCode, result.getZipCode());
		assertEquals(72.0, result.getTemperature());
		assertEquals(70.0, result.getFeelsLike());
		assertEquals(68.0, result.getTempMin());
		assertEquals(75.0, result.getTempMax());
		assertEquals(50, result.getHumidity());
		assertEquals(5.0, result.getWindSpeed());
		assertEquals("New York", result.getCity());
	}

}
