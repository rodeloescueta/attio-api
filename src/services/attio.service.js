const axios = require("axios");
const logger = require("../utils/logger");
const config = require("../config");

/**
 * Create an API client for interacting with the Attio API
 * @returns {Object} - Configured axios instance
 */
const createApiClient = () => {
  const apiClient = axios.create({
    baseURL: config.attio.baseUrl || "https://api.attio.com/v2",
    headers: {
      Authorization: `Bearer ${config.attio.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Add response interceptor for logging
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        logger.error(
          `Attio API error: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        logger.error("Attio API error: No response received");
      } else {
        logger.error(`Attio API error: ${error.message}`);
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Create a shared API client instance
const apiClient = createApiClient();

/**
 * Handle Attio API errors
 * @param {Error} error - The error object
 * @param {string} message - Custom error message
 */
const handleApiError = (error, message) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    logger.error(`${message}: ${error.response.status}`, {
      status: error.response.status,
      data: error.response.data,
    });
  } else if (error.request) {
    // The request was made but no response was received
    logger.error(`${message}: No response received`, {
      request: error.request,
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    logger.error(`${message}: ${error.message}`);
  }
};

/**
 * Get a specific object from Attio
 * @param {string} id - The object ID
 * @returns {Promise<Object|null>} - The object data or null if not found
 */
const getObject = async (id) => {
  try {
    const response = await apiClient.get(`/objects/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to get object");
    return null;
  }
};

/**
 * Create a new object in Attio
 * @param {Object} objectData - The object data to create
 * @returns {Promise<Object>} - The created object data
 */
const createObject = async (objectData) => {
  try {
    const response = await apiClient.post("/objects", objectData);
    logger.info("Object created successfully", {
      objectId: response.data.id,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create object");
    throw error;
  }
};

/**
 * Update an existing object in Attio
 * @param {string} id - The object ID to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} - The updated object data
 */
const updateObject = async (id, updateData) => {
  try {
    const response = await apiClient.patch(`/objects/${id}`, updateData);
    logger.info("Object updated successfully", { objectId: id });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update object");
    return null;
  }
};

/**
 * Process a webhook event for object creation
 * @param {Object} data - The webhook payload data
 */
const processObjectCreated = async (data) => {
  logger.info("Processing object created event", { objectId: data.id });
  // Implement business logic for handling object creation events
  return data;
};

/**
 * Process a webhook event for object update
 * @param {Object} data - The webhook payload data
 */
const processObjectUpdated = async (data) => {
  logger.info("Processing object updated event", { objectId: data.id });
  // Implement business logic for handling object update events
  return data;
};

/**
 * Process a webhook event for object deletion
 * @param {Object} data - The webhook payload data
 */
const processObjectDeleted = async (data) => {
  logger.info("Processing object deleted event", { objectId: data.id });
  // Implement business logic for handling object deletion events
  return data;
};

// Export functions individually and also as a service object for backward compatibility
module.exports = {
  getObject,
  createObject,
  updateObject,
  processObjectCreated,
  processObjectUpdated,
  processObjectDeleted,
  // For backward compatibility with existing controller
  AttioService: class {
    constructor() {
      // Placeholder constructor to maintain compatibility
    }
    getObject = getObject;
    createObject = createObject;
    updateObject = updateObject;
    processObjectCreated = processObjectCreated;
    processObjectUpdated = processObjectUpdated;
    processObjectDeleted = processObjectDeleted;
    handleApiError = handleApiError;
  },
};
