const winston = require('winston')

/**
 * Logger wrapper for application request tracing and error logging.
 */
const customFormat = winston.format.printf(({ level, message, timestamp, context = 'Global' }) => {
    return `[${timestamp}] ${level.toUpperCase()} [${context}] - ${message}`
})

const winstonLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                customFormat
            )
        }),
        new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/test-execution.log' })
    ]
})

const logger = {
    /**
     * Log an informational message.
     * @param {string} msg - Log message.
     * @param {object} [meta] - Optional metadata.
     */
    info: (msg, meta) => winstonLogger.info(msg, meta),

    /**
     * Log an error message.
     * @param {string} msg - Log message.
     * @param {object} [meta] - Optional metadata.
     */
    error: (msg, meta) => winstonLogger.error(msg, meta),

    /**
     * Log a warning message.
     * @param {string} msg - Log message.
     * @param {object} [meta] - Optional metadata.
     */
    warn: (msg, meta) => winstonLogger.warn(msg, meta),

    /**
     * Log a debug message.
     * @param {string} msg - Log message.
     * @param {object} [meta] - Optional metadata.
     */
    debug: (msg, meta) => winstonLogger.debug(msg, meta),

    /**
     * Log an outgoing API request.
     * @param {string} method - HTTP method.
     * @param {string} url - Request URL.
     */
    logRequest(method, url) {
        winstonLogger.info(`Requisicao iniciada: ${method.toUpperCase()} ${url}`, {
            context: 'ApiClient'
        })
    },

    /**
     * Log an API response with timing.
     * @param {number} status - HTTP status code.
     * @param {string} url - Request URL.
     * @param {number} duration - Duration in milliseconds.
     */
    logResponse(status, url, duration) {
        winstonLogger.info(`Resposta recebida: ${status} ${url} (${duration}ms)`, {
            context: 'ApiClient'
        })
    },

    /**
     * Log an API error.
     * @param {string} url - Request URL.
     * @param {Error} error - Error instance.
     */
    logError(url, error) {
        winstonLogger.error(`Falha: ${url} - ${error.message}`, { context: 'ApiClient' })
    }
}

module.exports = logger
