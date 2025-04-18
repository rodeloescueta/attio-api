# Project Brief: Attio Integration API

## Core Purpose

A custom API integration that connects Attio CRM with Zoho for service/subscription management and Braintree for payment processing. This replaces the previous Betterseller app and serves as a bridge between these platforms, with a focus on automating previously manual processes.

## Primary Goals

1. Create a seamless integration between Attio, Zoho, and Braintree
2. Eliminate the need for a separate database by using Attio objects as source of truth
3. Enable fully automated subscription management through Attio
4. Handle complete subscription/billing lifecycle with proper synchronization and no manual steps
5. Provide webhook endpoints for real-time updates between systems
6. Leverage Braintree payment links for secure payment processing without custom UI development

## Success Criteria

- Successful automation of customer creation in Zoho from Attio
- Automatic syncing of customer IDs between platforms (Zoho Subscriptions ID and Braintree Customer ID stored in Attio)
- Users can trigger subscription processes from Attio interface with no manual intervention
- Proper handling of billing and subscription lifecycle events
- Real-time payment processing via Braintree when Zoho generates invoices
- Seamless migration from Betterseller app with no data loss

## Key Workflows

### 1. Customer Subscription Initiation

- Customer selects subscription in Attio
- Attio automation triggers our API
- API generates Braintree payment link
- API provides link back to Attio
- Attio sends email with payment link to customer
- Customer completes payment on Braintree-hosted page
- Braintree webhook notifies our API
- API creates Zoho subscription and updates Attio

### 2. Invoice & Payment Handling

- When Zoho generates an invoice, it sends a webhook to our API
- API finds the client in Attio using the Zoho Subscription Customer ID
- API retrieves the Braintree Customer ID from Attio
- API creates a sale in Braintree using stored payment information
- API notifies Zoho Subscriptions of the payment completion

## Key Stakeholders

- CRM Team (Attio users)
- Finance/Billing Team (Zoho users)
- End customers (subscription holders)

## Timeline and Priorities

1. Set up API infrastructure and deployment on Render.com
2. Implement Braintree payment links integration
3. Implement Attio integration for data storage and triggers
4. Implement automated customer/subscription creation in Zoho
5. Implement Braintree payment processing for invoices
6. Establish webhook communication between services
7. Testing with sandbox environments
8. Production deployment and monitoring

This integration will serve as the backbone for subscription management as we transition from Betterseller to the Attio ecosystem, eliminating manual processes in the subscription and payment workflow.
