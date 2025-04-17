# Active Context

## Current Focus

Working on the proposal system that integrates with Attio's lead data to create interactive, signable proposals.

## Recent Changes

1. Implemented basic proposal viewing system
2. Set up EJS templating
3. Configured static file serving
4. Added debug view for Attio lead data

## Active Development

- Converting the raw Attio lead data into a professional proposal layout
- Planning e-signature integration
- Designing the proposal template system

## Technical Context

- Using Express.js with EJS templates
- Attio API integration for lead data
- Tailwind CSS for styling
- Currently displaying raw JSON for debugging

## Next Steps

1. Create professional proposal template layout

   - Convert existing EJS debug view to full proposal template
   - Implement navigation sidebar
   - Add section-based content display

2. Implement e-signature functionality

   - Research and select e-signature library
   - Design signature capture interface
   - Create Attio update mechanism for signed proposals

3. Add PDF generation
   - Add download functionality
   - Implement print-friendly styling
   - Create PDF version of signed proposals

## Current Decisions

1. Using Attio's "leads" object type as data source
2. EJS for template rendering
3. Tailwind CSS for styling
4. Planning to implement client-side navigation

## Open Questions

1. Which e-signature library to use?
2. How to structure the Attio data updates for signed proposals?
3. What PDF generation approach to take?
4. Security measures for proposal access?

## Dependencies

- Express.js
- EJS
- Tailwind CSS
- Attio API
- (Pending) E-signature library
- (Pending) PDF generation library

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
