const express = require("express");
const logger = require("../utils/logger");

// Import route modules
const attioRoutes = require("./attio.routes");
const syncRoutes = require("./sync.routes");
const proposalRoutes = require("./proposals");

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
  app.use(`${apiPrefix}/sync`, syncRoutes);

  // Mount proposal routes without API prefix since they're web routes
  app.use("/proposals", proposalRoutes);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  logger.info("API routes setup complete");
}

module.exports = {
  setupRoutes,
};
