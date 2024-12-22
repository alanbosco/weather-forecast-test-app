import * as backendApi from '../shared/backend-api';

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


export interface ForcastPayload {
  lat: number;
  lng: number;
  temperatureUnit?: TemperatureUnit;
  windSpeedUnit?: WindSpeedUnit;
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

export interface WeeklyForecastPayload {
    lat: number;
    lng: number;
    temperatureUnit?: TemperatureUnit;
    windSpeedUnit?: WindSpeedUnit;
}


export default class WeatherService {
  constructor() {}

  getWeatherForecast({lat, lng, temperatureUnit, windSpeedUnit}: ForcastPayload ): Promise<ForecastModel> {
    return backendApi.get('weather/forecast', {lat, lng, temperatureUnit, windSpeedUnit});
  }

  getWeeklyWeatherForecast({lat, lng, temperatureUnit, windSpeedUnit}: ForcastPayload ): Promise<WeeklyForecastModel> {
    return backendApi.get('weather/weekly-forecast', {lat, lng, temperatureUnit, windSpeedUnit});
  }
}
