const winston = require('winston');

const customFormat = winston.format.printf(({ level, message, timestamp, context = 'Global' }) => {
    return `[${timestamp}] ${level.toUpperCase()} [${context}] - ${message}`;
});

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
});

const logger = {
    info: (msg, meta) => winstonLogger.info(msg, meta),
    error: (msg, meta) => winstonLogger.error(msg, meta),
    warn: (msg, meta) => winstonLogger.warn(msg, meta),
    debug: (msg, meta) => winstonLogger.debug(msg, meta),

    logRequest(method, url) {
        winstonLogger.info(`Requisicao iniciada: ${method.toUpperCase()} ${url}`, { context: 'ApiClient' });
    },
    
    logResponse(status, url, duration) {
        winstonLogger.info(`Resposta recebida: ${status} ${url} (${duration}ms)`, { context: 'ApiClient' });
    },
    
    logError(url, error) {
        winstonLogger.error(`Falha: ${url} - ${error.message}`, { context: 'ApiClient' });
    }
};

module.exports = logger;