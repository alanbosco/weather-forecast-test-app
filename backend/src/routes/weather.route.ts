import express from 'express';
import { sendError, sendResponse } from '../shared/server-response';
import * as weatherService from '../services/weather.service';
import { ForecastModel, TemperatureUnit, WindSpeedUnit, WeeklyForecastModel } from '../services/weather.service';

const router = express.Router();

router.get('/forecast', async function (req, res) {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const temperatureUnit = req.query.temperatureUnit as TemperatureUnit;
    const windSpeedUnit = req.query.windSpeedUnit as WindSpeedUnit;

    let response : ForecastModel;
    try {
        response = await weatherService.getWeatherForecast(lat, lng, temperatureUnit, windSpeedUnit);
    } catch (e) {
        return sendError(res, e);
    }

  return sendResponse(res, response);
});

router.get('/weekly-forecast', async function (req, res) {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const temperatureUnit = req.query.temperatureUnit as TemperatureUnit;
    const windSpeedUnit = req.query.windSpeedUnit as WindSpeedUnit;

    let response : WeeklyForecastModel;
    try {
        response = await weatherService.getWeeklyWeatherForecast(lat, lng, temperatureUnit, windSpeedUnit);
    } catch (e) {
        return sendError(res, e);
    }

  return sendResponse(res, response);
});

module.exports = router;
