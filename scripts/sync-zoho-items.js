#!/usr/bin/env node

/**
 * Script to synchronize Zoho plans with the existing "Zoho Items" collection in Attio
 * This script is customized to work with the existing Attio setup shown in the screenshot
 *
 * Run with: node scripts/sync-zoho-items.js
 */

require("dotenv").config();
const axios = require("axios");
const config = require("../src/config");
const zohoService = require("../src/services/zoho.service");

// Use the existing Zoho Items collection
const ATTIO_OBJECT_ID = "zoho_items"; // Updated to use underscore as shown in the API response

// Create Attio API client
const attioClient = axios.create({
  baseURL: config.attio.baseUrl || "https://api.attio.com/v2",
  headers: {
    Authorization: `Bearer ${config.attio.apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add response interceptor for detailed error logging
attioClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `Attio API error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    } else if (error.request) {
      console.error("Attio API error: No response received");
    } else {
      console.error(`Attio API error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

/**
 * Main function to synchronize Zoho services to Attio
 */
async function syncZohoToAttio() {
  console.log("=== Starting manual Zoho to Attio synchronization ===");

  try {
    // First, list the objects to verify our API key and get object types
    console.log("0. Checking Attio API connection and listing objects...");
    try {
      const objectsResponse = await attioClient.get("/objects");
      console.log("✅ Successfully connected to Attio API");

      // Find our target object to confirm it exists
      const targetObject = objectsResponse.data.data.find(
        (obj) => obj.api_slug === ATTIO_OBJECT_ID
      );
      if (targetObject) {
        console.log(
          `✅ Found target object: ${targetObject.singular_noun} (${ATTIO_OBJECT_ID})`
        );
      } else {
        console.warn(
          `⚠️ Target object '${ATTIO_OBJECT_ID}' not found in Attio. Available objects:`
        );
        objectsResponse.data.data.forEach((obj) => {
          console.log(`  - ${obj.singular_noun} (${obj.api_slug})`);
        });
      }
    } catch (error) {
      console.error(
        "Failed to list objects, API may not be accessible:",
        error.message
      );
      // Continue anyway to try the main sync
    }

    // Get all plans from Zoho
    console.log("1. Fetching plans from Zoho...");
    const zohoPlans = await zohoService.getPlans();
    console.log(`✅ Retrieved ${zohoPlans.length} plans from Zoho`);

    // Track synchronization statistics
    const syncStats = {
      total: zohoPlans.length,
      created: 0,
      updated: 0,
      unchanged: 0,
      failed: 0,
    };

    // Process each plan one by one
    console.log("2. Processing Zoho plans...");

    // Process only the first plan for testing
    const testPlan = zohoPlans[0];
    console.log(
      `Testing with a single plan: ${testPlan.name} (${testPlan.plan_code})`
    );

    try {
      const externalId = `zoho-plan-${testPlan.plan_code}`;

      // Make sure billing_frequency is a string, not a number
      let billingFrequency = testPlan.interval || "month";
      // Convert number to string if necessary
      if (typeof billingFrequency === "number") {
        billingFrequency = billingFrequency.toString();
      }

      // Create a record with the proper data format
      const recordData = {
        data: {
          values: {
            name: testPlan.name,
            description: testPlan.description || "",
            externalid: externalId,
            object_type: "plan",
            price: testPlan.price || 0,
            currency: testPlan.currency_code || "USD",
            billing_frequency: billingFrequency,
            tier: determineTier(testPlan.price || 0),
            status: testPlan.status || "active",
          },
        },
      };

      console.log("Creating a record in Attio...");
      console.log("Request data:", JSON.stringify(recordData, null, 2));
      console.log(`Endpoint: /objects/${ATTIO_OBJECT_ID}/records`);

      const createResponse = await attioClient.post(
        `/objects/${ATTIO_OBJECT_ID}/records`,
        recordData
      );

      console.log(
        `Success! Created record with ID: ${
          createResponse.data.id || createResponse.data.data?.id
        }`
      );
      syncStats.created++;

      // If the first one succeeded, try processing all records
      if (syncStats.created > 0) {
        console.log(
          "\n3. First record created successfully, now processing all plans..."
        );

        // Filter out "SI test" plans and process all "SELLER INTERACTIVE" plans
        const productionPlans = zohoPlans.filter(
          (plan) =>
            !plan.name.toLowerCase().includes("si test") &&
            !plan.name.toLowerCase().includes("test")
        );

        console.log(
          `Found ${productionPlans.length} production plans to sync (filtered out test plans)`
        );

        // Process all production plans, not just 3
        for (let i = 1; i < productionPlans.length; i++) {
          const plan = productionPlans[i];
          try {
            const planData = {
              data: {
                values: mapZohoPlanToAttioItem(plan).values,
              },
            };

            const planResponse = await attioClient.post(
              `/objects/${ATTIO_OBJECT_ID}/records`,
              planData
            );

            console.log(
              `✅ Created record for: ${plan.name} (${plan.plan_code})`
            );
            syncStats.created++;
          } catch (error) {
            console.error(
              `❌ Failed to create record for plan ${plan.plan_code}:`,
              error.message
            );
            syncStats.failed++;
          }
        }
      }
    } catch (error) {
      console.error("Failed to create test record:");
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.error(`Error: ${error.message}`);
      }
      syncStats.failed++;
    }

    // Display results
    console.log("\n=== Synchronization Complete ===");
    console.log(
      `Total plans processed: ${syncStats.created + syncStats.failed}`
    );
    console.log(`Created: ${syncStats.created}`);
    console.log(`Updated: ${syncStats.updated}`);
    console.log(`Failed: ${syncStats.failed}`);

    // Provide next steps
    if (syncStats.created > 0) {
      console.log("\n✅ SUCCESS! The sync script has completed successfully.");
      console.log(
        `   Created ${syncStats.created} production plan records in Attio.`
      );
    }
  } catch (error) {
    console.error("Synchronization failed:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

/**
 * Map a Zoho plan to an Attio item object using the fields from the screenshot
 * @param {Object} plan - The Zoho plan
 * @returns {Object} - The Attio item object
 */
function mapZohoPlanToAttioItem(plan) {
  const externalId = `zoho-plan-${plan.plan_code}`;

  // Make sure billing_frequency is a string, not a number
  let billingFrequency = plan.interval || "month";
  // Convert number to string if necessary
  if (typeof billingFrequency === "number") {
    billingFrequency = billingFrequency.toString();
  }

  return {
    values: {
      name: plan.name,
      description: plan.description || "",
      externalid: externalId,
      object_type: "plan",
      price: plan.price || 0,
      currency: plan.currency_code || "USD",
      billing_frequency: billingFrequency,
      tier: determineTier(plan.price || 0),
      status: plan.status || "active",
    },
  };
}

/**
 * Determine tier based on price
 * @param {number} price - The plan price
 * @returns {string} - The tier level
 */
function determineTier(price) {
  if (!price) return "free";
  if (price < 50) return "basic";
  if (price < 200) return "professional";
  return "enterprise";
}

// Run the sync function
syncZohoToAttio().catch((err) => {
  console.error("Error in main sync function:", err);
  process.exit(1);
});
