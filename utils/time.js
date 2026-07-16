function formatIndianTime(timestamp) {
    return new Date(timestamp).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}

function getNextScanDelay() {

    const now = new Date();

    const next = new Date(now);

    next.setMinutes(30);
    next.setSeconds(10);
    next.setMilliseconds(0);

    if (
        now.getMinutes() > 30 ||
        (now.getMinutes() === 30 && now.getSeconds() >= 10)
    ) {
        next.setHours(next.getHours() + 1);
    }

    return next.getTime() - now.getTime();
}

module.exports = {
    formatIndianTime,
    getNextScanDelay
};