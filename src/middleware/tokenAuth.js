/**
 * Token Authentication Middleware
 *
 * This middleware provides token-based authentication for client-facing views.
 * It verifies that tokens provided in URL parameters are valid and have not expired.
 *
 * Note: This is a simplified implementation. In a real implementation, you would
 * validate tokens against those stored in Attio or another storage solution.
 */

const logger = require("../utils/logger");
const { isTokenExpired } = require("../utils/urlGenerator");

/**
 * Middleware to validate access tokens for client-facing views.
 *
 * This is a placeholder implementation. In a real implementation, you would
 * check the token against a stored value in Attio or another storage.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function validateViewToken(req, res, next) {
  const { token } = req.query;
  const { id } = req.params;

  logger.info(`Validating token for view access to: ${req.path}`);

  if (!token) {
    logger.warn(`Access denied: No token provided for ${req.path}`);
    return res.status(401).render("errors/unauthorized", {
      message: "Access token is required",
      title: "Unauthorized Access",
    });
  }

  try {
    // In a real implementation, this would fetch the stored token data from Attio
    // or another persistent storage, then verify it matches and hasn't expired.

    // This is just a placeholder for demonstration
    const isValid = true; // Replace with actual validation
    const tokenExpired = false; // Replace with actual expiration check

    if (!isValid) {
      logger.warn(`Access denied: Invalid token provided for ${req.path}`);
      return res.status(401).render("errors/unauthorized", {
        message: "Invalid access token",
        title: "Unauthorized Access",
      });
    }

    if (tokenExpired) {
      logger.warn(`Access denied: Expired token provided for ${req.path}`);
      return res.status(401).render("errors/unauthorized", {
        message: "This link has expired",
        title: "Link Expired",
      });
    }

    // If we reach here, the token is valid
    logger.info(`Access granted for ${req.path}`);

    // Log the view access (for tracking purposes)
    logViewAccess(req.path, id, token);

    // Continue to the route handler
    next();
  } catch (error) {
    logger.error(`Error validating token: ${error.message}`);
    res.status(500).render("errors/error", {
      message: "An error occurred while validating your access",
      title: "Error",
    });
  }
}

/**
 * Logs access to client-facing views for tracking purposes.
 *
 * @param {string} path - The path that was accessed
 * @param {string} id - The ID of the resource (proposal, quote, etc.)
 * @param {string} token - The token used for access
 */
function logViewAccess(path, id, token) {
  // In a real implementation, you might store this in Attio or a database
  // This would allow tracking when and how often proposals/quotes are viewed

  logger.info(`View access logged: ${path} (ID: ${id})`);
}

module.exports = {
  validateViewToken,
};
