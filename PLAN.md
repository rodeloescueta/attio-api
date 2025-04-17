# PLAN.md – Attio + Zoho + Braintree Integration API

## 📌 Overview

This API acts as a bridge between:

- **Zoho** – for service offerings and subscription logic (accounting/billing).
- **Attio** – as your CRM and frontend data store.
- **Braintree** – for payment gateway.

The goal is to:

- Sync services from Zoho → Attio.
- Let users in Attio trigger subscriptions.
- Handle billing and subscription lifecycle via Braintree.
- Avoid a separate database by leveraging **Attio objects** as your source of truth.

---

## 🧱 Project Structure

```

project/
├── index.js
├── routes/
│ ├── zoho.js # Sync & Webhooks from Zoho
│ ├── attio.js # Webhooks or triggers from Attio
│ └── braintree.js # Webhooks from Braintree
├── services/
│ ├── zohoService.js # Fetch service plans from Zoho
│ ├── attioService.js # Update/fetch Attio collections
│ └── braintreeService.js# Create customer, subscription, etc.
├── utils/
│ └── verifySignature.js # Optional webhook signature validation
├── Dockerfile # Optional Docker support
├── .env # Render.com environment setup
└── README.md

```

---

## 🚀 Deployment – Render.com

### 🔧 Setup Instructions

1. Push your repo to GitHub.
2. Create a **Web Service** on [Render.com](https://dashboard.render.com).
3. Connect your GitHub repo.
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment Variables** (see below).

---

## 🔐 Environment Variables

Set these inside your Render.com service:

```bash
# Zoho
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
ZOHO_REFRESH_TOKEN=...
ZOHO_ORGANIZATION_ID=...

# Attio
ATTIO_API_KEY=...

# Braintree (sandbox)
BT_ENVIRONMENT=sandbox
BT_MERCHANT_ID=your_sandbox_merchant_id
BT_PUBLIC_KEY=your_sandbox_public_key
BT_PRIVATE_KEY=your_sandbox_private_key

# Webhook Secret Keys (optional)
BT_WEBHOOK_SECRET=...
ZOHO_WEBHOOK_SECRET=...
ATTIO_WEBHOOK_SECRET=...

```

---

## 📡 Webhook Endpoints

| Endpoint                   | Source    | Description                                       |
| -------------------------- | --------- | ------------------------------------------------- |
| `POST /webhooks/zoho`      | Zoho      | Receives service/plan changes or customer updates |
| `POST /webhooks/attio`     | Attio     | Receives trigger when user selects a service      |
| `POST /webhooks/braintree` | Braintree | Receives billing/subscription events              |

All of these endpoints handle updates using **APIs** and **Attio objects**—no separate database required.

---

## 🔃 Sync Workflow

1. **Zoho → Attio (Service Sync)**
   - Pull service offerings via Zoho API.
   - Create/update a "Services" collection in Attio.
2. **Attio → Braintree (Subscription Trigger)**
   - User selects a service from Attio.
   - Webhook to this custom API triggers a new Braintree subscription.
   - Store the Braintree subscription ID inside the Attio user/company object.
3. **Braintree → Attio (Subscription Events)**
   - Braintree sends events (payment success, failure, cancellation).
   - Update corresponding Attio record fields to reflect the billing state.

---

## 🧪 Test Mode (with Braintree Sandbox)

1. Create a Braintree **sandbox account** at

   [https://sandbox.braintreegateway.com](https://sandbox.braintreegateway.com/)

2. Use test credentials in `.env`:
   - `BT_MERCHANT_ID`
   - `BT_PUBLIC_KEY`
   - `BT_PRIVATE_KEY`
3. Reference [Test Cards](https://developer.paypal.com/braintree/docs/reference/general/testing) (e.g., `4111 1111 1111 1111`).
4. Simulate subscriptions and billing with sandbox plans.

---

## 🧪 Testing Phase

- [ ] Deploy the app to Render (test environment).
- [ ] Connect Zoho webhook → `POST /webhooks/zoho`.
- [ ] Connect Braintree webhook → `POST /webhooks/braintree`.
- [ ] Connect Attio webhook → `POST /webhooks/attio`.
- [ ] Trigger a test service subscription and observe data flow.
- [ ] Check the Braintree Sandbox dashboard for events.

---

## 🚀 Go Live (Production)

1. Switch Braintree environment variables from sandbox to production:

   ```bash
   BT_ENVIRONMENT=production
   BT_MERCHANT_ID=...
   BT_PUBLIC_KEY=...
   BT_PRIVATE_KEY=...

   ```

2. Set up **live webhooks** in Zoho, Attio, and Braintree.
3. Test with real payment methods or low-cost plan.

---

## ✅ Optional Enhancements

- Implement a retry queue if webhook handling fails.
- Validate webhook signatures for additional security.
- Rate limit inbound requests.
- Set up an email or notification system (e.g., on payment failure).

---

## 📚 References

- [Zoho Subscriptions API](https://www.zoho.com/subscriptions/api/v1/)
- [Attio API Docs](https://developers.attio.com/)
- [Braintree Node SDK](https://github.com/braintree/braintree_node)
- [Render.com Documentation](https://render.com/docs)

---

## 🧠 Final Notes

- This backend API handles logic; no dedicated frontend is necessary.
- Attio handles CRM + user interface.
- Zoho remains the canonical source of services.
- Braintree manages payment and subscription lifecycles.

# Implementation Plan

## Phase 1: Project Setup and Infrastructure (Complete)

1. ✅ Set up repository and project structure
2. ✅ Initialize Express.js application with middleware
3. ✅ Configure environment variables with dotenv
4. ✅ Implement basic logging with Winston
5. ✅ Create authentication middleware (API key auth)
6. ✅ Set up route structure
7. ✅ Implement error handling pattern
8. ✅ Create basic response formatting utilities

## Phase 2: Zoho-Attio Service Synchronization (Complete)

1. ✅ Implement Zoho service with authentication
2. ✅ Create OAuth token management for Zoho
3. ✅ Implement Attio service for collection management
4. ✅ Develop plan data mapping between Zoho and Attio
5. ✅ Create synchronization service connecting both APIs
6. ✅ Implement endpoints for triggering synchronization
7. ✅ Add logging for synchronization process
8. ✅ Test complete flow with production data

## Phase 3: Braintree Integration (In Progress)

1. 🔄 Implement Braintree service with environment configuration
2. 🔄 Set up authentication with Braintree API
3. ⬜ Create payment link generation functionality
4. ⬜ Add customer creation/management operations
5. ⬜ Implement payment method storage and processing
6. ⬜ Set up webhook handlers for Braintree events
7. ⬜ Test payment flow with sandbox environment

## Phase 4: Subscription Management Flow (Not Started)

1. ⬜ Enhance Attio service for handling client objects
2. ⬜ Create unified client object schema with all IDs
3. ⬜ Implement Zoho customer creation from Attio data
4. ⬜ Develop subscription creation in Zoho
5. ⬜ Set up subscription activation workflow
6. ⬜ Add Braintree ID storage in Attio
7. ⬜ Test full subscription workflow

## Phase 5: Invoice & Payment Processing (Not Started)

1. ⬜ Implement Zoho invoice webhook handler
2. ⬜ Create invoice data processing logic
3. ⬜ Develop payment processing with stored methods
4. ⬜ Add payment confirmation to Zoho
5. ⬜ Implement payment status tracking in Attio
6. ⬜ Create retry mechanism for failed payments
7. ⬜ Test complete invoice-to-payment flow

## Phase 6: Error Handling & Resilience (Not Started)

1. ⬜ Enhance error reporting and categorization
2. ⬜ Implement retry logic for all API calls
3. ⬜ Add circuit breaker pattern for external services
4. ⬜ Create monitoring endpoints for service health
5. ⬜ Implement logging for all critical operations
6. ⬜ Develop reconciliation process for missed events
7. ⬜ Test fault injection scenarios

## Phase 7: Testing & Deployment (Not Started)

1. ⬜ Create comprehensive tests for all services
2. ⬜ Implement end-to-end testing for main workflows
3. ⬜ Set up Render.com deployment configuration
4. ⬜ Configure environment variables on Render.com
5. ⬜ Implement CI/CD pipeline with GitHub
6. ⬜ Document deployment and maintenance procedures
7. ⬜ Deploy to production environment

## EJS Frontend Implementation (Not Started)

### Phase 1: Setup & Configuration (1-2 days)

1. ⬜ Install required dependencies:

   ```bash
   pnpm add ejs marked sanitize-html compression cookie-parser
   pnpm add -D tailwindcss postcss autoprefixer
   ```

2. ⬜ Create directory structure for EJS templates:

   ```bash
   mkdir -p src/views/{layouts,partials,proposals,quotes,errors}
   mkdir -p src/public/{css,js,images}
   mkdir -p src/routes/views
   mkdir -p src/controllers/views
   ```

3. ⬜ Update Express configuration in `src/index.js`:

   - Add view engine setup
   - Configure static file serving
   - Add compression middleware
   - Add view routes

4. ⬜ Configure Tailwind CSS:
   - Initialize with `npx tailwindcss init`
   - Create postcss.config.js
   - Set up content paths in tailwind.config.js
   - Create initial CSS file with Tailwind imports
   - Add build script to package.json

### Phase 2: Core Utilities & Middleware (1-2 days)

1. ⬜ Create markdown processing utility:

   - Implement `src/utils/markdown.js`
   - Add sanitization to prevent XSS
   - Add support for GitHub Flavored Markdown

2. ⬜ Implement secure URL generation:

   - Create `src/utils/urlGenerator.js`
   - Add token generation functions
   - Implement expiration logic

3. ⬜ Develop authentication middleware:
   - Create `src/middleware/tokenAuth.js`
   - Implement token validation logic
   - Add integration with Attio for token storage

### Phase 3: Base Templates & Layout (1-2 days)

1. ⬜ Create layout template:

   - Implement `src/views/layouts/main.ejs`
   - Add responsive design with Tailwind
   - Include header, footer, and main content area

2. ⬜ Develop error page templates:

   - Create 404 not found page
   - Create 500 server error page
   - Create unauthorized access page

3. ⬜ Add common partials:
   - Create header partial
   - Create footer partial
   - Add navigation components if needed

### Phase 4: Proposal View Implementation (2-3 days)

1. ⬜ Create proposal routes:

   - Implement `src/routes/views/index.js`
   - Add route for `/proposals/:id`
   - Apply token validation middleware

2. ⬜ Develop proposal controller:

   - Create `src/controllers/views/proposalController.js`
   - Add data fetching from Attio
   - Implement markdown conversion for service agreements

3. ⬜ Create proposal template:
   - Implement `src/views/proposals/show.ejs`
   - Design responsive layout for services and pricing
   - Add service agreement section with formatting
   - Implement print-friendly styling

### Phase 5: Quote View Implementation (2-3 days)

1. ⬜ Create quote routes:

   - Add route for `/quotes/:id`
   - Apply token validation middleware

2. ⬜ Develop quote controller:

   - Create `src/controllers/views/quoteController.js`
   - Add data fetching from Attio
   - Implement quote-specific business logic

3. ⬜ Create quote template:
   - Implement `src/views/quotes/show.ejs`
   - Design responsive layout for quote items
   - Add dynamic pricing calculations if needed
   - Implement print-friendly styling

### Phase 6: Attio Integration & URL Generation (2-3 days)

1. ⬜ Enhance Attio service for frontend data:

   - Add functions to retrieve proposal data
   - Implement quote data retrieval
   - Create token storage and validation functions

2. ⬜ Create URL generation endpoints:

   - Add API route for generating proposal URLs
   - Implement quote URL generation
   - Store tokens and expiration dates in Attio

3. ⬜ Add token validation logic:
   - Implement token verification with Attio
   - Add expiration checking
   - Create logging for access attempts

### Phase 7: Print & Export Functionality (1-2 days)

1. ⬜ Implement print-friendly styles:

   - Add media queries for print output
   - Create optimized print layouts
   - Hide non-essential elements when printing

2. ⬜ Add client-side print functionality:

   - Create print button with JavaScript handler
   - Add print preview option if needed
   - Implement basic print settings

3. ⬜ Implement PDF export option (if required):
   - Research client-side PDF generation options
   - Implement selected solution
   - Test PDF output quality and compatibility

### Phase 8: Testing & Refinement (2-3 days)

1. ⬜ Test with mock data:

   - Create test fixtures for proposals and quotes
   - Verify rendering with various data scenarios
   - Test responsive design on different devices

2. ⬜ Test security features:

   - Verify token validation works correctly
   - Test expired tokens and unauthorized access
   - Ensure proper error handling

3. ⬜ Refine based on feedback:
   - Adjust layouts and styling as needed
   - Optimize performance
   - Implement any additional requested features

### Phase 9: Documentation & Deployment (1 day)

1. ⬜ Document frontend implementation:

   - Update README with setup instructions
   - Document template structure
   - Add usage examples for URL generation

2. ⬜ Prepare for deployment:

   - Ensure build process works correctly
   - Configure production environment
   - Test in staging environment

3. ⬜ Deploy to production:
   - Update Render.com configuration
   - Verify functionality in production
   - Monitor for any issues

Total estimated time: 13-21 days
