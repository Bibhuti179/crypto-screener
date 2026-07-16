function isGreen(candle) {
    return candle.close > candle.open;
}

function isRed(candle) {
    return candle.close < candle.open;
}

function isDoji(candle) {
    const body = Math.abs(candle.close - candle.open);
    const range = candle.high - candle.low;

    if (range === 0) return true;

    return body <= range * 0.1;
}

function touchUpperBB(candle) {
    return candle.high >= candle.upperBB;
}

function touchMiddleBB(candle) {
    return candle.low <= candle.middleBB && candle.high >= candle.middleBB;
}

function crossMiddleBB(candle) {
    return (
        candle.open > candle.middleBB &&
        candle.close < candle.middleBB
    );
}

function closeAboveMiddleBB(candle) {
    return candle.close > candle.middleBB;
}

module.exports = {
    isGreen,
    isRed,
    isDoji,
    touchUpperBB,
    touchMiddleBB,
    crossMiddleBB,
    closeAboveMiddleBB
};