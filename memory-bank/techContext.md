# Technical Context

## Technology Stack

### Core Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework for API endpoints
- **Axios** - HTTP client for API calls
- **dotenv** - Environment variable management
- **winston** - Logging framework

### External APIs

- **Attio API** - For CRM data operations
- **Zoho Subscriptions API** - For service/subscription management
- **Braintree API** - For payment processing

### Development Tools

- **pnpm** - Preferred package manager
- **nodemon** - Development server with hot reloading
- **Jest** - Testing framework
- **ESLint** - Code quality and style enforcement

### Deployment

- **Render.com** - Cloud hosting platform
- **Docker** - Containerization (optional)
- **GitHub** - Source code repository

## Development Environment

### Local Setup

1. Node.js (v14+) and pnpm installed
2. Local .env file with API credentials
3. ngrok or similar for local webhook testing
4. Braintree Sandbox account

### Environment Variables

```
# Zoho
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
ZOHO_REFRESH_TOKEN=...
ZOHO_ORGANIZATION_ID=...

# Attio
ATTIO_API_KEY=...

# Braintree (sandbox)
BT_ENVIRONMENT=sandbox
BT_MERCHANT_ID=...
BT_PUBLIC_KEY=...
BT_PRIVATE_KEY=...

# Webhook Secret Keys (optional)
BT_WEBHOOK_SECRET=...
ZOHO_WEBHOOK_SECRET=...
ATTIO_WEBHOOK_SECRET=...
```

### Development Workflow

1. Local development with `pnpm dev` for auto-reload
2. Webhook testing using ngrok tunnels
3. Deployment to Render.com for staging/production

### Package Management

- Use `pnpm add <package>` to add dependencies
- Use `pnpm add -D <package>` for dev dependencies
- Maintain strict versioning in package.json
- Use pnpm workspaces for potential future monorepo structure

## Technical Constraints

### API Rate Limits

- **Attio**: Varies based on plan
- **Zoho**: 25,000 requests per day, max 2 req/sec
- **Braintree**: No published limits, but throttling possible

### Authentication Requirements

- **Attio**: API key authentication
- **Zoho**: OAuth 2.0 with refresh tokens
- **Braintree**: Merchant credentials (Merchant ID, Public Key, Private Key)

### Response Time Expectations

- Webhook processing should complete in <5 seconds
- Synchronization operations can take longer but should be optimized

### Data Storage Considerations

- No dedicated database; Attio objects used as primary data store
- Limited local caching for performance optimization
- Special fields in Attio objects to track external IDs and statuses

## Security Considerations

### API Security

- All API keys and credentials stored securely in environment variables
- HTTPS for all external communications
- Webhook signature verification for all incoming webhooks

### Data Protection

- No storage of sensitive payment information (handled by Braintree)
- Logging sanitized to avoid capturing sensitive data
- API key rotation procedures documented

## Integration Dependencies

### Attio Collection Structure

Required collections in Attio:

- **Services** - Synced from Zoho, contains service offerings
- **Subscriptions** - Links customers to services, contains Braintree subscription IDs
- **Transactions** - Payment history from Braintree

### Zoho Requirements

- Zoho Subscriptions module configured
- Service plans defined with correct attributes
- API access with correct scopes enabled

### Braintree Setup

- Properly configured Braintree account (sandbox for development)
- Webhook endpoints registered in Braintree dashboard
- Test payment methods for development

## Monitoring and Maintenance

- Logging all webhook events and API operations
- Error alerting via email or Slack integration
- Regular health checks to verify integration status
