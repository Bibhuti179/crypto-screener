function calculateBollingerBands(candles, period = 20, stdDev = 2) {

    if (!candles || candles.length < period) {
        return [];
    }

    const bands = [];

    for (let i = 0; i < candles.length; i++) {

        // Not enough candles
        if (i < period - 1) {
            bands.push({
                upper: null,
                middle: null,
                lower: null
            });
            continue;
        }

        // Last 'period' closes
        const closes = [];

        for (let j = i - period + 1; j <= i; j++) {
            closes.push(Number(candles[j].close));
        }

        // SMA
        const sum = closes.reduce((a, b) => a + b, 0);
        const sma = sum / period;

        // Variance
        const variance =
            closes.reduce((total, value) => {
                return total + Math.pow(value - sma, 2);
            }, 0) / period;

        // Standard Deviation
        const standardDeviation = Math.sqrt(variance);

        bands.push({
            upper: sma + (standardDeviation * stdDev),
            middle: sma,
            lower: sma - (standardDeviation * stdDev)
        });
    }

    return bands;
}

module.exports = calculateBollingerBands;