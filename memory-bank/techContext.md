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

## Node.js Backend

The Attio Integration API is built on Node.js using Express.js as the web framework. This provides a lightweight, flexible foundation for our API implementation with strong community support and excellent compatibility with the services we're integrating.

### Key Libraries & Dependencies

- **express**: Web framework for API endpoints and middleware
- **axios**: HTTP client for API requests to external services
- **dotenv**: Environment variable management
- **winston**: Structured logging
- **body-parser**: Request body parsing middleware
- **helmet**: Security-focused middleware

## APIs & Integrations

### Attio API

- **API Base URL**: https://api.attio.com
- **API Version**: v2
- **Authentication**: API Key
- **Documentation**: https://developers.attio.com/
- **Primary Operations**:
  - Reading/writing to collections
  - Object CRUD operations
  - Webhook management

### Zoho Subscriptions API

- **API Base URL**: https://www.zohoapis.com/billing
- **API Version**: v1
- **Authentication**: OAuth 2.0 with refresh token
- **Documentation**: https://www.zoho.com/subscriptions/api/v1/
- **Primary Operations**:
  - Fetch plans/services
  - Customer management
  - Subscription management
  - Invoice tracking

### Braintree API

- **SDK**: braintree Node.js SDK
- **Environment**: Sandbox/Production toggle
- **Authentication**: API keys (merchant ID, public key, private key)
- **Documentation**: https://developer.paypal.com/braintree/docs/
- **Primary Operations**:
  - Payment link generation
  - Customer creation/management
  - Payment processing
  - Webhook handling

## Infrastructure & Environment

### Deployment Platform

- **Hosting**: Render.com
- **Environment**: Node.js
- **Deployment Method**: GitHub integration
- **Environment Variables**: Managed through Render.com dashboard
- **Scaling**: Auto-scaling with serverless approach

### Monitoring & Logging

- **Logging**: Winston for structured logging
- **Log Storage**: Render.com log streams
- **Monitoring**: Render.com built-in monitoring
- **Alerting**: To be configured via Render.com webhooks

## Security Considerations

### Authentication

- **API Access**: Bearer token authentication
- **Token Storage**: Environment variables
- **External APIs**: Credentials stored in environment variables
- **Token Regeneration**: Manual process via utility script

### Data Protection

- **Sensitive Data**: Never logged or exposed via API
- **Request Validation**: Middleware for validating request formats
- **Rate Limiting**: To be implemented via Render.com
- **Input Sanitization**: Implemented in controllers

### Webhook Security

- **Signature Verification**: Required for all incoming webhooks
- **Request Replay Protection**: Timestamp validation
- **Secret Key Management**: Environment variables per integration

## Development Environment

### Local Setup

- **Package Manager**: pnpm for dependency management
- **Environment Configuration**: .env file for local development
- **Local Testing**: Express server on localhost
- **Version Control**: Git with GitHub

### Testing Approach

- **Unit Testing**: Service modules with mocked responses
- **Integration Testing**: API endpoints
- **Manual Testing**: Webhooks via utility scripts

### Documentation

- **API Documentation**: In-code JSDoc and standalone docs
- **Setup Instructions**: README.md
- **Memory Bank**: Structured documentation for knowledge preservation

## Development Workflow

### API Implementation Pattern

1. Define API endpoint in routes
2. Create controller function with business logic
3. Use service modules to interact with external APIs
4. Implement proper error handling and response formatting
5. Add authentication and validation middleware
6. Test endpoint with real credentials in development environment

### Integration Implementation Pattern

1. Research API capabilities and requirements
2. Create service module with authentication handling
3. Implement core API operations as functions
4. Add error handling and retry logic
5. Create utility scripts for testing service functions
6. Document integration details

## EJS Frontend Implementation

### Required NPM Packages

```json
{
  "dependencies": {
    "ejs": "^3.1.9",
    "express": "^5.1.0",
    "marked": "^11.1.1",
    "sanitize-html": "^2.11.0",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

### Configuration Changes

The existing Express application needs to be configured to support EJS templates and static file serving:

```javascript
// src/index.js - Add EJS configuration
const path = require("path");

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Add compression for better performance
app.use(compression());

// Add cookie parser for session management
app.use(cookieParser());
```

### Folder Structure Changes

New directories need to be added to the existing project structure:

```
src/
├── views/              # EJS templates (new)
│   ├── layouts/        # Layout templates
│   ├── partials/       # Reusable components
│   ├── proposals/      # Proposal templates
│   ├── quotes/         # Quote templates
│   └── errors/         # Error pages
├── public/             # Static assets (new)
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side JavaScript
│   └── images/         # Image assets
├── routes/
│   ├── api/            # Existing API routes
│   └── views/          # Frontend routes (new)
├── controllers/
│   ├── api/            # Existing API controllers
│   └── views/          # Frontend controllers (new)
└── utils/
    └── markdown.js     # Markdown processing (new)
```

### Tailwind CSS Setup

To use Tailwind CSS for styling:

1. Install required packages:

   ```bash
   pnpm add -D tailwindcss postcss autoprefixer
   ```

2. Initialize Tailwind configuration:

   ```bash
   npx tailwindcss init
   ```

3. Create a `postcss.config.js` file:

   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. Configure Tailwind in `tailwind.config.js`:

   ```javascript
   module.exports = {
     content: ["./src/views/**/*.ejs"],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

5. Create a CSS file in `src/public/css/styles.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. Add a build script to `package.json`:
   ```json
   "scripts": {
     "build:css": "tailwindcss -i ./src/public/css/styles.css -o ./src/public/css/output.css",
     "dev": "nodemon src/index.js & pnpm build:css --watch"
   }
   ```

### EJS Template Structure

Basic structure for the main layout template:

```html
<!-- src/views/layouts/main.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/output.css" />
  </head>
  <body class="bg-gray-50 min-h-screen">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900"><%= title %></h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"><%- body %></main>
    <footer class="bg-white border-t mt-auto">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500"
      >
        &copy; <%= new Date().getFullYear() %> - All rights reserved
      </div>
    </footer>
  </body>
</html>
```

### Implementation Steps

1. **Install dependencies:**

   ```bash
   pnpm add ejs marked sanitize-html compression cookie-parser
   pnpm add -D tailwindcss postcss autoprefixer
   ```

2. **Create folder structure:**

   ```bash
   mkdir -p src/views/{layouts,partials,proposals,quotes,errors}
   mkdir -p src/public/{css,js,images}
   mkdir -p src/routes/views
   mkdir -p src/controllers/views
   ```

3. **Create initial template files:**

   - Layout template (as shown above)
   - Error templates (404, 500, etc.)
   - Basic proposal template

4. **Create routes and controllers:**

   - View routes
   - Proposal/quote controllers
   - Authentication middleware

5. **Configure Express for EJS:**

   - Update index.js with template engine config
   - Add static file serving
   - Add compression middleware

6. **Implement markdown conversion utility:**

   - Create utility function for markdown to HTML conversion
   - Add sanitization to prevent XSS attacks

7. **Implement secure URL generation:**

   - Token generation function
   - Token validation middleware
   - Attio integration for storage

8. **Style templates with Tailwind:**

   - Configure Tailwind CSS
   - Create base styles
   - Implement responsive design

9. **Test and refine:**
   - Test with mock data
   - Verify secure access with tokens
   - Test markdown rendering

### Development Workflow

The enhanced development workflow with EJS templates:

1. **Start development server:**

   ```bash
   pnpm dev
   ```

2. **Edit EJS templates** in the views directory
3. **Style with Tailwind classes** directly in templates
4. **Implement controllers** to fetch data from Attio
5. **Test routes** with real or mock data
6. **Refine templates** based on feedback

This approach allows for rapid development of the frontend views while leveraging the existing Express application and its integrations.
