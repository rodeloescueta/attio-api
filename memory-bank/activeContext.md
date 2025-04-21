# Active Context

## Current Focus

Working on deploying the proposal system to AWS Lightsail and implementing additional features.

## Recent Changes

1. Implemented professional proposal template
2. Added markdown rendering for service agreements
3. Configured security headers and CSP
4. Fixed template rendering issues
5. Added proper error handling
6. Created AWS Lightsail deployment guide

## Active Development

- Planning AWS Lightsail deployment
- Preparing e-signature integration
- Designing PDF generation system
- Setting up production environment in Lightsail

## Technical Context

- Using Express.js with EJS templates
- Attio API integration for lead data
- Tailwind CSS for styling
- Marked.js for markdown rendering
- Helmet for security headers
- AWS Lightsail for hosting

## Next Steps

1. Deploy to AWS Lightsail

   - Set up Node.js environment
   - Configure SSL/TLS with Let's Encrypt
   - Set up environment variables
   - Configure domain and DNS
   - Set up monitoring and alerts

2. Implement e-signature functionality

   - Research and select e-signature library
   - Design signature capture interface
   - Create Attio update mechanism for signed proposals

3. Add PDF generation
   - Add download functionality
   - Implement print-friendly styling
   - Create PDF version of signed proposals

## Current Decisions

1. Using AWS Lightsail for deployment
2. Node.js 22.14.0 for runtime
3. Using Marked.js for markdown rendering
4. Helmet for security headers
5. Planning to use Let's Encrypt for SSL
6. Using systemd for process management
7. Implementing load balancer for SSL termination

## Open Questions

1. Which e-signature library to use?
2. What backup strategy to implement in Lightsail?
3. What PDF generation approach to take?
4. How to handle automatic scaling if needed?
5. What monitoring metrics are most important?

## Dependencies

- Express.js
- EJS
- Tailwind CSS
- Marked.js
- Helmet
- Attio API
- AWS Lightsail infrastructure
- (Pending) E-signature library
- (Pending) PDF generation library

## Active Decisions

1. **Database Strategy**:

   - Decision: Use Attio objects as source of truth, avoid separate database
   - Status: Confirmed
   - Rationale: Simplifies architecture, reduces infrastructure needs, and keeps data synchronized

2. **Deployment Platform**:

   - Decision: Use AWS Lightsail for deployment
   - Status: Confirmed
   - Rationale: Cost-effective, easy to manage, good performance, and includes SSL/TLS support

3. **Integration Approach**:

   - Decision: Webhook-driven architecture with API fallbacks
   - Status: Confirmed
   - Rationale: Real-time updates are critical for subscription status synchronization

4. **Authentication Strategy**:

   - Decision: Environment variable storage of API credentials
   - Status: Confirmed
   - Rationale: Secure, follows best practices, and supported by AWS Lightsail

5. **Package Management**:

   - Decision: Use npm for package management
   - Status: Confirmed
   - Rationale: Standard package manager, well-supported in Lightsail environment

6. **Payment Flow**:

   - Decision: Use Braintree payment links instead of custom checkout UI
   - Status: Confirmed
   - Rationale: Simplifies development, eliminates UI maintenance, leverages Braintree's secure checkout

7. **Infrastructure Management**:

   - Decision: Use AWS Lightsail built-in tools for monitoring and management
   - Status: Confirmed
   - Rationale: Integrated monitoring, automatic backups, and simplified management

8. **SSL/TLS Management**:

   - Decision: Use Lightsail Load Balancer with Let's Encrypt
   - Status: Confirmed
   - Rationale: Automatic certificate management and renewal

9. **Process Management**:

   - Decision: Use systemd for service management
   - Status: Confirmed
   - Rationale: Reliable process management with automatic restarts and logging

10. **Monitoring Strategy**:
    - Decision: Use Lightsail native monitoring with custom alerts
    - Status: Confirmed
    - Rationale: Built-in metrics, easy to set up, covers essential monitoring needs

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
