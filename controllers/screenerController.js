const { scanMarket } = require("../services/strategyService");

const {
    setLatestResult,
    getLatestResult
} = require("../services/resultStore");

const {
    formatIndianTime
} = require("../utils/time");

async function scanNow(req, res) {

    try {

        console.log("======================================");
        console.log("MANUAL SCAN STARTED");
        console.log("======================================");

        const signals = await scanMarket();

        const result = {

            success: true,

            lastScan: formatIndianTime(Date.now()),

            totalSignals: signals.length,

            data: signals

        };

        setLatestResult(result);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

function getLatest(req, res) {

    return res.status(200).json(getLatestResult());

}

module.exports = {

    scanNow,

    getLatest

};