#!/usr/bin/env node

/**
 * Script to test fetching service plans from Zoho Subscriptions
 * Run with: node scripts/test-zoho-plans.js
 *
 * This script will connect to Zoho using the credentials in .env
 * and log the available service plans to the console.
 */

require("dotenv").config();
const axios = require("axios");
const zohoService = require("../src/services/zoho.service");

async function testZohoConnection() {
  console.log("\n=== Zoho Subscriptions Service Test ===\n");

  try {
    // Test OAuth token generation
    console.log("1. Testing OAuth token generation...");
    try {
      // Generate a token manually to test the OAuth flow
      const response = await axios.post(
        "https://accounts.zoho.com/oauth/v2/token",
        null,
        {
          params: {
            refresh_token: process.env.ZOHO_REFRESH_TOKEN,
            client_id: process.env.ZOHO_CLIENT_ID,
            client_secret: process.env.ZOHO_CLIENT_SECRET,
            grant_type: "refresh_token",
          },
        }
      );

      if (response.data && response.data.access_token) {
        console.log("✅ OAuth token generation successful");
      } else {
        console.log("❌ Received unexpected response format");
        console.log("Response:", response.data);
      }
    } catch (error) {
      console.log("❌ OAuth token generation failed");
      handleError(error);
    }

    // Fetch plans using our service
    console.log("\n2. Fetching service plans from Zoho...");
    try {
      const plans = await zohoService.getPlans();
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

// Run the test
testZohoConnection();
