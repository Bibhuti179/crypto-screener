const CONSTANTS = {
    // CoinDCX API
    BASE_URL: "https://api.coindcx.com",

    // Candle Settings
  TIMEFRAME: "1h",
DAILY_TIMEFRAME: "1d",

    // Indicator Settings
    BB_PERIOD: 20,
    BB_STD_DEV: 2,

    // Number of Candles to Fetch
    HOURLY_CANDLE_LIMIT: 100,
    DAILY_CANDLE_LIMIT: 30,

    // Scheduler
    SCAN_DELAY_SECONDS: 10,

    // Timezone
    TIMEZONE: "Asia/Kolkata"
};

module.exports = CONSTANTS;