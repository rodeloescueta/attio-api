# Attio Object Creation Guide for Zoho Plans/Services

## Overview

This guide focuses specifically on creating objects in Attio for Zoho plans and services. It provides detailed instructions on how to format your data correctly, understand the API endpoints, and ensure successful object creation in Attio.

## Object Creation Process

### Understanding Attio Objects

In Attio, "objects" are the core data entities. When syncing Zoho plans/services, we create objects with specific attributes that represent the important details of these plans.

### API Endpoint

The primary endpoint for creating objects in Attio is:

```
POST /api/attio/objects
```

This endpoint is accessible via the application's API and requires authentication.

## Authentication

All requests to create objects must include an API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

The API key must have write permissions to create objects. This is verified through the middleware in the application.

## Required Fields for Zoho Plan Objects

When creating an object for a Zoho plan, include the following fields:

```json
{
  "objectType": "plan",
  "name": "Plan Name",
  "description": "Detailed plan description",
  "externalId": "zoho-plan-PLANCODE",
  "price": 99.99,
  "currency": "USD",
  "billingFrequency": "month",
  "tier": "professional",
  "status": "active"
}
```

### Field Descriptions

| Field            | Type   | Description                                | Required |
| ---------------- | ------ | ------------------------------------------ | -------- |
| objectType       | String | Type of object (use "plan" for Zoho plans) | Yes      |
| name             | String | Display name of the plan                   | Yes      |
| description      | String | Detailed description                       | No       |
| externalId       | String | Unique identifier from Zoho                | Yes      |
| price            | Number | Price amount                               | Yes      |
| currency         | String | Three-letter currency code                 | Yes      |
| billingFrequency | String | Billing interval (month, year, one-time)   | Yes      |
| tier             | String | Plan tier level                            | No       |
| status           | String | Current status (active, inactive)          | Yes      |

## Required Fields for Zoho Service Objects

For service objects, use the following format:

```json
{
  "objectType": "service",
  "name": "Service Name",
  "description": "Detailed service description",
  "externalId": "zoho-service-SERVICECODE",
  "serviceType": "consulting",
  "estimatedHours": 10,
  "price": 150.0,
  "currency": "USD",
  "status": "active"
}
```

### Field Descriptions

| Field          | Type   | Description                                      | Required |
| -------------- | ------ | ------------------------------------------------ | -------- |
| objectType     | String | Type of object (use "service" for Zoho services) | Yes      |
| name           | String | Display name of the service                      | Yes      |
| description    | String | Detailed description                             | No       |
| externalId     | String | Unique identifier from Zoho                      | Yes      |
| serviceType    | String | Type of service                                  | Yes      |
| estimatedHours | Number | Estimated hours required                         | No       |
| price          | Number | Price amount                                     | Yes      |
| currency       | String | Three-letter currency code                       | Yes      |
| status         | String | Current status (active, inactive)                | Yes      |

## Creating Objects Programmatically

### Using the API Directly

```javascript
const axios = require("axios");

const createObject = async (objectData) => {
  try {
    const response = await axios.post(
      "https://your-api-domain.com/api/attio/objects",
      objectData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_API_KEY",
        },
      }
    );

    console.log("Object created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create object:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Example usage
const planData = {
  objectType: "plan",
  name: "Enterprise Plan",
  description: "Full-featured enterprise solution",
  externalId: "zoho-plan-ENT001",
  price: 499.99,
  currency: "USD",
  billingFrequency: "year",
  tier: "enterprise",
  status: "active",
};

createObject(planData);
```

### Using the SDK (if available)

If you're working within the application's codebase, you can use the built-in Attio service:

```javascript
const attioService = require("../src/services/attio.service");

// Create a plan object
const createPlanObject = async (planData) => {
  try {
    const createdObject = await attioService.createObject(planData);
    console.log("Plan object created successfully:", createdObject.id);
    return createdObject;
  } catch (error) {
    console.error("Failed to create plan object:", error.message);
    throw error;
  }
};
```

## Creating Objects in Specific Collections

If you need to create an object in a specific collection rather than as a generic object, use the `createObjectInCollection` function:

```javascript
const attioService = require("../src/services/attio.service");

const createInCollection = async (collectionId, objectData) => {
  try {
    const result = await attioService.createObjectInCollection(
      collectionId,
      objectData
    );
    console.log(`Object created in collection ${collectionId}:`, result.id);
    return result;
  } catch (error) {
    console.error(
      `Failed to create object in collection ${collectionId}:`,
      error.message
    );
    throw error;
  }
};

// Example usage for Zoho Items collection
createInCollection("zoho_items", {
  values: {
    name: "Premium Plan",
    description: "Premium features for professional users",
    externalid: "zoho-plan-PREMIUM",
    object_type: "plan",
    price: 299.99,
    currency: "USD",
    billing_frequency: "month",
    tier: "professional",
    status: "active",
  },
});
```

## Object Mapping from Zoho to Attio

When creating objects based on Zoho data, use the following mapping function as a reference:

```javascript
function mapZohoPlanToAttioObject(plan) {
  const externalId = `zoho-plan-${plan.plan_code}`;
  return {
    objectType: "plan",
    name: plan.name,
    description: plan.description || "",
    externalId: externalId,
    price: plan.price || 0,
    currency: plan.currency_code || "USD",
    billingFrequency: plan.interval || "month",
    tier: determineTier(plan.price || 0),
    status: plan.status || "active",
  };
}

function determineTier(price) {
  if (!price) return "free";
  if (price < 50) return "basic";
  if (price < 200) return "professional";
  return "enterprise";
}
```

## Error Handling

When creating objects, handle the following common errors:

1. **Authentication Errors (401)**: Verify your API key and permissions
2. **Validation Errors (400)**: Check that all required fields are present and properly formatted
3. **Duplicate Key Errors**: Handle cases where an object with the same external ID already exists
4. **Rate Limiting (429)**: Implement retry logic with exponential backoff
5. **Server Errors (500)**: Log detailed error information for troubleshooting

Example error handling:

```javascript
try {
  const object = await attioService.createObject(objectData);
  return object;
} catch (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        console.error("Authentication failed. Check your API key.");
        break;
      case 400:
        console.error("Invalid data format:", error.response.data);
        break;
      case 409:
        console.error("Object with this external ID already exists");
        // Consider updating instead of creating
        break;
      case 429:
        console.error("Rate limit exceeded. Implement backoff and retry.");
        // Implement retry with backoff logic
        break;
      default:
        console.error(
          `Server error: ${error.response.status}`,
          error.response.data
        );
    }
  } else {
    console.error("Network error:", error.message);
  }
  throw error;
}
```

## Best Practices

1. **Validate Data**: Always validate data before sending it to the API
2. **Use External IDs**: Always include a unique external ID to prevent duplicates
3. **Include All Required Fields**: Make sure all required fields are included
4. **Handle Errors Gracefully**: Implement comprehensive error handling
5. **Use Batch Operations**: When creating multiple objects, consider batching them
6. **Log Responses**: Log both successful creations and errors for troubleshooting

## Testing Object Creation

You can test object creation using the provided test script:

```bash
node scripts/test-attio.js
```

This script creates a test object in Attio and verifies the response. You can use it as a reference for your own implementation.

## Conclusion

Creating objects in Attio for Zoho plans and services requires proper data formatting, authentication, and error handling. By following this guide, you can ensure successful object creation and maintain data consistency between your Zoho and Attio environments.
