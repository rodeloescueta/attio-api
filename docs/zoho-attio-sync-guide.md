# Zoho to Attio Synchronization Guide

## Overview

This guide documents the process of synchronizing Zoho Subscription plans and services with Attio. The integration allows for seamless data flow between your Zoho subscription management and Attio CRM, ensuring that all available plans, services, and their details are accurately reflected in Attio.

## Prerequisites

Before starting the synchronization process, ensure you have:

1. Valid API credentials for both Zoho and Attio
2. Properly configured environment variables in your `.env` file:
   - `ATTIO_API_KEY`: Your Attio API key
   - `ZOHO_CLIENT_ID`: OAuth client ID for Zoho
   - `ZOHO_CLIENT_SECRET`: OAuth client secret for Zoho
   - `ZOHO_REFRESH_TOKEN`: Refresh token for Zoho OAuth
   - `ZOHO_ORGANIZATION_ID`: Your Zoho organization ID

## Synchronization Methods

There are two primary ways to sync Zoho items to Attio:

1. **Manual Script Execution**: Running the sync script directly
2. **API-Based Synchronization**: Using the API endpoints to trigger syncs programmatically

## Method 1: Manual Script Execution

### Using sync-zoho-items.js

The simplest way to sync Zoho plans to Attio is by running the provided script:

```bash
node scripts/sync-zoho-items.js
```

This script performs the following operations:

1. Connects to the Attio API and verifies the connection
2. Fetches all plans from Zoho
3. Maps Zoho plan data to the format required by Attio
4. Creates records in the "Zoho Items" collection in Attio

### Script Structure

The script follows these steps:

1. **API Connection**: Establishes connections to both Zoho and Attio APIs
2. **Data Retrieval**: Fetches plans from Zoho using `zohoService.getPlans()`
3. **Data Transformation**: Maps Zoho plan data to Attio object format using `mapZohoPlanToAttioItem()`
4. **Data Creation**: Creates records in Attio's "Zoho Items" collection

### Data Mapping

When syncing from Zoho to Attio, the following fields are mapped:

| Zoho Field    | Attio Field       | Description                                    |
| ------------- | ----------------- | ---------------------------------------------- |
| name          | name              | Plan/service name                              |
| description   | description       | Detailed description                           |
| plan_code     | externalid        | Unique identifier (prefixed with "zoho-plan-") |
| price         | price             | Numerical price value                          |
| currency_code | currency          | Currency code (e.g., USD, EUR)                 |
| interval      | billing_frequency | Billing interval (month, year, etc.)           |
| status        | status            | Current status (active, inactive)              |
| -             | object_type       | Always set to "plan" for Zoho plans            |
| -             | tier              | Calculated based on price                      |

## Method 2: API-Based Synchronization

The application provides REST API endpoints that can be used to programmatically sync data:

### Create a Single Object

```
POST /api/attio/objects
```

This endpoint creates a new object in Attio. Authentication is required via an API key.

#### Request Body Example:

```json
{
  "objectType": "plan",
  "name": "Professional Plan",
  "description": "Complete access to all professional features",
  "externalId": "zoho-plan-PRO001",
  "price": 99.99,
  "currency": "USD",
  "billingFrequency": "month",
  "tier": "professional",
  "status": "active"
}
```

#### Required Headers:

```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### Setting Up a Collection

Before syncing items, ensure the appropriate collection exists in Attio. The service provides a `setupServicesCollection` function that:

1. Checks if the "Zoho Services" collection exists
2. Creates it if it doesn't exist
3. Adds required attributes for proper data representation

## Implementation Details

### Attio Service Functions

The following key functions handle interaction with Attio:

- `createObject`: Creates a generic object in Attio
- `createObjectInCollection`: Creates an object in a specific collection
- `createCollection`: Creates a new collection in Attio

### Zoho Service Functions

The following key functions retrieve data from Zoho:

- `getPlans`: Retrieves all available plans from Zoho Subscriptions
- `getPlanDetails`: Gets detailed information about a specific plan
- `getAddons`: Retrieves available add-ons that can be attached to plans

## Best Practices

1. **Regular Synchronization**: Schedule regular sync jobs to ensure data consistency
2. **Error Handling**: Implement proper error handling and monitoring for sync processes
3. **Logging**: Maintain detailed logs of synchronization activities for troubleshooting
4. **Incremental Updates**: When possible, only sync changed or new items to improve performance
5. **Validation**: Validate data before syncing to ensure proper formatting

## Troubleshooting

Common issues and their solutions:

1. **Authentication Failures**:

   - Verify that API keys and tokens are valid and not expired
   - Check that the correct environment variables are set

2. **Mapping Errors**:

   - Ensure all required fields are properly mapped
   - Check for any changes in API schemas that might require updates to mapping logic

3. **Rate Limiting**:

   - Implement retry mechanisms with exponential backoff
   - Consider batching requests to stay within API limits

4. **Missing Data**:
   - Verify that the source data exists in Zoho
   - Check for any filters that might be excluding certain items

## Advanced Configuration

The synchronization can be customized in several ways:

1. **Custom Field Mappings**: Modify the `mapZohoPlanToAttioItem` function to include additional fields
2. **Selective Synchronization**: Implement filters to sync only specific plans or services
3. **Batch Processing**: Adjust batch sizes for optimal performance when processing large datasets
4. **Webhook Integration**: Set up webhooks to trigger syncs when data changes in Zoho

## Setup for Production

For production deployments:

1. Set up a scheduled job (cron, etc.) to run the sync script regularly
2. Implement proper monitoring and alerting for the sync process
3. Consider using a queue system for handling large sync operations asynchronously
4. Implement proper error recovery mechanisms

## Conclusion

The Zoho to Attio synchronization ensures that your CRM system always has the most up-to-date information about your subscription plans and services. By following this guide, you can effectively manage the data flow between these systems, providing your team with accurate information for sales and customer management.
