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
    // Get signature from header (Attio sends both Attio-Signature and X-Attio-Signature)
    const signature =
      req.headers["attio-signature"] || req.headers["x-attio-signature"];

    if (!signature) {
      logger.error("Missing Attio webhook signature");
      return res.status(401).json({ message: "Missing signature" });
    }

    // Verify the signature using SHA-256 HMAC
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac("sha256", config.attio.webhookSecret);
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    // Use timing-safe comparison to prevent timing attacks
    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
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
