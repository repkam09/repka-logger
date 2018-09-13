const RLogger = require("./logger");

console.log("Starting up log tester");
const logger = new RLogger("log.repkam09.com", "/logger/stream", "repkadev.log", "repkadev");

setInterval(() => {
    const rand = getRandomInt(3);

    if (rand === 0) {
        logger.log({ level: "info", message: "this is a test info level message" });
    }

    if (rand === 1) {
        logger.log({ level: "warn", message: "this is a test warn level message" });
    }

    if (rand === 2) {
        logger.log({ level: "error", message: "this is a test error level message" });
    }

}, 2000);

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}