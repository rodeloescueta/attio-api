const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const { validateAttioPayload } = require("../middleware/validation.middleware");
const { verifyApiKey, permissions } = require("../middleware/auth.middleware");
const attioController = require("../controllers/attio.controller");

/**
 * @route POST /api/attio/webhook
 * @desc Handle Attio webhook events
 * @access Public (but secured with webhook signature verification)
 */
router.post(
  "/webhook",
  validateAttioPayload,
  attioController.handleWebhookEvent
);

/**
 * @route GET /api/attio/objects/:id
 * @desc Get a specific object from Attio by ID
 * @access Private (requires API key with read permission)
 */
router.get(
  "/objects/:id",
  verifyApiKey,
  permissions.read,
  attioController.getObject
);

/**
 * @route POST /api/attio/objects
 * @desc Create a new object in Attio
 * @access Private (requires API key with write permission)
 */
router.post(
  "/objects",
  verifyApiKey,
  permissions.write,
  attioController.createObject
);

/**
 * @route PUT /api/attio/objects/:id
 * @desc Update an existing object in Attio
 * @access Private (requires API key with write permission)
 */
router.put(
  "/objects/:id",
  verifyApiKey,
  permissions.write,
  attioController.updateObject
);

logger.info("Attio routes loaded");

module.exports = router;
