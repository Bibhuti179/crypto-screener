const calculateHeikinAshi = require("../utils/heikinAshi");
const calculateBollingerBands = require("../utils/bollingerBands");
const CONSTANTS = require("../config/constants");

function prepareIndicators(candles) {

    if (!candles || candles.length === 0) {
        return [];
    }

    // Convert Normal Candles to Heikin Ashi
    const haCandles = calculateHeikinAshi(candles);

    // Calculate Bollinger Bands on HA Close
    const bollingerBands = calculateBollingerBands(
        haCandles,
        CONSTANTS.BB_PERIOD,
        CONSTANTS.BB_STD_DEV
    );

    // Merge HA + BB
    const result = haCandles.map((candle, index) => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,

        upperBB: bollingerBands[index]?.upper ?? null,
        middleBB: bollingerBands[index]?.middle ?? null,
        lowerBB: bollingerBands[index]?.lower ?? null
    }));

    return result;
}

module.exports = {
    prepareIndicators
};