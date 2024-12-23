import axios from 'axios';
import { ErrorModel } from '../shared/server-response';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

const openMeteoApi = axios.create({
    baseURL: OPEN_METEO_BASE_URL,
});

export interface ForecastModel {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_weather_units: {
        time: string;
        interval: string;
        temperature: string;
        windspeed: string;
        winddirection: string;
        is_day: string;
        weathercode: string;
    };
    current_weather: {
        time: string;
        interval: number;
        temperature: number;
        windspeed: number;
        winddirection: number;
        is_day: number;
        weathercode: number;
    };
}

export enum TemperatureUnit {
    Fahrenheit = 'fahrenheit',
    Celsius = 'celsius',
}

export enum WindSpeedUnit {
    MPH = 'mph',
    KMH = 'kmh',
}

export interface ForecastParamsModel {
    latitude: number;
    longitude: number;
    current_weather: boolean;
    temperature_unit?: TemperatureUnit;
    wind_speed_unit?: WindSpeedUnit;
}

export interface WeeklyForecastModel {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    wind_speed_10m_max: string;
    wind_direction_10m_dominant: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export interface WeeklyForecastParamsModel {
    latitude: number;
    longitude: number;
    daily: string;
    temperature_unit?: TemperatureUnit;
    wind_speed_unit?: WindSpeedUnit;
}

export async function getWeatherForecast(
    lat: number,
    lng: number,
    temperatureUnit?: TemperatureUnit,
    windSpeedUnit?: WindSpeedUnit
): Promise<ForecastModel> {
    if (!lat || !lng) {
        throw new ErrorModel('WEATHER.INVALID_COORDINATES', 400);
    }
    const params: ForecastParamsModel = {
        latitude: lat,
        longitude: lng,
        current_weather: true,
    }

    if (temperatureUnit === TemperatureUnit.Fahrenheit) {
        params.temperature_unit = TemperatureUnit.Fahrenheit;
    }
    
    if (windSpeedUnit === WindSpeedUnit.MPH) {
        params.wind_speed_unit = WindSpeedUnit.MPH;
    }

    try {
        const response = await openMeteoApi.get<ForecastModel>('/forecast',
            {
                params: params
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new ErrorModel(
                'WEATHER.API_ERROR',
                error.response?.status || 500
            );
        }
        throw new ErrorModel('WEATHER.UNEXPECTED_ERROR', 500);
    }
}

export async function getWeeklyWeatherForecast(
    lat: number,
    lng: number,
    temperatureUnit?: TemperatureUnit,
    windSpeedUnit?: WindSpeedUnit
): Promise<WeeklyForecastModel> {
    if (!lat || !lng) {
        throw new ErrorModel('WEATHER.INVALID_COORDINATES', 400);
    }

    const params: WeeklyForecastParamsModel = {
        latitude: lat,
        longitude: lng,
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant',
    }

    if (temperatureUnit === TemperatureUnit.Fahrenheit) {
        params.temperature_unit = TemperatureUnit.Fahrenheit;
    }
    
    if (windSpeedUnit === WindSpeedUnit.MPH) {
        params.wind_speed_unit = WindSpeedUnit.MPH;
    }

    try {
        const response = await openMeteoApi.get<WeeklyForecastModel>('/forecast', {
            params: params
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new ErrorModel(
                'WEATHER.API_ERROR',
                error.response?.status || 500
            );
        }
        throw new ErrorModel('WEATHER.UNEXPECTED_ERROR', 500);
    }
}