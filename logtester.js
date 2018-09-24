const RLogger = require("./logger");

console.log("Starting up log tester");
const logger = new RLogger("log.repkam09.com", "/logger/stream", "repkadev.log", "repkadev");
//const logger = new RLogger(null, null, "repkadev.log", "repkadev");

// Grab the logger version number and print it out
console.log("logger version: " + logger.version());


// Test some normal logging level calls
console.log("running normal log level tests");
logger.info("info log message");
logger.warn("warn log message");
logger.error("error log message");
logger.verbose("verbose log message");

// Test the update prefix feature
console.log("running update prefix tests");
logger.info("info log message with original prefix");
logger.setPrefix("repkadev_new_prefix");
logger.info("info log message with new prefix");
logger.setPrefix("repkadev");
logger.info("info log message with original prefix");


// Test some error cases, invalid calls, etc
console.log("running error case tests");
logger.log(null);
logger.log("test");

// Turn on the log wrapping feature
console.log("running log wrapper prefix tests");
logger.wrapLoggerRaw((level, message) => {
    console.log("c:  '" + level + "' : " + message);
});

logger.info("This should be handled by the log wrapper as well");

// Test log warpper function throwing an error
logger.wrapLoggerRaw((level, message) => {
    console.log("c:  '" + level + "' : " + message);
    throw new Error("Some problem in the log wrapper");
});

logger.info("This should throw an error in the log wrapper");

// Turn off the log wrapping feature
logger.wrapLoggerRaw(null);


logger.info("This should not be handled by the log wrapper ");


