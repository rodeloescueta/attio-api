/**
 * Application configuration
 * Loads settings from environment variables
 */
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
  },

  // API configuration
  api: {
    accessToken: process.env.API_ACCESS_TOKEN,
  },

  // Attio configuration
  attio: {
    apiKey: process.env.ATTIO_API_KEY,
    baseUrl: process.env.ATTIO_API_URL || "https://api.attio.com/v2",
    webhookSecret: process.env.ATTIO_WEBHOOK_SECRET,
  },

  // Zoho configuration
  zoho: {
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET,
    refreshToken: process.env.ZOHO_REFRESH_TOKEN,
    organizationId: process.env.ZOHO_ORGANIZATION_ID,
    webhookSecret: process.env.ZOHO_WEBHOOK_SECRET,
    // Legacy API URL (will be deprecated according to Zoho warning)
    baseUrl:
      process.env.ZOHO_API_URL || "https://subscriptions.zoho.com/api/v1",
    // New API domain settings
    domainUrl: process.env.ZOHO_DOMAIN_URL || "www.zohoapis.com/billing",
    // Using the new domain by default since the old domain will be deprecated next month
    // Override with USE_LEGACY_ZOHO_DOMAIN=true to use the old domain during transition
    useNewApiDomain: process.env.USE_LEGACY_ZOHO_DOMAIN !== "true",
  },

  // Braintree configuration
  braintree: {
    environment: process.env.BT_ENVIRONMENT || "sandbox",
    merchantId: process.env.BT_MERCHANT_ID,
    publicKey: process.env.BT_PUBLIC_KEY,
    privateKey: process.env.BT_PRIVATE_KEY,
    webhookSecret: process.env.BT_WEBHOOK_SECRET,
  },
};

// Validate required configuration
const validateConfig = () => {
  const missingVars = [];

  if (!config.attio.apiKey) missingVars.push("ATTIO_API_KEY");
  if (!config.api.accessToken) missingVars.push("API_ACCESS_TOKEN");

  // Zoho variables needed for service synchronization
  if (!config.zoho.clientId) missingVars.push("ZOHO_CLIENT_ID");
  if (!config.zoho.clientSecret) missingVars.push("ZOHO_CLIENT_SECRET");
  if (!config.zoho.refreshToken) missingVars.push("ZOHO_REFRESH_TOKEN");
  if (!config.zoho.organizationId) missingVars.push("ZOHO_ORGANIZATION_ID");

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
    process.exit(1);
  }
};

// Only validate in production to allow development without all variables
if (process.env.NODE_ENV === "production") {
  validateConfig();
}

module.exports = config;
