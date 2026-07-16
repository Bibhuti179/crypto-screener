const CONSTANTS = require("../config/constants");

const {
    getFuturesSymbols,
    getCandles
} = require("./coindcxService");

const {
    prepareIndicators
} = require("./indicatorService");

const {
    formatIndianTime
} = require("../utils/time");

const {
    isGreen,
    isRed,
    isDoji,
    touchUpperBB,
    crossMiddleBB,
    closeAboveMiddleBB
} = require("../utils/candleHelper");

async function scanMarket() {

    console.log("======================================");
    console.log("Starting Crypto Screener...");
    console.log("======================================");

    const symbols = await getFuturesSymbols();

    if (!symbols.length) {

        console.log("No Futures Symbols Found");

        return [];
    }

    console.log(`Total Futures Symbols : ${symbols.length}`);

    const signals = [];

    for (const symbol of symbols) {

        try {

           // console.log(`Scanning : ${symbol}`); // this is original
            //debug start
            console.log("\n================================================");
console.log(`Scanning : ${symbol}`);
console.log("================================================");
            //debug end
            const hourlyCandles = await getCandles(
                symbol,
                CONSTANTS.TIMEFRAME,
                CONSTANTS.HOURLY_CANDLE_LIMIT
            );

            if (!hourlyCandles) {
    console.log("❌ hourlyCandles is null");
    continue;
}

console.log(`Hourly Candles : ${hourlyCandles.length}`);

if (hourlyCandles.length < CONSTANTS.BB_PERIOD + 5) {
    console.log("❌ Not enough hourly candles");
    continue;
}

            const hourlyData = prepareIndicators(hourlyCandles);

            const currentIndex = hourlyData.length - 2;

            const current = hourlyData[currentIndex];

            const previous = hourlyData[currentIndex - 1];

            if (!current) {
    console.log("❌ Current candle missing");
    continue;
}

if (!previous) {
    console.log("❌ Previous candle missing");
    continue;
}

if (current.middleBB === null) {
    console.log("❌ Current Middle BB is NULL");
    continue;
}

if (previous.middleBB === null) {
    console.log("❌ Previous Middle BB is NULL");
    continue;
}

console.log("✔ Current & Previous candles loaded");
console.log("✔ Bollinger Bands loaded");

            // Current Candle Condition
            /*if (!isRed(current)) {
                continue;
            }  // rthis is original code
            */
           // debug start
           if (!isRed(current)) {
    console.log("❌ Current Candle is NOT RED");
    console.log("Rejected\n");
    continue;
}

console.log("✔ Current Candle is RED");
           //debug ends

            /*if (!crossMiddleBB(current)) {
                continue;
            } // this is original code
            */
           // debug start
           if (!crossMiddleBB(current)) {
    console.log("❌ Current Candle did NOT cross Middle BB");

    console.log(`Open      : ${current.open}`);
    console.log(`Close     : ${current.close}`);
    console.log(`Middle BB : ${current.middleBB}`);

    console.log("Rejected\n");

    continue;
}

console.log("✔ Current Candle crossed Middle BB");
           //debug ends

            // Previous Candle Condition
            /*if (!isRed(previous)) {
                continue;
            }// this is original code
            */
           // debug start
            if (!isRed(previous)) {
    console.log("❌ Previous Candle is NOT RED");
    console.log("Rejected\n");
    continue;
}

console.log("✔ Previous Candle is RED");
           // debug ends

            /*if (!closeAboveMiddleBB(previous)) {
                continue;
            }// this is original code
            */
           // debug start
           if (!closeAboveMiddleBB(previous)) {

    console.log("❌ Previous Candle did NOT close above Middle BB");

    console.log(`Close     : ${previous.close}`);
    console.log(`Middle BB : ${previous.middleBB}`);

    console.log("Rejected\n");

    continue;
}

console.log("✔ Previous Candle closed above Middle BB");

           // debug ends

            /*
            ==========================================
            PART-2 STARTS FROM HERE
            ==========================================
            */
                       // ==================================================
            // Find First Green Candle Going Backwards
            // ==================================================

            let greenIndex = -1;

            for (let i = currentIndex - 2; i >= 0; i--) {

                const candle = hourlyData[i];

                if (candle.middleBB === null) {
                    continue;
                }

                if (isGreen(candle)) {
                    greenIndex = i;
                    break;
                }

            }

            // No Green Candle Found
if (greenIndex === -1) {

    console.log("❌ Previous GREEN candle NOT found");

    console.log("Rejected\n");

    continue;
}

console.log("✔ Previous GREEN candle found");

            const greenCandle = hourlyData[greenIndex];

            // Green Candle Must Touch Upper BB
            if (!touchUpperBB(greenCandle)) {

    console.log("❌ GREEN candle did NOT touch Upper BB");

    console.log(`High      : ${greenCandle.high}`);
    console.log(`Upper BB  : ${greenCandle.upperBB}`);

    console.log("Rejected\n");

    continue;
}

console.log("✔ GREEN candle touched Upper BB");

            // ==================================================
            // Fetch Daily Candle Only After Hourly Conditions Pass
            // ==================================================

            const dailyCandles = await getCandles(
    symbol,
    CONSTANTS.DAILY_TIMEFRAME,
    CONSTANTS.DAILY_CANDLE_LIMIT
);

if (!dailyCandles) {

    console.log("❌ Daily candles are NULL");
    console.log("Rejected\n");

    continue;
}

console.log(`Daily Candles : ${dailyCandles.length}`);

if (dailyCandles.length < CONSTANTS.BB_PERIOD + 2) {

    console.log("❌ Not enough Daily candles");
    console.log("Rejected\n");

    continue;
}

console.log("✔ Daily candles loaded");

            const dailyData = prepareIndicators(dailyCandles);

            const yesterdayIndex = dailyData.length - 3;

            const yesterday = dailyData[yesterdayIndex];

if (!yesterday) {

    console.log("❌ Yesterday Daily Candle Missing");
    console.log("Rejected\n");

    continue;
}

if (yesterday.upperBB === null) {

    console.log("❌ Yesterday Upper BB is NULL");
    console.log("Rejected\n");

    continue;
}

console.log("✔ Yesterday Daily Candle Loaded");

            /*
            ==========================================
            PART-3 STARTS FROM HERE
            ==========================================
            */
                       // ==========================================
            // Daily Confirmation
            // ==========================================

            let isValidSignal = false;

            // Case 1
            if (isRed(yesterday)) {

    console.log("✔ Yesterday Daily Candle is RED");

    isValidSignal = true;

}

            // Case 2
            else if (
    isGreen(yesterday) &&
    touchUpperBB(yesterday)
) {

    console.log("✔ Yesterday GREEN touched Upper BB");

    isValidSignal = true;

}

            // Case 3
            else if (
    isGreen(yesterday) &&
    isDoji(yesterday)
) {

    console.log("✔ Yesterday GREEN Doji");

    isValidSignal = true;

}

            // Case 4
            else if (isGreen(yesterday)) {

                const previousDay = dailyData[yesterdayIndex - 1];

                if (
    previousDay &&
    previousDay.upperBB !== null &&
    isRed(previousDay)
) {

    console.log("✔ Previous Daily Candle is RED");

    isValidSignal = true;

}
else {

    console.log("❌ Previous Daily Candle is GREEN");

}

            }

            // ==========================================
            // Create Signal
            // ==========================================

            if (isValidSignal) {

                signals.push({
                    symbol,

                    candleTime: formatIndianTime(current.time),

                    high: Number(current.high),

                    low: Number(current.low)
                });

                console.log("--------------------------------------");
                console.log(`Signal : ${symbol}`);
                console.log(`Time   : ${formatIndianTime(current.time)}`);
                console.log(`High   : ${current.high}`);
                console.log(`Low    : ${current.low}`);
                console.log("--------------------------------------");

            }

            /*
            ==========================================
            PART-4 STARTS FROM HERE
            ==========================================
            */

            

                } catch (error) {

            console.log(`${symbol} : ${error.message}`);

        }

    }

    console.log("======================================");
    console.log("SCANNING COMPLETED");
    console.log("======================================");
    console.log(`Total Signals : ${signals.length}`);

    return signals;

}

module.exports = {
    scanMarket
};