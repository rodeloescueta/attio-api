#!/usr/bin/env node

/**
 * Script to test fetching service plans from Zoho Subscriptions with organization ID
 * Run with: node scripts/test-zoho-plans-fixed.js
 *
 * This script will connect to Zoho using the credentials in .env
 * and log the available service plans to the console.
 */

require("dotenv").config();
const axios = require("axios");
const config = require("../src/config");
const logger = require("../src/utils/logger");

// Global variables for token management
let currentAccessToken = null;

// Use the domain URL from environment variables
const getZohoUrl = () => {
  // Check if we should use the new domain or the old one for testing both
  const useNewDomain = process.env.USE_NEW_ZOHO_DOMAIN === "true";

  if (useNewDomain) {
    // New domain format
    const domainUrl = process.env.ZOHO_DOMAIN_URL || "www.zohoapis.com/billing";
    return `https://${domainUrl}`;
  } else {
    // Legacy domain format - still works during transition period
    return "https://subscriptions.zoho.com/api/v1";
  }
};

// Select organization ID and API base URL based on environment
const getOrganizationConfig = () => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const apiBaseUrl = getZohoUrl();

  // Based on the error message, we have two organizations:
  // - 745110996: "SI Test" (use in development)
  // - 677181847: "Seller Interactive" (use in production)

  if (isDevelopment) {
    console.log("Using SI Test organization (Development mode)");
    return {
      organizationId: "745110996", // SI Test
      baseUrl: apiBaseUrl, // Use URL from env
    };
  } else {
    console.log("Using Seller Interactive organization (Production mode)");
    return {
      organizationId: "677181847", // Seller Interactive
      baseUrl: apiBaseUrl, // Use URL from env
    };
  }
};

// Get the organization config based on environment
const orgConfig = getOrganizationConfig();
const { organizationId, baseUrl } = orgConfig;

/**
 * Get a valid access token
 * @returns {Promise<string>} - The access token
 */
const getAccessToken = async () => {
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

    // Store the new token
    currentAccessToken = response.data.access_token;
    console.log("✅ OAuth token generation successful");
    return currentAccessToken;
  } catch (error) {
    console.log("❌ OAuth token generation failed");
    handleError(error);
    throw new Error("Failed to obtain Zoho access token");
  }
};

/**
 * Get plans from Zoho with organization ID
 */
const getPlans = async (accessToken) => {
  try {
    // Determine the correct endpoint path based on the URL
    let endpointUrl;
    if (baseUrl.includes("zohoapis.com/billing")) {
      // New domain format
      endpointUrl = `${baseUrl}/v1/plans`;
    } else {
      // Legacy domain format
      endpointUrl = `${baseUrl}/plans`;
    }

    console.log(`Using Zoho API URL: ${endpointUrl}`);

    const response = await axios.get(endpointUrl, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params: {
        organization_id: organizationId,
      },
    });

    return response.data.plans;
  } catch (error) {
    console.log("❌ Failed to fetch plans from Zoho");
    handleError(error);
    throw error;
  }
};

function handleError(error) {
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Response data:", error.response.data);
  } else if (error.request) {
    console.log("No response received from server");
  } else {
    console.log("Error:", error.message);
  }
}

async function testZohoConnection() {
  console.log("\n=== Zoho Subscriptions Service Test (Fixed) ===\n");

  try {
    // Test OAuth token generation
    console.log("1. Testing OAuth token generation...");
    const accessToken = await getAccessToken();

    // Fetch plans using organization ID
    console.log(
      `\n2. Fetching service plans from Zoho with organization ID (${organizationId})...`
    );

    try {
      const plans = await getPlans(accessToken);
      console.log(
        `✅ Successfully retrieved ${plans.length} plans from Zoho\n`
      );

      // Print detailed information about each plan
      plans.forEach((plan, index) => {
        console.log(`\n--- Plan ${index + 1}: ${plan.name} ---`);
        console.log(`Plan Code: ${plan.plan_code}`);
        console.log(`Plan ID: ${plan.plan_id}`);
        console.log(`Price: ${plan.currency_code} ${plan.price}`);
        console.log(`Interval: ${plan.interval} ${plan.interval_unit}`);
        console.log(`Description: ${plan.description || "No description"}`);
        console.log(`Status: ${plan.status}`);
        console.log("-----------------------------------");
      });
    } catch (error) {
      console.log("❌ Failed to fetch plans from Zoho");
      handleError(error);
    }
  } catch (error) {
    console.error("Unexpected error during test:", error);
  }

  console.log("\nTest complete\n");
}

// Display environment info
console.log("Environment configuration:");
console.log(`- NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(`- Using Organization ID: ${organizationId}`);
console.log(
  `- Using New Zoho Domain: ${
    process.env.USE_NEW_ZOHO_DOMAIN === "true"
      ? "Yes"
      : "No (using legacy domain)"
  }`
);
if (process.env.USE_NEW_ZOHO_DOMAIN === "true") {
  console.log(
    `- Zoho Domain URL: ${
      process.env.ZOHO_DOMAIN_URL || "www.zohoapis.com/billing"
    }`
  );
}
console.log(`- API Base URL: ${baseUrl}`);
console.log(`- ZOHO_CLIENT_ID: ${config.zoho.clientId ? "Set" : "Not Set"}`);
console.log(
  `- ZOHO_CLIENT_SECRET: ${config.zoho.clientSecret ? "Set" : "Not Set"}`
);
console.log(
  `- ZOHO_REFRESH_TOKEN: ${config.zoho.refreshToken ? "Set" : "Not Set"}`
);

// Run the test
testZohoConnection();
