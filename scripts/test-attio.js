#!/usr/bin/env node

/**
 * Script to test Attio API connection
 * Run with: node scripts/test-attio.js
 *
 * This script will connect to Attio using the API key in .env
 * and check if we can list collections.
 */

require("dotenv").config();
const attioService = require("../src/services/attio.service");
const util = require("util");

async function testAttioConnection() {
  console.log("\n=== Attio API Connection Test ===\n");

  try {
    // Test getting collections
    console.log("Testing Attio API connection by retrieving collections...");
    try {
      const collections = await attioService.getCollections();
      console.log(
        `✅ Successfully connected to Attio and retrieved ${collections.length} collections\n`
      );

      // Show the list of available collections
      if (collections.length > 0) {
        console.log("Available collections:");
        collections.forEach((collection, index) => {
          console.log(
            `${index + 1}. ${collection.title} (API ID: ${collection.api_id})`
          );
        });

        // Look for our Zoho Services collection if it exists
        const zohoServicesColl = collections.find(
          (c) => c.api_id === "zoho-services"
        );
        if (zohoServicesColl) {
          console.log('\n✅ Found existing "Zoho Services" collection');

          // Check if the collection has objects
          console.log(
            "\nChecking for objects in the Zoho Services collection..."
          );
          try {
            const objects = await attioService.getObjectsFromCollection(
              "zoho-services"
            );
            console.log(`Found ${objects.length} services in the collection`);

            if (objects.length > 0) {
              // Show a sample object
              console.log("\nSample service object:");
              console.log(util.inspect(objects[0], { depth: 3, colors: true }));
            }
          } catch (error) {
            console.log("❌ Failed to get objects from collection");
            handleError(error);
          }
        } else {
          console.log(
            '\n❌ "Zoho Services" collection not found (This is normal if you haven\'t synced yet)'
          );
        }
      } else {
        console.log("No collections found in Attio workspace");
      }
    } catch (error) {
      console.log("❌ Failed to connect to Attio");
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
testAttioConnection();
