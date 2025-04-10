const attioService = require("../services/attio.service");
const logger = require("../utils/logger");

/**
 * Handle webhook events from Attio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleWebhookEvent = async (req, res) => {
  try {
    const { type, data } = req.body;
    logger.info(`Received webhook event: ${type}`);

    switch (type) {
      case "object.created":
        await attioService.processObjectCreated(data);
        break;
      case "object.updated":
        await attioService.processObjectUpdated(data);
        break;
      case "object.deleted":
        await attioService.processObjectDeleted(data);
        break;
      default:
        logger.warn(`Unhandled webhook event type: ${type}`);
    }

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    logger.error("Error processing webhook event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get a specific object from Attio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getObject = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Getting object with ID: ${id}`);

    const object = await attioService.getObject(id);

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    return res.status(200).json(object);
  } catch (error) {
    logger.error("Error getting object:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create a new object in Attio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createObject = async (req, res) => {
  try {
    const objectData = req.body;
    logger.info("Creating new object in Attio");

    const createdObject = await attioService.createObject(objectData);

    return res.status(201).json(createdObject);
  } catch (error) {
    logger.error("Error creating object:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update an existing object in Attio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateObject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    logger.info(`Updating object with ID: ${id}`);

    const updatedObject = await attioService.updateObject(id, updateData);

    if (!updatedObject) {
      return res.status(404).json({ message: "Object not found" });
    }

    return res.status(200).json(updatedObject);
  } catch (error) {
    logger.error("Error updating object:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleWebhookEvent,
  getObject,
  createObject,
  updateObject,
};
