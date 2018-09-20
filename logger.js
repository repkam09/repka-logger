const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

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
    }

    log(settings) {
        return this.logger.log(settings);
    }

    verbose(message) {
        return this.logger.log({ level: "verbose", message: message });
    }

    info(message) {
        return this.logger.log({ level: "info", message: message });
    }

    error(message) {
        return this.logger.log({ level: "error", message: message });
    }

    debug(message) {
        return this.logger.log({ level: "verbose", message: message });
    }

    warn(message) {
        return this.logger.log({ level: "warn", message: message });
    }

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
}

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