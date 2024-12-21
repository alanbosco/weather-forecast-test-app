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

export default class WeatherService {
  constructor() {}

  getWeatherForecast({lat, lng, temperatureUnit, windSpeedUnit}: ForcastPayload ): Promise<ForecastModel> {
    return backendApi.get('weather/forecast', {lat, lng, temperatureUnit, windSpeedUnit});
  }
}
