# Attio Integration Guide

## Overview

This guide documents how to create new objects in Attio for syncing plans and services from Zoho using our API endpoints. The integration ensures that all available plans and services from Zoho are properly synchronized with Attio's CRM system.

## Authentication

All private API endpoints require authentication using an API key. The API key should be included in the Authorization header of your requests:

```
Authorization: Bearer YOUR_API_KEY
```

## Creating Objects in Attio

### Endpoint

```
POST /api/attio/objects
```

### Required Fields

When creating a new object in Attio, especially for Zoho plans/services sync, you need to include the following fields:

#### Common Fields for All Objects

- `objectType`: String - The type of object in Attio (e.g., "plan", "service", "product")
- `name`: String - The display name of the object
- `description`: String - A detailed description of the object
- `externalId`: String - The unique identifier from Zoho (used for sync reference)
- `status`: String - Current status ("active", "inactive", "archived")

#### Plan-Specific Fields

- `price`: Number - The price of the plan
- `currency`: String - The currency code (e.g., "USD", "EUR")
- `billingFrequency`: String - How often billing occurs ("monthly", "yearly", "one-time")
- `features`: Array - List of features included in the plan
- `tier`: String - Plan tier level ("basic", "professional", "enterprise")

#### Service-Specific Fields

- `serviceType`: String - Type of service ("consulting", "implementation", "support")
- `estimatedHours`: Number - Estimated hours required for the service
- `deliverables`: Array - List of deliverables provided
- `customizationOptions`: Object - Available customization options

### Example Request

```json
POST /api/attio/objects
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "objectType": "plan",
  "name": "Enterprise Plan",
  "description": "Comprehensive solution for large businesses with advanced features",
  "externalId": "zoho-plan-123456",
  "status": "active",
  "price": 499.99,
  "currency": "USD",
  "billingFrequency": "monthly",
  "features": [
    "Unlimited users",
    "24/7 support",
    "Advanced analytics",
    "Custom integrations"
  ],
  "tier": "enterprise"
}
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "att_obj_123456789",
    "objectType": "plan",
    "name": "Enterprise Plan",
    "externalId": "zoho-plan-123456",
    "createdAt": "2023-08-01T12:00:00Z",
    "updatedAt": "2023-08-01T12:00:00Z"
  }
}
```

## Updating Existing Objects

To update an existing object, use:

```
PUT /api/attio/objects/:id
```

Where `:id` is the Attio object ID. Include the same fields as in the object creation, but only with the values you want to update.

## Retrieving Object Details

To get details of a specific object:

```
GET /api/attio/objects/:id
```

Where `:id` is the Attio object ID.

## Webhook Integration

Attio can send webhook notifications to our system when objects are updated. Our webhook endpoint is:

```
POST /api/attio/webhook
```

This endpoint is secured with webhook signature verification to ensure the authenticity of the requests.

## Syncing Zoho Plans to Attio

To sync Zoho plans and services with Attio, follow these steps:

1. **Create "Zoho Items" Collection in Attio UI:**

   - Log in to your Attio account
   - Create a new collection called "Zoho Items"
   - Add the following attributes:
     - `objectType`: Text - The type of item (plan or service)
     - `name`: Text - The name of the plan/service
     - `description`: Text - Detailed description
     - `externalId`: Text - Unique identifier from Zoho
     - `status`: Text - Current status
     - `price`: Number - Price amount
     - `currency`: Text - Currency code
     - `billingFrequency`: Text - Billing frequency
     - `features`: Text - Features list
     - `tier`: Text - Plan tier level

2. **Run Sync Script:**
   - Use our provided script to sync plans from Zoho to Attio:
   ```
   node scripts/sync-zoho-items.js
   ```
3. **Schedule Regular Syncs:**
   - Set up a recurring job to run the sync script to keep Zoho and Attio data in sync
   - Recommended frequency: Daily or weekly depending on how often your Zoho plans change

### Manual API Sync

If you need to manually trigger a sync, you can use the Sync API endpoint:

```
POST /api/v1/sync/zoho/services
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
X-Permission: admin

{}
```

This will synchronize all available plans from Zoho to the Zoho Items collection in Attio.

## Best Practices

1. **Always include the external ID**: The `externalId` field is crucial for synchronization between Zoho and Attio.
2. **Keep data consistent**: Ensure naming conventions and data formats are consistent across all objects.
3. **Update objects incrementally**: When updating objects, only send the fields that have changed.
4. **Handle errors gracefully**: Check API response status codes and implement appropriate error handling.
5. **Regular synchronization**: Set up regular sync jobs to keep Zoho and Attio data in sync.

## Troubleshooting

If you encounter issues with the Attio integration:

1. Verify your API key is valid and has the correct permissions
2. Check that all required fields are included in your requests
3. Ensure the external IDs from Zoho are unique and consistent
4. Validate that the webhook URL is correctly configured in Attio
5. Review the API response for detailed error messages
