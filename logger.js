const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const pkg = require("./package.json");

/**
 * This class implements a generic logger on top of Winston
 * this should be used for all vgr-* projects to log to the central logging server
 */
class RepkaNodeLogger {

    /**
     * 
     * @param {string} server the hostname of the server where logs are reported
     * @param {string} path the api path of the server where logs are reported
     * @param {string} logfile path to a log file that should be appended to
     * @param {string} textlabel a prefix label for this logger
     * @param {boolearn} ssl should ssl be used for the network logger
     */
    constructor(server, path, logfile, textlabel = "logger", ssl = true) {

        const logger = createWinstonLogger(server, path, logfile, textlabel, ssl);

        this.logger = logger;

        this.server = server;
        this.path = path;
        this.logfile = logfile;
        this.textlabel = textlabel;
        this.ssl = ssl;
        this.logproxyraw = false;
    }

    /**
     * This function is a direct passthrough to the Winston logger.log( ) function call
     * 
     * @param {Object} settings Any settings supported by Winston
     */
    log(settings) {
        doLog.call(this, settings);
    }

    version() {
        let ver = "unknown";

        if (pkg && pkg.version) {
            ver = pkg.version;
        }

        return ver;
    }

    /**
     * This function takes a string and logs it at verbose level
     * @param {String} message Any log message
     */
    verbose(message) {
        proxyLog.call(this, message, "verbose");
        doLog.call(this, { level: "verbose", message: message });
    }

    /**
    * This function takes a string and logs it at info level
    * @param {String} message Any log message
    */
    info(message) {
        proxyLog.call(this, message, "info");
        doLog.call(this, { level: "info", message: message });
    }

    /**
    * This function takes a string and logs it at error level
    * @param {String} message Any log message
    */
    error(message) {
        proxyLog.call(this, message, "error");
        doLog.call(this, { level: "error", message: message });
    }

    /**
    * This function takes a string and logs it at debug level
    * @param {String} message Any log message
    */
    debug(message) {
        proxyLog.call(this, message, "verbose");
        doLog.call(this, { level: "verbose", message: message });
    }

    /**
    * This function takes a string and logs it at warn level
    * @param {String} message Any log message
    */
    warn(message) {
        proxyLog.call(this, message, "warn");
        doLog.call(this, { level: "warn", message: message });
    }

    /**
    * This function takes a string prefix and uses that for subsequent log messages
    * this will appear as part of the json data sent to the log server.
    * 
    * It can be used to differentiate between differnet systems by some unique id
    * 
    * @param {String} message Any log message
    */
    setPrefix(prefix) {
        this.previous = this.logger;
        this.logger = null;
        try {
            this.logger = createWinstonLogger(this.server, this.path, this.logfile, prefix, this.ssl);
            this.previous = null;
        } catch (error) {
            this.logger = this.previous;
        }
    }

    /**
     * 
     * @param {function} func a function to run that takes in a level and message
     */
    wrapLoggerRaw(func) {
        this.logproxyraw = func;
    }
}


/**
 * This function does the real logging call with error handling.
 * @param {Object} object Settings object for Winston
 */
function doLog(object) {
    try {
        this.logger.log(object);
    } catch (error) {

    }
}


function proxyLog(message, level) {
    if (this.logproxyraw) {
        try {
            this.logproxyraw(level, message);
        } catch (err) {

        }
    }
}


/**
 * Helper function to create a new Winston logger from a set of parameters
 * @param {*} server 
 * @param {*} path 
 * @param {*} logfile 
 * @param {*} textlabel 
 * @param {*} ssl 
 */
function createWinstonLogger(server, path, logfile, textlabel, ssl) {
    const logger = createLogger({
        level: "debug",
        format: combine(timestamp(), label({ label: textlabel }), prettyPrint()),
        transports: [new transports.Console({ format: format.simple() })]
    });

    if (server && path) {
        if (ssl) {
            logger.add(new transports.Http({ host: server, port: 443, path: path, ssl: true }));
        } else {
            logger.add(new transports.Http({ host: server, port: 80, path: path, ssl: false }));
        }
    }

    if (logfile) {
        logger.add(new transports.File({ filename: logfile, format: format.simple() }));
    }

    return logger;
}

module.exports = RepkaNodeLogger;