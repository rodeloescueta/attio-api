#!/usr/bin/env node

/**
 * Script to test API authentication
 * Run with: node scripts/test-auth.js [token]
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

async function testAuthentication() {
  console.log("\n=== API Authentication Test ===\n");

  try {
    // Test unauthenticated request
    console.log("Testing unauthorized request (should fail)...");
    try {
      await axios.get(`${baseUrl}/api/v1/attio/objects/test-id`);
      console.log("❌ Test failed: Request succeeded without authentication!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("✅ Success: Unauthorized request properly rejected");
      } else {
        console.log(`❌ Test failed: Unexpected error: ${error.message}`);
      }
    }

    // Test authenticated request
    console.log("\nTesting authorized request with token...");
    try {
      await axios.get(`${baseUrl}/api/v1/attio/objects/test-id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Success: Authentication is working correctly");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(
          "✅ Success: Authentication worked (404 is expected for a non-existent object)"
        );
      } else if (error.response && error.response.status === 403) {
        console.log("❌ Test failed: Token was rejected");
      } else {
        console.log(`❌ Test failed: Unexpected error: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error running authentication test:", error);
  }

  console.log("\nTest complete\n");
}

// Run the test
testAuthentication();
