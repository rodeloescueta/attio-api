const winston = require("winston");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "attio-integration-api" },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    // Write to all logs with level 'info' and below to combined.log
    new winston.transports.File({ filename: "logs/combined.log" }),
    // Write all logs error (and below) to error.log
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  // Prevents exit on uncaught exceptions
  exitOnError: false,
});

module.exports = logger;
