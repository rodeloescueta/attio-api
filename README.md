# Attio Integration API

A custom API bridge connecting Attio CRM with Zoho subscription management and Braintree payment processing.

## Overview

This API acts as an integration layer between:

- **Attio** - CRM and customer data store
- **Zoho** - Service offerings and subscription logic
- **Braintree** - Payment gateway and subscription billing

The integration enables:

- Syncing service offerings from Zoho to Attio
- Triggering new subscriptions from Attio
- Processing payments through Braintree
- Maintaining subscription status across all platforms

## System Architecture

![Architecture Diagram](https://via.placeholder.com/800x400?text=Attio+Integration+API+Architecture)

The system uses a webhook-driven architecture to maintain real-time synchronization between platforms:

- **Zoho → Attio**: Service offerings sync to Attio collections
- **Attio → Braintree**: Subscription triggers create payments
- **Braintree → Attio**: Payment status updates Attio records

## Key Features

- **Zoho Sync**: Automatic synchronization of service offerings
- **Subscription Management**: Complete subscription lifecycle handling
- **Payment Processing**: Secure payment handling via Braintree
- **No-Database Design**: Uses Attio objects as the source of truth
- **Webhook Security**: Signature verification for all incoming webhooks

## Development Setup

### Prerequisites

- Node.js (v14+)
- pnpm (`npm install -g pnpm`)
- ngrok (for local webhook testing)
- Access to Attio, Zoho, and Braintree accounts

### Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/attio-integration-api.git
   cd attio-integration-api
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Create a `.env` file in the root directory with your API credentials:

   ```
   # Zoho
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ZOHO_REFRESH_TOKEN=your_refresh_token
   ZOHO_ORGANIZATION_ID=your_org_id

   # Attio
   ATTIO_API_KEY=your_api_key

   # Braintree (sandbox for development)
   BT_ENVIRONMENT=sandbox
   BT_MERCHANT_ID=your_merchant_id
   BT_PUBLIC_KEY=your_public_key
   BT_PRIVATE_KEY=your_private_key

   # Webhook Secret Keys (optional but recommended)
   BT_WEBHOOK_SECRET=your_braintree_webhook_secret
   ZOHO_WEBHOOK_SECRET=your_zoho_webhook_secret
   ATTIO_WEBHOOK_SECRET=your_attio_webhook_secret
   ```

4. Start the development server:

   ```
   pnpm dev
   ```

5. (Optional) Use ngrok to create a tunnel for webhook testing:
   ```
   ngrok http 3000
   ```

### API Endpoints

| Endpoint              | Method | Description                                         |
| --------------------- | ------ | --------------------------------------------------- |
| `/webhooks/zoho`      | POST   | Receives service/plan changes from Zoho             |
| `/webhooks/attio`     | POST   | Receives subscription triggers from Attio           |
| `/webhooks/braintree` | POST   | Receives payment status updates from Braintree      |
| `/api/services`       | GET    | Lists available services (from Zoho)                |
| `/api/sync`           | POST   | Manually triggers a service sync from Zoho to Attio |

## Deployment

This API is designed to be deployed on [Render.com](https://render.com/):

1. Push the code to a GitHub repository
2. Create a new Web Service on Render
3. Connect to your GitHub repository
4. Set the build command: `pnpm install`
5. Set the start command: `node index.js`
6. Add all environment variables
7. Deploy the service

## Testing

Run tests with:

```
pnpm test
```

The test suite includes:

- Unit tests for service functions
- Integration tests for API endpoints
- Mock webhook event testing

## Documentation

For detailed documentation, see the [`/memory-bank`](./memory-bank) directory:

- [`projectbrief.md`](./memory-bank/projectbrief.md) - Core requirements and goals
- [`systemPatterns.md`](./memory-bank/systemPatterns.md) - System architecture
- [`techContext.md`](./memory-bank/techContext.md) - Technical details

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
