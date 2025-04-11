# Attio-Zoho Integration: Quickstart Guide

## Introduction

This quickstart guide provides an overview of the integration between Attio and Zoho, focusing on synchronizing plans and services between the two platforms. This document serves as an entry point to the more detailed guides available in the documentation.

## Available Documentation

The following guides are available for the Attio-Zoho integration:

1. **[Zoho to Attio Synchronization Guide](zoho-attio-sync-guide.md)** - Comprehensive documentation on the synchronization process, including methods, implementation details, and best practices.

2. **[Attio Object Creation Guide](attio-object-creation-guide.md)** - Detailed instructions on creating objects in Attio for Zoho plans and services, including field mappings, API usage, and error handling.

## Prerequisites

Before starting with the integration, ensure you have:

- Valid API credentials for both Zoho and Attio
- Access to both platforms with appropriate permissions
- Node.js environment set up (for running scripts)
- Basic understanding of REST APIs and JavaScript

## Quick Setup Steps

Follow these steps to quickly set up the integration:

1. **Configure Environment Variables**

   Create a `.env` file in the root directory with the following variables:

   ```
   # Attio Configuration
   ATTIO_API_KEY=your_attio_api_key

   # Zoho Configuration
   ZOHO_CLIENT_ID=your_zoho_client_id
   ZOHO_CLIENT_SECRET=your_zoho_client_secret
   ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
   ZOHO_ORGANIZATION_ID=your_zoho_organization_id
   ```

2. **Run the Synchronization Script**

   Execute the sync script to test the connection and sync a few items:

   ```bash
   node scripts/sync-zoho-items.js
   ```

   This will:

   - Test the connection to both APIs
   - Retrieve plans from Zoho
   - Create corresponding records in Attio

3. **Verify Synchronization**

   Log into Attio and check that the "Zoho Items" collection contains the synchronized plans.

## Integration Methods

There are two primary methods to integrate Zoho with Attio:

### 1. Script-Based Synchronization

Use the provided script (`sync-zoho-items.js`) to sync Zoho plans to Attio. This approach is ideal for:

- Initial data migration
- Scheduled synchronization jobs
- Bulk updates

### 2. API-Based Integration

Use the REST API endpoints to programmatically create and update objects. This approach is ideal for:

- Real-time synchronization
- Event-driven updates
- Custom integration workflows

## Common Use Cases

### Regular Data Synchronization

Set up a cron job to run the sync script on a regular schedule:

```bash
# Example cron entry to run every day at 1 AM
0 1 * * * cd /path/to/app && node scripts/sync-zoho-items.js >> /var/log/zoho-sync.log 2>&1
```

### Webhook-Triggered Updates

Configure Zoho webhooks to trigger synchronization when plans or services change:

1. Set up the webhook endpoint in Zoho to point to:

   ```
   https://your-domain.com/api/attio/webhook
   ```

2. Implement webhook handlers to process incoming events and update Attio accordingly.

### Manual Synchronization

For one-off synchronization or testing, run the script manually:

```bash
# Test sync with limited records
node scripts/sync-zoho-items.js

# Force sync of all records (if applicable)
node scripts/sync-zoho-items.js --force
```

## Security Considerations

1. **API Key Security**: Store API keys securely and never expose them in client-side code
2. **Access Control**: Use the authentication middleware to restrict access to sensitive endpoints
3. **Webhook Verification**: Implement webhook signature verification for public endpoints

## Troubleshooting

Common issues and quick solutions:

1. **Authentication Errors**:

   - Verify API keys and tokens are correct
   - Check for expiration of tokens
   - Ensure proper authorization headers

2. **Syncing Issues**:

   - Check API rate limits
   - Verify field mappings
   - Review error logs for specific API errors

3. **Connection Problems**:
   - Verify network connectivity
   - Check firewall settings
   - Confirm API endpoints are accessible

## Next Steps

After setting up the basic integration, consider:

1. **Customizing Field Mappings**: Modify the mapping functions to include additional fields
2. **Implementing Error Recovery**: Add robust error handling and retry mechanisms
3. **Setting Up Monitoring**: Add monitoring and alerting for the synchronization process
4. **Extending the Integration**: Sync additional object types beyond plans and services

## Reference

For detailed information, refer to:

- [Zoho API Documentation](https://www.zoho.com/subscriptions/api/v1/)
- [Attio API Documentation](https://developers.attio.com/reference)
- The complete guides in this documentation:
  - [Zoho to Attio Synchronization Guide](zoho-attio-sync-guide.md)
  - [Attio Object Creation Guide](attio-object-creation-guide.md)

## Support

For additional support or questions, contact the development team or refer to the internal knowledge base for more information.
