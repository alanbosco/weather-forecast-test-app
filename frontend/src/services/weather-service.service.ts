import * as backendApi from '../shared/backend-api';
import { ForecastModel } from '@weather-app/shared';

export default class WeatherService {
  constructor() {}

  getWeatherForecast(lat: number, lng: number): Promise<ForecastModel> {
    return backendApi.get('weather/forecast', {lat, lng});
  }

}
