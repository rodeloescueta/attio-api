const syncService = require("../services/sync.service");
const logger = require("../utils/logger");

/**
 * Trigger a synchronization of Zoho services to Attio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const syncZohoServices = async (req, res) => {
  try {
    logger.info("Received request to synchronize Zoho services to Attio");

    // Start the synchronization process
    const result = await syncService.synchronizeServices();

    if (result.success) {
      return res.status(200).json({
        message: "Synchronization completed successfully",
        stats: result.stats,
      });
    } else {
      return res.status(500).json({
        message: "Synchronization failed",
        error: result.error,
      });
    }
  } catch (error) {
    logger.error("Error in service synchronization controller:", error);
    return res.status(500).json({
      message: "Internal server error during synchronization",
      error: error.message,
    });
  }
};

/**
 * Get the status of the Zoho services collection in Attio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getServicesStatus = async (req, res) => {
  try {
    logger.info("Received request to check Zoho services collection status");

    // Attempt to set up the collection without actually creating it
    // This will tell us if it exists and return its details
    const collection = await syncService.setupServicesCollection();

    return res.status(200).json({
      message: "Services collection status retrieved",
      collection: collection,
    });
  } catch (error) {
    logger.error("Error getting services collection status:", error);
    return res.status(500).json({
      message: "Failed to get services collection status",
      error: error.message,
    });
  }
};

module.exports = {
  syncZohoServices,
  getServicesStatus,
};
