#!/usr/bin/env node

/**
 * Script to test service synchronization between Zoho and Attio
 * Run with: node scripts/test-sync.js [token]
 *
 * If no token is provided, it will use the API_ACCESS_TOKEN from your .env file
 */

require("dotenv").config();
const axios = require("axios");

// Get the token from command line or environment variable
const token = process.argv[2] || process.env.API_ACCESS_TOKEN;
const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

if (!token) {
  console.error(
    "Error: No API token provided. Either pass as argument or set API_ACCESS_TOKEN in .env"
  );
  process.exit(1);
}

// Debug info
console.log("Using API token:", token);
console.log("Base URL:", baseUrl);
console.log("API Access Token from ENV:", process.env.API_ACCESS_TOKEN);

async function testSynchronization() {
  console.log("\n=== Service Synchronization Test ===\n");

  try {
    // First check the status of the services collection
    console.log("1. Checking services collection status...");
    try {
      const statusResponse = await axios.get(
        `${baseUrl}/api/v1/sync/zoho/services/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Permission": "admin", // Add admin permission explicitly
          },
        }
      );
      console.log("✅ Collection status retrieved successfully");
      console.log("Collection details:", statusResponse.data.collection);
    } catch (error) {
      handleApiError(error, "Failed to get collection status");
    }

    // Now trigger synchronization
    console.log("\n2. Triggering Zoho services synchronization...");
    try {
      const syncResponse = await axios.post(
        `${baseUrl}/api/v1/sync/zoho/services`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Permission": "admin", // Add admin permission explicitly
          },
        }
      );
      console.log("✅ Synchronization completed successfully");
      console.log("Synchronization stats:", syncResponse.data.stats);
    } catch (error) {
      handleApiError(error, "Failed to trigger synchronization");
    }
  } catch (error) {
    console.error("Unexpected error during test:", error);
  }

  console.log("\nTest complete\n");
}

function handleApiError(error, message) {
  console.log(`❌ ${message}`);

  if (error.response) {
    if (error.response.status === 401) {
      console.log("Error: Authentication failed. Check your API token.");
    } else if (error.response.status === 403) {
      console.log(
        "Error: Permission denied. Your token lacks necessary permissions."
      );
    } else {
      console.log("API Error:", error.response.data);
      console.log("Response Status:", error.response.status);
      if (error.response.data && error.response.data.error) {
        console.log("Detailed error:", error.response.data.error);
      }
    }
  } else if (error.request) {
    console.log("Error: No response received. Is the server running?");
  } else {
    console.log("Error:", error.message);
  }
}

// Run the test
testSynchronization();
