import axios from 'axios';
import { ErrorModel } from '../shared/server-response';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

const openMeteoApi = axios.create({
    baseURL: OPEN_METEO_BASE_URL,
});

export interface ForecastModel {
    latitude: number,
    longitude: number,
    elevation: number,
    current_weather: {
        temperature: number,
        windspeed: number,
        winddirection: number,
        weathercode: number,
        time: Date
    }
}

export async function getWeatherForecast(lat: number, lng: number): Promise<ForecastModel> {
    if (!lat || !lng) {
        throw new ErrorModel('WEATHER.INVALID_COORDINATES', 400);
    }

    try {
        const response = await openMeteoApi.get<ForecastModel>('/forecast',
            {
                params: {
                    latitude: lat,
                    longitude: lng,
                    current_weather: true
                }
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
