#!/usr/bin/env node

/**
 * Script to inspect the detailed structure of a Zoho plan
 * Run with: node scripts/inspect-zoho-plan.js [planCode]
 *
 * If no plan code is provided, it will get the first plan available
 */

require("dotenv").config();
const zohoService = require("../src/services/zoho.service");
const util = require("util");

// Get plan code from command line argument
const planCode = process.argv[2];

async function inspectZohoPlan() {
  console.log("\n=== Zoho Plan Structure Inspection ===\n");

  try {
    // First get all plans
    console.log("Fetching all plans...");
    const plans = await zohoService.getPlans();
    console.log(`Retrieved ${plans.length} plans from Zoho`);

    if (plans.length === 0) {
      console.log("No plans found in Zoho Subscriptions!");
      return;
    }

    // Show the list of available plans
    console.log("\nAvailable plans:");
    plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} (${plan.plan_code})`);
    });

    // Determine which plan to inspect in detail
    let targetPlan;
    if (planCode) {
      console.log(`\nLooking for plan with code: ${planCode}`);
      targetPlan = plans.find((p) => p.plan_code === planCode);
      if (!targetPlan) {
        console.log(`Plan with code ${planCode} not found!`);
        // Use the first plan instead
        targetPlan = plans[0];
        console.log(
          `Using first available plan: ${targetPlan.name} (${targetPlan.plan_code})`
        );
      }
    } else {
      // Use the first plan if no specific plan code was provided
      targetPlan = plans[0];
      console.log(
        `\nNo plan code specified. Using first available plan: ${targetPlan.name} (${targetPlan.plan_code})`
      );
    }

    // Get detailed information about the selected plan
    console.log(
      `\nFetching detailed information for plan: ${targetPlan.name} (${targetPlan.plan_code})`
    );
    try {
      const planDetails = await zohoService.getPlanDetails(
        targetPlan.plan_code
      );

      // Show a summary of key fields that might be useful for integration
      console.log("\n--- Plan Summary ---");
      console.log(`Plan Name: ${planDetails.name}`);
      console.log(`Plan Code: ${planDetails.plan_code}`);
      console.log(`Plan ID: ${planDetails.plan_id}`);
      console.log(`Price: ${planDetails.currency_code} ${planDetails.price}`);
      console.log(
        `Interval: ${planDetails.interval} ${planDetails.interval_unit}`
      );
      console.log(`Status: ${planDetails.status}`);

      // Show the complete raw data structure with all fields
      console.log("\n--- Complete Plan Data Structure ---");
      console.log(util.inspect(planDetails, { depth: null, colors: true }));

      // Collect the field names for reference when creating Attio attributes
      console.log("\n--- Field Names for Reference ---");
      const fields = Object.keys(planDetails).sort();
      fields.forEach((field) => {
        const value = planDetails[field];
        const valueType = Array.isArray(value) ? "array" : typeof value;
        console.log(`${field}: ${valueType}`);
      });
    } catch (error) {
      console.log(
        `❌ Failed to fetch details for plan: ${targetPlan.plan_code}`
      );
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response data:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    }
  } catch (error) {
    console.error("Unexpected error during inspection:", error);
  }

  console.log("\nInspection complete\n");
}

// Run the inspection
inspectZohoPlan();
