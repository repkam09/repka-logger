const RLogger = require("./logger");

console.log("Starting up log tester");
const logger = new RLogger("repkadev.log", "repkadev_initial");
logger.enableNetwork("logs.kaspe.com", "/logger/v2/stream");

// Grab the logger version number and print it out
console.log("logger version: " + logger.version());

// Test some normal logging level calls
console.log("running normal log level tests");
logger.info("info log message");
logger.warn("warn log message");
logger.error("error log message");
logger.verbose("verbose log message");

// Set a new prefix
logger.setPrefix("new_prefix");


// Test enabling the network logger
console.log("network running normal log level tests");
logger.info("network info log message");
logger.warn("network warn log message");
logger.error("network error log message");
logger.verbose("network verbose log message");
logger.disableNetwork();

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
    console.log("native wrapper:  '" + level + "' : " + message);
});

logger.info("This should be handled by the log wrapper as well");

// Test log warpper function throwing an error
logger.info("This should throw an error in the log wrapper");
logger.wrapLoggerRaw((level, message) => {
    console.log("native wrapper pre error:  '" + level + "' : " + message);
    throw new Error("Some problem in the log wrapper");
});


// Turn off the log wrapping feature
logger.wrapLoggerRaw(null);
logger.info("This should not be handled by the log wrapper ");


