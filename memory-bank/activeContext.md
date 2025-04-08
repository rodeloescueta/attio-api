# Active Context

## Current Focus

We are in the initial project setup phase of the Attio Integration API, focusing on defining the project architecture and establishing the core integration patterns for connecting Attio CRM, Zoho, and Braintree. Based on new input, we are refining the workflow to eliminate manual processes in the subscription and payment flow using Braintree payment links instead of a custom checkout UI.

## Recent Changes

- Created project plan (PLAN.md)
- Established Memory Bank documentation structure
- Defined core project requirements and integration patterns
- Researched API capabilities for all three platforms
- Updated project documentation to use pnpm instead of npm
- Cleaned up .cursor/rules file to remove irrelevant content
- Refined the workflow based on feedback about Zoho Flow limitations
- Shifted from custom checkout UI to Braintree payment links approach

## Active Decisions

1. **Database Strategy**:

   - Decision: Use Attio objects as source of truth, avoid separate database
   - Status: Confirmed
   - Rationale: Simplifies architecture, reduces infrastructure needs, and keeps data synchronized

2. **Deployment Platform**:

   - Decision: Use Render.com for serverless deployment
   - Status: Confirmed
   - Rationale: Easy setup, GitHub integration, environment variable management, and webhook compatibility

3. **Integration Approach**:

   - Decision: Webhook-driven architecture with API fallbacks
   - Status: Confirmed
   - Rationale: Real-time updates are critical for subscription status synchronization

4. **Authentication Strategy**:

   - Decision: Environment variable storage of API credentials
   - Status: Confirmed
   - Rationale: Secure, follows best practices, and supported by Render.com

5. **Package Management**:

   - Decision: Use pnpm instead of npm
   - Status: Confirmed
   - Rationale: Faster installation, better dependency management, and disk space efficiency

6. **Payment Flow**:

   - Decision: Use Braintree payment links instead of custom checkout UI
   - Status: Confirmed
   - Rationale: Simplifies development, eliminates UI maintenance, leverages Braintree's secure checkout

7. **Automated Workflow**:
   - Decision: Replace manual processes with API-driven workflow
   - Status: Confirmed
   - Rationale: Remove human intervention in the subscription/payment flow

## Current Challenges

1. **Attio Data Model**: Implementing specific columns (Zoho Subscriptions Customer ID, Braintree Customer ID) in Attio Clients object
2. **Webhook Security**: Implementing proper signature verification for all incoming webhooks
3. **Zoho API Authentication**: Setting up OAuth flow with refresh token management
4. **Testing Strategy**: Creating a test environment that simulates the three-platform interaction
5. **Braintree Integration**: Learning and implementing Braintree payment links functionality

## Refined Workflow

Based on new information about Zoho Flow limitations and UI preferences, our workflow will now:

1. **Customer Subscription Initiation**:

   - Customer selects subscription in Attio
   - Attio automation triggers our API
   - API generates Braintree payment link
   - API provides link back to Attio
   - Attio sends email with payment link to customer
   - Customer completes payment on Braintree-hosted page
   - Braintree webhook notifies our API
   - API creates Zoho subscription and updates Attio

2. **Invoice & Payment Handling**:
   - When Zoho generates an invoice, it sends a webhook to our API
   - API finds the client in Attio using the Zoho Subscription Customer ID
   - API retrieves the Braintree Customer ID from Attio
   - API creates a sale in Braintree using stored payment information
   - API notifies Zoho Subscriptions of the payment

This fully automated flow eliminates the manual steps in the original plan while avoiding the need to build a custom UI.

## Next Steps

### Immediate (Next 1-2 Days)

1. Set up basic Express API project structure with pnpm
2. Create service files for each integration (zohoService.js, attioService.js, braintreeService.js)
3. Implement basic webhook endpoints for each platform
4. Configure environment variables in development environment
5. Define the data model requirements for Attio Clients object

### Short-term (This Week)

1. Implement Attio API client for object creation/updates
2. Set up Zoho OAuth authentication flow
3. Configure Braintree sandbox environment
4. Research and implement Braintree payment links generation
5. Implement customer creation flows (Attio → Braintree → Zoho)

### Medium-term (Next 2 Weeks)

1. Implement complete webhook handling for all platforms
2. Build subscription trigger flow from Attio to Braintree and Zoho
3. Implement automated payment processing via webhooks
4. Create comprehensive testing scenarios
5. Deploy test version to Render.com

## Current Questions

- What specific fields are needed in the Attio Clients object beyond the identified Customer IDs?
- What is the expected volume of subscriptions/transactions?
- Are there any existing Zoho webhooks already configured?
- What level of reporting is required for subscription status?
- Does Braintree provide payment links functionality in our region/account?

## Resource Links

- [Attio API Documentation](https://developers.attio.com/)
- [Zoho Subscriptions API](https://www.zoho.com/subscriptions/api/v1/)
- [Braintree Node SDK](https://github.com/braintree/braintree_node)
- [Braintree Payment Links](https://developer.paypal.com/braintree/docs/guides/payment-links/overview)
- [Render.com Documentation](https://render.com/docs)
- [pnpm Documentation](https://pnpm.io/)
