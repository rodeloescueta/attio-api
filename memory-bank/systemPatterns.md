# System Patterns

This document outlines the key architectural patterns, coding conventions, and system design decisions for the Attio Integration API.

## 1. Service Architecture

We're using a modular service-based architecture to organize the codebase:

- **Services**: Encapsulate external API interactions (attioService.js, zohoService.js, braintreeService.js)
- **Controllers**: Handle request/response logic and coordinate services
- **Routes**: Define API endpoints and apply middleware
- **Middleware**: Cross-cutting concerns like authentication, logging, and validation
- **Utils**: Shared helper functions and utilities
- **Config**: Application configuration management

## 2. API Design Patterns

### RESTful Endpoints

- Use resource-based URLs following REST principles
- Implement proper HTTP methods (GET, POST, PUT, DELETE)
- Return appropriate status codes and consistent response formats
- Endpoints grouped by resource domain (e.g., /api/sync, /api/webhooks)

### Response Format

All API responses follow a consistent format:

```javascript
// Success response
{
  "success": true,
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE", // Optional
    "details": { /* Additional error details */ } // Optional
  }
}
```

## 3. Authentication & Security

### API Key Authentication

- Bearer token authentication for API access
- Token stored as environment variable (`API_ACCESS_TOKEN`)
- Authentication middleware applied to protected routes

### External API Authentication

#### Attio

- API Key based authentication
- Keys stored as environment variables

#### Zoho

- OAuth 2.0 with refresh token
- Automatic token refresh handling
- Credentials stored as environment variables

#### Braintree

- API keys for authentication
- Sandbox/Production environment toggle
- Credentials stored as environment variables

### Webhook Security

- Signature verification for incoming webhooks
- Unique secret keys for each integration
- Request timestamp validation to prevent replay attacks

## 4. Error Handling

### Centralized Error Management

- Custom error classes with HTTP status codes
- Global error handling middleware
- Consistent error response format
- Detailed logging for debugging

### Retry Mechanism

- Exponential backoff for failed API calls
- Configurable retry limits
- Circuit breaker pattern for persistent failures

## 5. Logging

### Structured Logging

- Winston logger for structured logging
- Log levels based on environment (development/production)
- Request/response logging middleware
- Performance metrics and timing information

### Audit Trail

- Log important business operations for audit purposes
- Track synchronization status and results
- Record webhook receipt and processing

## 6. Configuration Management

### Environment-Based Configuration

- Environment variables with dotenv
- Separate configuration for development and production
- Validation of required configuration values
- Sensitive data never logged or exposed

## 7. Testing Approach

### Service Testing

- Unit tests for service modules
- Mocked external API responses
- Testing utilities for common scenarios

### Integration Testing

- API endpoint testing with supertest
- End-to-end flow validation
- Webhook payload verification

## 8. Code Style & Organization

### Functional Programming

- Pure functions over classes where possible
- Immutable data structures
- Function composition for complex operations
- Clear separation of concerns

### File Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
│   ├── api/          # API controllers
│   └── views/        # Frontend view controllers
├── middleware/       # Express middleware
├── routes/           # Route definitions
│   ├── api/          # API routes
│   └── views/        # Frontend view routes
├── services/         # External API integrations
├── utils/            # Helper functions
│   └── markdown.js   # Markdown processing utility
├── views/            # EJS templates
│   ├── layouts/      # Layout templates
│   ├── partials/     # Reusable template parts
│   ├── proposals/    # Proposal view templates
│   └── quotes/       # Quote view templates
├── public/           # Static assets
│   ├── css/          # Stylesheets
│   ├── js/           # Client-side JavaScript
│   └── images/       # Image assets
└── index.js          # Application entry point
```

### Naming Conventions

- camelCase for variables, functions, and files
- PascalCase for classes and types
- UPPER_SNAKE_CASE for constants
- Descriptive, intention-revealing names

## 9. API Integration Patterns

### Adapter Pattern

- Service modules adapt external APIs to internal interfaces
- Abstract away platform-specific details
- Standardized error handling and response formatting

### Facade Pattern

- Simplified interfaces for complex subsystems
- Controllers use facades to coordinate multiple services
- Clean separation between API routes and business logic

### Repository Pattern

- Services provide data access abstraction
- Consistent CRUD operations regardless of data source
- Data mapping between different API formats

## 10. Webhook Processing

### Event-Driven Architecture

- Webhook endpoints for real-time updates
- Event validation and processing pipeline
- Queuing for high-volume webhook handling

### Idempotent Processing

- Safe to process the same webhook multiple times
- Check for duplicate events
- Transactional processing where possible

## 11. Synchronization Strategy

### Scheduled Synchronization

- Periodic synchronization for data consistency
- Incremental updates when possible
- Record last sync time for efficient processing

### Change Detection

- Compare existing data before updating
- Skip unchanged records
- Log synchronization results for audit

## Frontend Implementation with EJS

### Architecture Overview

We're implementing a client-facing frontend using EJS templates integrated with our existing Express.js API. This approach allows us to:

1. Leverage our existing Express.js application
2. Render dynamic HTML pages for client proposals and quotes
3. Display data from Attio directly in the templates
4. Process markdown content into formatted HTML
5. Maintain a clean separation between API and client-facing routes

### Folder Structure

We'll extend our existing structure to include frontend components:

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
│   ├── api/          # API controllers
│   └── views/        # Frontend view controllers
├── middleware/       # Express middleware
├── routes/           # Route definitions
│   ├── api/          # API routes
│   └── views/        # Frontend view routes
├── services/         # External API integrations
├── utils/            # Helper functions
│   └── markdown.js   # Markdown processing utility
├── views/            # EJS templates
│   ├── layouts/      # Layout templates
│   ├── partials/     # Reusable template parts
│   ├── proposals/    # Proposal view templates
│   └── quotes/       # Quote view templates
├── public/           # Static assets
│   ├── css/          # Stylesheets
│   ├── js/           # Client-side JavaScript
│   └── images/       # Image assets
└── index.js          # Application entry point
```

### EJS Template Organization

We'll use a template inheritance pattern:

1. **Layouts**: Base templates that define the page structure
2. **Partials**: Reusable components like headers, footers, and navigation
3. **View-specific templates**: Content for specific pages (proposals, quotes)

### Routes & Controllers

```javascript
// routes/views/index.js
const express = require("express");
const router = express.Router();
const proposalController = require("../../controllers/views/proposalController");
const quoteController = require("../../controllers/views/quoteController");

// Proposal routes
router.get("/proposals/:id", proposalController.getProposal);

// Quote routes
router.get("/quotes/:id", quoteController.getQuote);

module.exports = router;
```

```javascript
// controllers/views/proposalController.js
const attioService = require("../../services/attioService");
const markdownUtils = require("../../utils/markdown");

async function getProposal(req, res) {
  try {
    const { id } = req.params;

    // Fetch proposal data from Attio
    const proposalData = await attioService.getProposal(id);

    // Convert markdown to HTML
    if (proposalData.serviceAgreement) {
      proposalData.serviceAgreementHtml = await markdownUtils.convertToHtml(
        proposalData.serviceAgreement
      );
    }

    // Render the proposal view with data
    res.render("proposals/show", {
      title: `Proposal - ${proposalData.title || id}`,
      proposal: proposalData,
    });
  } catch (error) {
    // Handle errors
    res.status(404).render("errors/not-found", {
      message: "Proposal not found",
    });
  }
}

module.exports = {
  getProposal,
};
```

### Secure URL Generation

We'll implement a secure URL generation system:

```javascript
// utils/urlGenerator.js
const crypto = require("crypto");

function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

function generateProposalUrl(proposalId, expiryDate) {
  const token = generateSecureToken();

  // Store token with expiry in database or Attio
  // This is a simplified example

  return `/proposals/${proposalId}?token=${token}`;
}

module.exports = {
  generateSecureToken,
  generateProposalUrl,
};
```

### Authentication Middleware

To secure client-facing views:

```javascript
// middleware/tokenAuth.js
const attioService = require("../services/attioService");

async function validateViewToken(req, res, next) {
  const { token } = req.query;
  const { id } = req.params;

  if (!token) {
    return res.status(401).render("errors/unauthorized", {
      message: "Access token is required",
    });
  }

  try {
    // Validate token against stored value
    // This is a simplified example
    const isValid = await attioService.validateViewToken(id, token);

    if (!isValid) {
      return res.status(401).render("errors/unauthorized", {
        message: "Invalid or expired access token",
      });
    }

    next();
  } catch (error) {
    res.status(500).render("errors/error", {
      message: "Error validating access",
    });
  }
}

module.exports = {
  validateViewToken,
};
```

### Markdown Processing

For converting markdown content to HTML:

```javascript
// utils/markdown.js
const marked = require("marked");
const sanitizeHtml = require("sanitize-html");

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub flavored markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: true, // Add IDs to headers
  mangle: false, // Don't escape HTML
});

async function convertToHtml(markdown) {
  if (!markdown) return "";

  // Convert markdown to HTML
  const html = marked.parse(markdown);

  // Sanitize HTML to prevent XSS
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "span",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "id", "style"],
    },
  });

  return sanitizedHtml;
}

module.exports = {
  convertToHtml,
};
```

### Express Configuration

To set up EJS in the existing Express app:

```javascript
// index.js
const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/api");
const viewRoutes = require("./routes/views");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", apiRoutes);

// View routes
app.use("/", viewRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Data Flow

The data flow for the frontend views will be:

1. Client requests a proposal/quote URL with a secure token
2. Authentication middleware validates the token
3. Controller fetches data from Attio using the existing service
4. Markdown content is processed into HTML
5. Data is passed to the EJS template for rendering
6. Rendered HTML is sent to the client

### CSS Framework Recommendation

For the frontend styling, we'll use Tailwind CSS:

- Utility-first approach allows rapid development
- Small production bundle size with PurgeCSS
- Responsive design built-in
- Customizable to match brand requirements
- No need for large CSS frameworks

### Print & Export Functionality

For print and PDF export capabilities:

1. Optimize CSS for print media queries
2. Provide a "Print" button that triggers browser print
3. For PDF export, use client-side libraries or server-side rendering with tools like Puppeteer

### Progressive Enhancement

Our frontend implementation will follow progressive enhancement principles:

1. Core content and functionality works without JavaScript
2. JavaScript enhances the experience where appropriate
3. Responsive design works on all device sizes
4. Accessibility built in from the start
