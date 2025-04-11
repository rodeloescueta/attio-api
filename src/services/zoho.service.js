const axios = require("axios");
const logger = require("../utils/logger");
const config = require("../config");

/**
 * Get the appropriate Zoho API URL based on configuration
 * Supports both legacy and new API domains
 * @returns {string} - The base URL for Zoho API
 */
const getZohoApiUrl = () => {
  // Check if we should use the new domain from environment
  if (config.zoho.useNewApiDomain) {
    const domainUrl = config.zoho.domainUrl || "www.zohoapis.com/billing";
    return `https://${domainUrl}`;
  } else {
    // Legacy domain (still works during the transition period)
    return config.zoho.baseUrl || "https://subscriptions.zoho.com/api/v1";
  }
};

/**
 * Get the appropriate endpoint path for API requests
 * @param {string} endpoint - The endpoint without leading slash
 * @returns {string} - The full URL for the endpoint
 */
const getEndpointUrl = (endpoint) => {
  const baseUrl = getZohoApiUrl();

  // If using new domain, ensure v1 is in the path
  if (baseUrl.includes("zohoapis.com/billing")) {
    return `${baseUrl}/v1/${endpoint}`;
  } else {
    return `${baseUrl}/${endpoint}`;
  }
};

/**
 * Create an API client for interacting with the Zoho Subscriptions API
 * Includes token refresh mechanism for OAuth
 * @returns {Object} - Configured axios instance
 */
const createApiClient = () => {
  const apiClient = axios.create({
    // No baseURL here, we'll specify the full URL for each request
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Add request interceptor to inject access token
  apiClient.interceptors.request.use(
    async (config) => {
      // Get a fresh token for each request
      const accessToken = await getAccessToken();
      config.headers.Authorization = `Zoho-oauthtoken ${accessToken}`;
      return config;
    },
    (error) => {
      logger.error("Error in Zoho API request interceptor:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling and logging
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        logger.error(
          `Zoho API error: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        logger.error("Zoho API error: No response received");
      } else {
        logger.error(`Zoho API error: ${error.message}`);
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Global variables for token management
let currentAccessToken = null;
let tokenExpiry = null;

/**
 * Get a valid access token, refreshing if necessary
 * @returns {Promise<string>} - The access token
 */
const getAccessToken = async () => {
  // Check if we have a valid token that's not expired
  const now = Date.now();
  if (currentAccessToken && tokenExpiry && now < tokenExpiry) {
    return currentAccessToken;
  }

  try {
    // Use refresh token to get a new access token
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          refresh_token: config.zoho.refreshToken,
          client_id: config.zoho.clientId,
          client_secret: config.zoho.clientSecret,
          grant_type: "refresh_token",
        },
      }
    );

    // Store the new token and expiry time
    currentAccessToken = response.data.access_token;
    // Zoho tokens expire in 1 hour, we set it to 55 minutes to be safe
    tokenExpiry = now + 55 * 60 * 1000;

    logger.info("New Zoho access token generated");
    return currentAccessToken;
  } catch (error) {
    logger.error("Error refreshing Zoho access token:", error);
    throw new Error("Failed to obtain Zoho access token");
  }
};

// Create a shared API client instance
const apiClient = createApiClient();

/**
 * Handle Zoho API errors
 * @param {Error} error - The error object
 * @param {string} message - Custom error message
 */
const handleApiError = (error, message) => {
  if (error.response) {
    logger.error(`${message}: ${error.response.status}`, {
      status: error.response.status,
      data: error.response.data,
    });
  } else if (error.request) {
    logger.error(`${message}: No response received`, {
      request: error.request,
    });
  } else {
    logger.error(`${message}: ${error.message}`);
  }
};

/**
 * Get all available plans/service offerings from Zoho Subscriptions
 * @returns {Promise<Array>} - Array of plan objects
 */
const getPlans = async () => {
  try {
    const response = await apiClient.get(getEndpointUrl("plans"), {
      params: {
        organization_id: config.zoho.organizationId,
      },
    });
    logger.info(`Retrieved ${response.data.plans.length} plans from Zoho`);
    return response.data.plans;
  } catch (error) {
    handleApiError(error, "Failed to fetch plans from Zoho");
    throw error;
  }
};

/**
 * Get detailed information about a specific plan
 * @param {string} planCode - The plan code
 * @returns {Promise<Object>} - Plan details
 */
const getPlanDetails = async (planCode) => {
  try {
    const response = await apiClient.get(getEndpointUrl(`plans/${planCode}`), {
      params: {
        organization_id: config.zoho.organizationId,
      },
    });
    logger.info(`Retrieved details for plan ${planCode}`);
    return response.data.plan;
  } catch (error) {
    handleApiError(error, `Failed to fetch details for plan ${planCode}`);
    throw error;
  }
};

/**
 * Get available addons that can be attached to plans
 * @returns {Promise<Array>} - Array of addon objects
 */
const getAddons = async () => {
  try {
    const response = await apiClient.get(getEndpointUrl("addons"), {
      params: {
        organization_id: config.zoho.organizationId,
      },
    });
    logger.info(`Retrieved ${response.data.addons.length} addons from Zoho`);
    return response.data.addons;
  } catch (error) {
    handleApiError(error, "Failed to fetch addons from Zoho");
    throw error;
  }
};

/**
 * Create a customer in Zoho Subscriptions
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} - Created customer
 */
const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post(
      getEndpointUrl("customers"),
      {
        customer: customerData,
      },
      {
        params: {
          organization_id: config.zoho.organizationId,
        },
      }
    );
    logger.info(
      `Customer created in Zoho with ID: ${response.data.customer.customer_id}`
    );
    return response.data.customer;
  } catch (error) {
    handleApiError(error, "Failed to create customer in Zoho");
    throw error;
  }
};

/**
 * Create a subscription for a customer
 * @param {Object} subscriptionData - Subscription data including customer ID and plan
 * @returns {Promise<Object>} - Created subscription
 */
const createSubscription = async (subscriptionData) => {
  try {
    const response = await apiClient.post(
      getEndpointUrl("subscriptions"),
      {
        subscription: subscriptionData,
      },
      {
        params: {
          organization_id: config.zoho.organizationId,
        },
      }
    );
    logger.info(
      `Subscription created in Zoho with ID: ${response.data.subscription.subscription_id}`
    );
    return response.data.subscription;
  } catch (error) {
    handleApiError(error, "Failed to create subscription in Zoho");
    throw error;
  }
};

module.exports = {
  getPlans,
  getPlanDetails,
  getAddons,
  createCustomer,
  createSubscription,
};
