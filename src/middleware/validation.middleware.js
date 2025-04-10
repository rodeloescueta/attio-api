const logger = require("../utils/logger");
const config = require("../config");
const crypto = require("crypto");

/**
 * Validates that the incoming Attio webhook payload is authentic
 * by checking the signature from Attio
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateAttioPayload = (req, res, next) => {
  // Skip validation if webhook secret is not set (dev environment)
  if (!config.attio.webhookSecret) {
    logger.warn("Attio webhook secret not set, skipping signature validation");
    return next();
  }

  try {
    const signature = req.headers["x-attio-signature"];

    if (!signature) {
      logger.error("Missing Attio webhook signature");
      return res.status(401).json({ message: "Missing signature" });
    }

    // Verify the signature (implementation will depend on Attio's signature method)
    // This is a placeholder implementation - refer to Attio documentation for actual method
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac("sha256", config.attio.webhookSecret);
    const digest = hmac.update(payload).digest("hex");

    if (signature !== digest) {
      logger.error("Invalid Attio webhook signature");
      return res.status(401).json({ message: "Invalid signature" });
    }

    logger.info("Attio webhook signature validated");
    next();
  } catch (error) {
    logger.error("Error validating Attio webhook:", error);
    res.status(500).json({ message: "Error validating webhook" });
  }
};

module.exports = {
  validateAttioPayload,
};
