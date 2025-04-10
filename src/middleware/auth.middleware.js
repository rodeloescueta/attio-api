const logger = require("../utils/logger");
const config = require("../config");

/**
 * Middleware to verify API key authentication for protected routes
 * Uses a bearer token in the Authorization header
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyApiKey = (req, res, next) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.warn("Missing Authorization header");
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      logger.warn("Invalid Authorization format");
      return res.status(401).json({ message: "Invalid authentication format" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Check if the token matches our API key
    if (token !== config.api.accessToken) {
      logger.warn("Invalid API key provided");
      return res.status(403).json({ message: "Invalid API key" });
    }

    // If we reach here, the API key is valid
    logger.info("API key authentication successful");

    // For future extensibility, add a user object to the request
    // This could be expanded to include roles, permissions, etc.
    req.user = {
      authenticated: true,
      role: "api",
      permissions: ["read", "write"],
    };

    next();
  } catch (error) {
    logger.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create a middleware for checking specific permissions
 * This provides framework for future role-based access control
 *
 * @param {string[]} requiredPermissions - Array of permissions required for the route
 * @returns {Function} Express middleware function
 */
const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    // Make sure we've authenticated first
    if (!req.user || !req.user.authenticated) {
      logger.warn("Permission check attempted on unauthenticated request");
      return res.status(401).json({ message: "Authentication required" });
    }

    // Currently simplified for API key auth
    // Future implementation could check actual permissions from a user store
    const hasPermission = requiredPermissions.every((permission) =>
      req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      logger.warn(`Permission denied for user with role: ${req.user.role}`);
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    logger.info("Permission check successful");
    next();
  };
};

// Commonly used permission combinations
const permissions = {
  // Allows read-only operations
  read: checkPermission(["read"]),

  // Allows read and write operations
  write: checkPermission(["read", "write"]),

  // For admin operations (future extension)
  admin: checkPermission(["read", "write", "admin"]),
};

module.exports = {
  verifyApiKey,
  checkPermission,
  permissions,
};
