const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const { verifyApiKey, permissions } = require("../middleware/auth.middleware");
const syncController = require("../controllers/sync.controller");

/**
 * @route POST /api/sync/zoho/services
 * @desc Trigger synchronization of Zoho services to Attio
 * @access Private (requires API key with admin permission)
 */
router.post(
  "/zoho/services",
  verifyApiKey,
  permissions.admin,
  syncController.syncZohoServices
);

/**
 * @route GET /api/sync/zoho/services/status
 * @desc Get status of Zoho services collection in Attio
 * @access Private (requires API key with read permission)
 */
router.get(
  "/zoho/services/status",
  verifyApiKey,
  permissions.read,
  syncController.getServicesStatus
);

logger.info("Sync routes loaded");

module.exports = router;
