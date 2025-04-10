# Active Context

## Current Focus

We are in the initial implementation phase of the Attio Integration API, focusing on building out the core infrastructure components. We've established the basic Express API structure and are implementing the service layers using a functional programming approach. We've recently implemented authentication middleware using API key validation and a permission-based access control system. The focus is on creating a robust and secure foundation for the three-way integration between Attio CRM, Zoho, and Braintree.

## Recent Changes

- Created project plan (PLAN.md)
- Established Memory Bank documentation structure
- Defined core project requirements and integration patterns
- Researched API capabilities for all three platforms
- Updated project documentation to use pnpm instead of npm
- Cleaned up .cursor/rules file to remove irrelevant content
- Refined the workflow based on feedback about Zoho Flow limitations
- Shifted from custom checkout UI to Braintree payment links approach
- Set up basic Express.js server with routes and logging
- Implemented functional approach for Attio service layer
- Created configuration management system
- Added webhook validation middleware skeleton
- Removed unnecessary helper.env file
- Implemented authentication middleware with API key validation
- Added permission-based access control for routes
- Created utility scripts for token generation and testing
- Updated environment configuration with API access token

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

8. **Code Structure**:

   - Decision: Use functional programming approach instead of classes
   - Status: Confirmed
   - Rationale: Better composability, easier testing, and follows modern JavaScript patterns

9. **API Authentication**:

   - Decision: Use API key authentication with Bearer token
   - Status: Confirmed
   - Rationale: Simple to implement, secure, and allows for future extension to more sophisticated auth methods

10. **Permission Model**:
    - Decision: Implement a permission-based middleware framework
    - Status: Confirmed
    - Rationale: Provides granular control over route access and can be extended to support different user roles in the future

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

1. ~~Set up basic Express API project structure with pnpm~~ ✅
2. ~~Create service files for each integration (attioService.js)~~ ✅
3. ~~Set up authentication middleware for protected routes~~ ✅
4. Create service files for each integration (zohoService.js, braintreeService.js)
5. Implement Attio webhook signature verification
6. Configure environment variables for development and testing

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
