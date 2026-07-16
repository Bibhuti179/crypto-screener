const { scanMarket } = require("./strategyService");
const {
    setLatestResult
} = require("./resultStore");

const {
    formatIndianTime
} = require("../utils/time");
const {
    getNextScanDelay
} = require("../utils/time");

function startScheduler() {

    console.log("======================================");
    console.log("AUTO SCANNER STARTED");
    console.log("======================================");

    scheduleNextScan();

}

function scheduleNextScan() {

    const delay = getNextScanDelay();

    const nextScan = new Date(Date.now() + delay);

    console.log("--------------------------------------");
    console.log(
        `Next Scan : ${nextScan.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
        })}`
    );
    console.log("--------------------------------------");

    setTimeout(async () => {

        try {

            console.log("======================================");
            console.log("SCANNING STARTED");
            console.log("======================================");

            const signals = await scanMarket();
            setLatestResult({

    success: true,

    lastScan: formatIndianTime(Date.now()),

    totalSignals: signals.length,

    data: signals

});

            console.log("======================================");
            console.log(`TOTAL SIGNALS : ${signals.length}`);
            console.log("======================================");

            if (signals.length) {

                console.table(signals);

            } else {

                console.log("No Signal Found");

            }

        } catch (error) {

            console.log(error.message);

        }

        // Schedule Again
        scheduleNextScan();

    }, delay);

}

module.exports = startScheduler;