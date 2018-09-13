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

        this.logger = logger;
        return logger;
    }
}

module.exports = RepkaNodeLogger;