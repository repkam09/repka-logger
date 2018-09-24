const RLogger = require("./logger");

console.log("Starting up log tester");
const logger = new RLogger("log.repkam09.com", "/logger/stream", "repkadev.log", "repkadev");
//const logger = new RLogger(null, null, "repkadev.log", "repkadev");

logger.info("About to change prefix for test");
logger.setPrefix("repkadev_initial_prefix");
logger.info("info");
logger.warn("warn");
logger.error("error");

logger.wrapLoggerRaw((level, message) => {
    console.log("c:  '" + level + "' : " + message);
});

console.log(logger.version());

setInterval(() => {
    const rand = getRandomInt(5);

    if (rand === 0) {
        console.log("info");
        logger.info("this is a test info level message");
    }

    if (rand === 1) {
        console.log("warn");
        logger.warn("this is a test warn level message");
    }

    if (rand === 2) {
        console.log("error");
        logger.log({ level: "error", message: "this is a test error level message" });
    }

    if (rand === 3) {
        console.log("Changing to prefix 3");
        logger.setPrefix("repkadev_3");
    }

    if (rand === 4) {
        console.log("Changing to prefix 4");
        logger.setPrefix("repkadev_4");
    }

}, 2000);

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}