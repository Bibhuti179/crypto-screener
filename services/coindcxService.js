const axios = require("axios");
const CONSTANTS = require("../config/constants");

const publicAPI = axios.create({
    baseURL: "https://public.coindcx.com",
    timeout: 30000
});

const privateAPI = axios.create({
    baseURL: CONSTANTS.BASE_URL,
    timeout: 30000
});

// Get All Active Futures Symbols
async function getFuturesSymbols() {
    try {

        const { data } = await privateAPI.get(
            "/exchange/v1/derivatives/futures/data/active_instruments"
        );

        return data;

    } catch (error) {

        console.log("Error Fetching Symbols :", error.message);

        return [];
    }
}

// Get Historical Candles
async function getCandles(pair, resolution, limit) {

    try {

        const now = Math.floor(Date.now() / 1000);

        const from =
            now -
            Math.floor(getIntervalMilliseconds(resolution) / 1000) * limit;

        const { data } = await publicAPI.get(
            "/market_data/candlesticks",
            {
                params: {
                    pair,
                    from,
                    to: now,
                    resolution,
                    pcode: "f"
                }
            }
        );

        if (data.s !== "ok") {
            return [];
        }

        return data.data
            .map(candle => ({
                time: Number(candle.time),
                open: Number(candle.open),
                high: Number(candle.high),
                low: Number(candle.low),
                close: Number(candle.close),
                volume: Number(candle.volume)
            }))
            .sort((a, b) => a.time - b.time);

    } catch (error) {

        console.log(`${pair} Candle Error : ${error.message}`);

        return [];
    }
}
// Resolution to Milliseconds
function getIntervalMilliseconds(resolution) {

    switch (resolution) {

        case "1":
            return 60 * 1000;

        case "5":
            return 5 * 60 * 1000;

        case "15":
            return 15 * 60 * 1000;

        case "30":
            return 30 * 60 * 1000;

        case "60":
            return 60 * 60 * 1000;

        case "240":
            return 4 * 60 * 60 * 1000;

        case "1D":
            return 24 * 60 * 60 * 1000;

        default:
            return 60 * 60 * 1000;
    }

}

module.exports = {
    getFuturesSymbols,
    getCandles
};