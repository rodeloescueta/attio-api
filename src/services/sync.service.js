const logger = require("../utils/logger");
const zohoService = require("./zoho.service");
const attioService = require("./attio.service");

// Constants
const ZOHO_SERVICES_COLLECTION_API_ID = "zoho-services";
const ZOHO_SERVICES_COLLECTION_NAME = "Zoho Services";

/**
 * Create or update the Zoho Services collection in Attio
 * @returns {Promise<Object>} The collection data
 */
const setupServicesCollection = async () => {
  try {
    logger.info("Setting up Zoho services collection in Attio");

    // Check if collection already exists
    let collection = await attioService.getCollection(
      ZOHO_SERVICES_COLLECTION_API_ID
    );

    if (collection) {
      logger.info("Zoho services collection already exists, skipping creation");
      return collection;
    }

    // Collection doesn't exist, create it
    logger.info("Creating Zoho services collection in Attio");

    const collectionData = {
      api_id: ZOHO_SERVICES_COLLECTION_API_ID,
      singular_noun: "Service",
      plural_noun: "Services",
      title: ZOHO_SERVICES_COLLECTION_NAME,
      description: "Service plans synchronized from Zoho Subscriptions",
      icon: "📝",
    };

    collection = await attioService.createCollection(collectionData);

    // Create required attributes for the collection
    await createServiceAttributes(ZOHO_SERVICES_COLLECTION_API_ID);

    logger.info("Zoho services collection created successfully");
    return collection;
  } catch (error) {
    logger.error("Failed to set up Zoho services collection:", error);
    throw new Error("Failed to set up Zoho services collection");
  }
};

/**
 * Create the required attributes for the Zoho Services collection
 * @param {string} collectionApiId - The collection API ID
 */
const createServiceAttributes = async (collectionApiId) => {
  try {
    logger.info("Creating attributes for Zoho services collection");

    // Basic information attributes
    await attioService.createAttribute(collectionApiId, {
      api_id: "plan_code",
      title: "Plan Code",
      data_type: "text",
      description: "Unique identifier for the plan in Zoho",
    });

    await attioService.createAttribute(collectionApiId, {
      api_id: "plan_name",
      title: "Plan Name",
      data_type: "text",
      description: "Name of the service plan",
    });

    await attioService.createAttribute(collectionApiId, {
      api_id: "description",
      title: "Description",
      data_type: "text",
      description: "Detailed description of the service plan",
    });

    // Pricing attributes
    await attioService.createAttribute(collectionApiId, {
      api_id: "price",
      title: "Price",
      data_type: "currency",
      description: "Price of the service plan",
    });

    await attioService.createAttribute(collectionApiId, {
      api_id: "interval",
      title: "Billing Interval",
      data_type: "text",
      description: "Frequency of billing (monthly, yearly, etc.)",
    });

    // Additional attributes
    await attioService.createAttribute(collectionApiId, {
      api_id: "status",
      title: "Status",
      data_type: "text",
      description: "Current status of the plan (active, inactive)",
    });

    await attioService.createAttribute(collectionApiId, {
      api_id: "zoho_plan_id",
      title: "Zoho Plan ID",
      data_type: "text",
      description: "Internal ID of the plan in Zoho",
    });

    logger.info("Attributes created successfully");
  } catch (error) {
    logger.error("Failed to create attributes:", error);
    throw new Error("Failed to create service attributes");
  }
};

/**
 * Synchronize service plans from Zoho to Attio
 * @returns {Promise<Object>} Synchronization result
 */
const synchronizeServices = async () => {
  try {
    logger.info("Starting synchronization of Zoho services to Attio");

    // Ensure the services collection exists
    await setupServicesCollection();

    // Get all plans from Zoho
    const zohoPlans = await zohoService.getPlans();
    logger.info(`Retrieved ${zohoPlans.length} plans from Zoho`);

    // Get existing services from Attio
    const existingServices = await attioService.getObjectsFromCollection(
      ZOHO_SERVICES_COLLECTION_API_ID
    );

    // Create a map of existing services by plan code for easy lookup
    const existingServiceMap = {};
    existingServices.forEach((service) => {
      const planCode = service.values.plan_code;
      if (planCode) {
        existingServiceMap[planCode] = service;
      }
    });

    // Track synchronization statistics
    const syncStats = {
      total: zohoPlans.length,
      created: 0,
      updated: 0,
      unchanged: 0,
      failed: 0,
    };

    // Process each plan
    for (const plan of zohoPlans) {
      try {
        // Map Zoho plan to Attio service object
        const serviceData = mapZohoPlanToAttioService(plan);

        // Check if service already exists
        if (existingServiceMap[plan.plan_code]) {
          // Update existing service
          await attioService.updateObjectInCollection(
            ZOHO_SERVICES_COLLECTION_API_ID,
            existingServiceMap[plan.plan_code].id,
            serviceData
          );
          syncStats.updated++;
          logger.info(`Updated service: ${plan.name} (${plan.plan_code})`);
        } else {
          // Create new service
          await attioService.createObjectInCollection(
            ZOHO_SERVICES_COLLECTION_API_ID,
            serviceData
          );
          syncStats.created++;
          logger.info(`Created service: ${plan.name} (${plan.plan_code})`);
        }
      } catch (error) {
        syncStats.failed++;
        logger.error(`Failed to sync plan ${plan.plan_code}:`, error);
      }
    }

    logger.info("Service synchronization completed", { stats: syncStats });
    return {
      success: true,
      stats: syncStats,
    };
  } catch (error) {
    logger.error("Service synchronization failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Map a Zoho plan to an Attio service object
 * @param {Object} plan - The Zoho plan
 * @returns {Object} - The Attio service object
 */
const mapZohoPlanToAttioService = (plan) => {
  return {
    values: {
      plan_code: plan.plan_code,
      plan_name: plan.name,
      description: plan.description || "",
      price: {
        amount: plan.price,
        currency: plan.currency_code || "USD",
      },
      interval: plan.interval || "month",
      status: plan.status || "active",
      zoho_plan_id: plan.plan_id,
    },
  };
};

module.exports = {
  synchronizeServices,
  setupServicesCollection,
};
