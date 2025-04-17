# Product Context

## Overview

The Attio Integration API serves as a critical bridge between our CRM system (Attio) and our billing/subscription systems (Zoho Subscriptions and Braintree). It replaces manual processes previously handled via the Betterseller app with a fully automated workflow that enables:

1. Service catalog synchronization from Zoho to Attio
2. Customer creation and management across all three platforms
3. Automated subscription management and payment processing
4. Real-time updates and notifications through webhooks

## Key Value Proposition

This integration delivers significant value by:

- **Eliminating Manual Processes**: Replacing manual data entry and updates with automated workflows
- **Reducing Errors**: Minimizing human error in subscription and payment management
- **Improving Customer Experience**: Providing seamless payment options and faster service activation
- **Centralizing Data**: Making Attio the single source of truth for customer relationship data
- **Enabling Scalability**: Supporting growth by automating repetitive tasks

## User Personas

### Sales Team

- **Needs**: Easy creation of subscription offerings, quick access to customer subscription status
- **Pain Points**: Manual tracking of subscription details, delays in payment processing
- **Value**: Can manage the entire subscription lifecycle directly from Attio

### Finance Team

- **Needs**: Accurate subscription tracking, timely payment processing, proper invoicing
- **Pain Points**: Manual reconciliation, delayed payments, payment tracking across systems
- **Value**: Automated payment processing and real-time status updates

### Customers

- **Needs**: Easy subscription sign-up, transparent billing, secure payment options
- **Pain Points**: Confusing checkout experiences, payment issues, lack of clarity on services
- **Value**: Simple payment process via Braintree links, clear service documentation

## User Workflows

### Sales Process

1. Sales team creates customer record in Attio
2. Team selects appropriate service plan from synchronized catalog
3. System generates Braintree payment link via API
4. Attio sends email with payment link to customer
5. Customer completes payment on Braintree-hosted page
6. API automatically creates subscription in Zoho
7. Customer receives confirmation and service activation

### Billing Process

1. Zoho generates invoice based on subscription schedule
2. Zoho sends webhook to our API
3. API identifies customer and retrieves payment information
4. API processes payment via Braintree
5. API confirms payment completion to Zoho
6. Customer receives receipt for payment

## Success Metrics

- **Subscription Creation Time**: Reduced from hours to minutes
- **Payment Processing Time**: Reduced from days to near real-time
- **Manual Steps Required**: Reduced by 90% across all workflows
- **Data Accuracy**: Improved consistency between systems
- **Customer Satisfaction**: Improved through faster onboarding and billing clarity

## Client-Facing Views

### Purpose

The client-facing views provide customers with professional, branded access to their proposals, quotes, and service agreements. These views serve several important purposes:

1. **Professional Presentation**: Present our service offerings in a clean, branded, and professional format
2. **Transparency**: Clearly communicate pricing, services, and terms to clients
3. **Accessibility**: Allow clients to view their proposals and quotes from any device
4. **Documentation**: Provide detailed service agreements in a readable format
5. **Action**: Enable clients to accept proposals or proceed to payment

### Proposal View Requirements

The proposal view displays comprehensive service offerings to clients:

1. **Content Requirements**:

   - Client name and proposal reference
   - Introduction/overview section
   - Detailed service descriptions pulled from Attio
   - Pricing information for each service
   - Service agreement in formatted HTML (converted from markdown)
   - Company contact information
   - Validity period for the proposal

2. **Functional Requirements**:

   - Secure, token-based access
   - Responsive design for all devices
   - Print-friendly formatting
   - PDF export capability
   - Clear call-to-action for acceptance
   - Ability to proceed to payment

3. **Design Requirements**:
   - Professional, clean layout
   - Consistent branding
   - Easy readability of terms
   - Visual distinction between sections
   - Appropriate spacing and typography

### Quote View Requirements

The quote view focuses on specific pricing for selected services:

1. **Content Requirements**:

   - Client details
   - Quote reference and date
   - Selected services with descriptions
   - Itemized pricing breakdown
   - Total cost calculation
   - Payment terms and conditions
   - Validity period

2. **Functional Requirements**:
   - Secure access via unique URLs
   - Ability to accept quote
   - Direct link to payment
   - Print and PDF options
   - Mobile-friendly layout

### Service Agreement Display

A critical component is the proper display of service agreements:

1. **Content Source**:

   - Service agreements are stored in Attio as markdown text
   - The markdown includes formatting, lists, headers, and possibly tables
   - Agreements may contain legal terms that must be displayed correctly

2. **Display Requirements**:

   - Proper conversion from markdown to HTML
   - Preservation of document structure (headers, sections)
   - Formatting of lists, tables, and emphasis
   - Clear typography for readability
   - Protection against XSS attacks when rendering
   - Print-friendly formatting
   - Section highlighting for key terms

3. **Technical Implementation**:
   - Server-side markdown processing
   - HTML sanitization for security
   - CSS styling for consistent appearance
   - Responsive design for all device sizes

### URL Security Model

To protect client information, we implement a secure URL scheme:

1. **URL Format**: `/proposals/{id}?token={secure_token}`
2. **Token Generation**: Cryptographically secure random tokens
3. **Token Storage**: Tokens stored in Attio with expiration dates
4. **Validation**: Server-side validation before displaying content
5. **Expiration**: URLs valid for a configurable time period (default: 30 days)
6. **Access Logging**: Track when proposals/quotes are viewed

## Business Background

The company is transitioning from a Betterseller app to Attio CRM as the primary customer relationship management platform. This migration necessitates a new integration solution to connect Attio with the existing Zoho subscription system and Braintree payment processing.

## Problems Solved

### 1. Platform Fragmentation

- **Before**: Separate systems for CRM, subscription management, and payments with manual reconciliation.
- **After**: Integrated ecosystem with automated data flow and synchronization.

### 2. Data Silos

- **Before**: Customer data spread across multiple platforms with no single source of truth.
- **After**: Attio serves as the central data store, with synchronized data from Zoho and Braintree.

### 3. Subscription Management

- **Before**: Service offerings managed in Zoho but disconnected from the CRM experience.
- **After**: Service offerings visible within Attio, with subscription triggers directly from the CRM.

### 4. Payment Processing

- **Before**: Manual payment status updates between systems.
- **After**: Automated payment event handling with real-time status updates across platforms.

## User Experience Goals

### For CRM Team (Attio Users)

- View all available service offerings within Attio
- Trigger new subscriptions directly from Attio interface
- See real-time subscription and payment status for customers
- Manage the entire customer lifecycle within one platform

### For Finance Team (Zoho Users)

- Maintain service definitions and pricing in familiar Zoho environment
- Receive automatic updates when new subscriptions are created
- Maintain billing oversight while reducing manual processes

### For Customers

- Seamless subscription experience
- Transparent billing process
- Uninterrupted service during platform migration

## Key Workflows

1. **Service Catalog Sync**

   - Zoho service offerings automatically sync to Attio
   - Changes in Zoho immediately reflected in Attio

2. **Subscription Activation**

   - User selects service in Attio
   - API creates subscription in Braintree
   - Payment details processed through Braintree
   - Subscription status updated in Attio

3. **Billing Events**
   - Braintree processes payments/refunds
   - Webhooks update subscription status in Attio
   - Billing history maintained with all transaction details

This integration represents a critical component in the company's platform modernization strategy, enabling a more streamlined and efficient customer management process.
