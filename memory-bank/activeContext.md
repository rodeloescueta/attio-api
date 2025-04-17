# Active Context

## Current Focus

We have successfully implemented the core Attio-Zoho integration for service synchronization, and completed a full sync of all production plans from Zoho to Attio. The system can now retrieve service plans from Zoho Subscriptions, create a corresponding collection in Attio, and populate it with service data. We're now focusing on automating this synchronization process, improving error handling, and preparing for the next phase of the subscription workflow implementation.

We are also adding a frontend component using EJS templates to create client-facing views for proposals and quotes. This will allow clients to view service proposals with pricing information pulled from Attio. The frontend will also include a markdown-to-HTML conversion utility for rendering service agreements and other formatted content.

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
- Adjusted project priorities to focus on Attio-Zoho service synchronization first
- Implemented Zoho service with OAuth refresh token management
- Enhanced Attio service with collection operations support
- Created sync service for Zoho-Attio integration
- Implemented endpoints for triggering and monitoring synchronization
- Added testing utilities for the synchronization process
- Fixed data type issues in the billing_frequency field for Attio integration
- Successfully completed a full synchronization of all Zoho production plans to Attio
- Created comprehensive documentation for the Zoho-Attio synchronization process
- Updated project plan to include client-facing frontend using EJS templates

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

11. **Integration Priority**:

    - Decision: Implement Attio-Zoho service synchronization first
    - Status: Completed
    - Rationale: Validates connectivity with both systems early and establishes foundation for subscription flow

12. **Zoho Authentication**:

    - Decision: Use OAuth with refresh token management
    - Status: Confirmed
    - Rationale: Follows Zoho's recommended approach and handles token expiration automatically

13. **Data Synchronization Format**:

    - Decision: Convert Zoho numeric values to strings for Attio compatibility when needed
    - Status: Implemented
    - Rationale: Ensures data type consistency between the two systems

14. **Frontend Technology**:
    - Decision: Use EJS templates with Express.js for client-facing views
    - Status: Confirmed
    - Rationale: Simplifies integration with existing Express app, lightweight, and sufficient for our needs

## Current Challenges

1. **Automated Synchronization**: Setting up a reliable scheduled task for regular synchronization
2. **Error Handling & Resilience**: Improving the error handling in the synchronization process and adding retry logic
3. **Detecting Changes**: Implementing a mechanism to detect and sync only changed plans
4. **Webhook Security**: Implementing proper signature verification for all incoming webhooks
5. **Subscription Creation Flow**: Planning the implementation of the subscription creation process
6. **Client-Facing Views**: Creating secure, unique URLs for clients to view proposals and quotes
7. **Markdown Processing**: Converting markdown content from Attio to properly formatted HTML

## Implementation Progress

We have successfully implemented the Service Synchronization flow:

1. **Zoho → Attio (Service Sync)**:
   - ✅ Authentication with Zoho API using OAuth with refresh token management
   - ✅ Fetching available service plans from Zoho Subscriptions
   - ✅ Mapping Zoho plan data to Attio collection schema
   - ✅ Creating or updating collections in Attio to represent services
   - ✅ Storing Zoho plan IDs in Attio for future reference
   - ✅ Successfully synced all 85 production plans from Zoho to Attio

Next is the implementation of the subscription flow:

2. **Customer Subscription Initiation**:

   - Customer selects subscription in Attio
   - Attio automation triggers our API
   - API generates Braintree payment link
   - API provides link back to Attio
   - Attio sends email with payment link to customer
   - Customer completes payment on Braintree-hosted page
   - Braintree webhook notifies our API
   - API creates Zoho subscription and updates Attio

3. **Invoice & Payment Handling**:

   - When Zoho generates an invoice, it sends a webhook to our API
   - API finds the client in Attio using the Zoho Subscription Customer ID
   - API retrieves the Braintree Customer ID from Attio
   - API creates a sale in Braintree using stored payment information
   - API notifies Zoho Subscriptions of the payment

4. **Client-Facing Frontend**:
   - Generate unique URLs for client proposals and quotes
   - Display service information from Attio
   - Show pricing details in a clean, professional format
   - Present service agreements with proper formatting
   - Provide a way for clients to accept proposals (potentially)

## Next Steps

### Immediate (Next 1-2 Days)

1. ~~Set up basic Express API project structure with pnpm~~ ✅
2. ~~Create service files for each integration (attioService.js)~~ ✅
3. ~~Set up authentication middleware for protected routes~~ ✅
4. ~~Create zohoService.js for fetching service plans~~ ✅
5. ~~Enhance attioService.js to support collection operations~~ ✅
6. ~~Implement service synchronization logic~~ ✅
7. ~~Create sync API endpoint to trigger synchronization~~ ✅
8. ~~Test the synchronization with real credentials~~ ✅
9. ~~Fix data type compatibility issues between Zoho and Attio~~ ✅
10. ~~Complete full synchronization of all Zoho plans to Attio~~ ✅
11. Implement detailed error handling and logging
12. Set up automatic periodic synchronization using a cron job
13. Install and configure EJS template engine
14. Create basic layout templates for proposals and quotes
15. Implement markdown-to-HTML conversion utility

### Short-term (This Week)

1. Create a cron job or scheduled task for automatic synchronization
2. Start implementing the Braintree service for payment links
3. Begin development of the subscription creation flow
4. Create client object schema in Attio with necessary IDs
5. Create routes for proposal and quote views
6. Implement secure URL generation for client access
7. Design and implement proposal view template
8. Fetch and display service data from Attio in templates

### Medium-term (Next 2 Weeks)

1. Implement complete webhook handling for all platforms
2. Build subscription trigger flow from Attio to Braintree and Zoho
3. Implement automated payment processing via webhooks
4. Create comprehensive testing scenarios
5. Deploy test version to Render.com
6. Add quote view template with dynamic pricing
7. Implement service agreement display with markdown parsing
8. Create URL tracking and expiration system
9. Add proposal acceptance functionality (if required)
10. Implement print and PDF export options

## Current Questions

- How frequently should services be synchronized from Zoho to Attio?
- What specific fields are needed in the Attio Clients object beyond the identified Customer IDs?
- What is the expected volume of subscriptions/transactions?
- Are there any existing Zoho webhooks already configured?
- What specific information needs to be displayed in the proposal view?
- Will clients need to take any actions directly on the proposal page?
- What is the desired URL format for client-facing views?
- How should service agreements be formatted in the frontend?

## Resource Links

- [Attio API Documentation](https://developers.attio.com/)
- [Zoho Subscriptions API](https://www.zoho.com/subscriptions/api/v1/)
- [Braintree Node SDK](https://github.com/braintree/braintree_node)
- [Braintree Payment Links](https://developer.paypal.com/braintree/docs/guides/payment-links/overview)
- [Render.com Documentation](https://render.com/docs)
- [pnpm Documentation](https://pnpm.io/)
- [EJS Documentation](https://ejs.co/)
- [Marked.js for Markdown Parsing](https://marked.js.org/)
