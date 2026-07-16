function calculateHeikinAshi(candles) {
    if (!candles || candles.length === 0) {
        return [];
    }

    const haCandles = [];

    candles.forEach((candle, index) => {

        const open = Number(candle.open);
        const high = Number(candle.high);
        const low = Number(candle.low);
        const close = Number(candle.close);

        // HA Close
        const haClose = (open + high + low + close) / 4;

        let haOpen;

        if (index === 0) {
            // First Candle
            haOpen = (open + close) / 2;
        } else {
            // Remaining Candles
            haOpen =
                (haCandles[index - 1].open + haCandles[index - 1].close) / 2;
        }

        const haHigh = Math.max(high, haOpen, haClose);
        const haLow = Math.min(low, haOpen, haClose);

        haCandles.push({
            time: candle.time,
            open: haOpen,
            high: haHigh,
            low: haLow,
            close: haClose
        });

    });

    return haCandles;
}

module.exports = calculateHeikinAshi;