let latestResult = {
    success: true,
    lastScan: "",
    totalSignals: 0,
    data: []
};

function setLatestResult(result) {
    latestResult = result;
}

function getLatestResult() {
    return latestResult;
}

module.exports = {
    setLatestResult,
    getLatestResult
};