const express = require("express");
const logger = require("../utils/logger");

// Import route modules
const attioRoutes = require("./attio.routes");

/**
 * Sets up all API routes
 * @param {express.Application} app - The Express application
 */
function setupRoutes(app) {
  logger.info("Setting up API routes");

  // API versioning prefix
  const apiPrefix = "/api/v1";

  // Register route modules
  app.use(`${apiPrefix}/attio`, attioRoutes);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  logger.info("API routes setup complete");
}

module.exports = {
  setupRoutes,
};
