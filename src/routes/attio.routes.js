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
 * @route POST /api/attio/process-plan
 * @desc Process incoming plan data and prepare for future Braintree integration
 * @access Private (requires Bearer token)
 */
router.post("/process-plan", verifyApiKey, async (req, res) => {
  try {
    const { body } = req;

    // Log the incoming data
    logger.info("Received plan processing request:", {
      body: JSON.stringify(body, null, 2),
    });

    // Store the data that will be needed for future Braintree integration
    const planData = {
      id: body.id,
      name: body.name,
      price: body.price,
      billingFrequency: body.billingFrequency,
      // Add any other fields needed for Braintree integration
      rawData: body, // Store complete request data for reference
    };

    // TODO: In the future, this is where we'll add Braintree plan creation

    res.status(200).json({
      message: "Plan template webhook received successfully",
      receivedData: JSON.stringify(body, null, 2), // Pretty-printed request body
      processedPlan: planData,
    });
  } catch (error) {
    logger.error("Error processing plan data:", error);
    res.status(500).json({
      message: "Error processing plan data",
      error: error.message,
      receivedData: JSON.stringify(req.body, null, 2), // Include received data even in error case
    });
  }
});

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
