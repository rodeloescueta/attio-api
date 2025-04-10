# Basic Project Setup Guide

This guide covers the initial setup of the Attio Integration API project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 14.x or higher
- **pnpm** - Our preferred package manager (`npm install -g pnpm`)
- **Git** - For version control

## Initial Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/rodeloescueta/attio-api.git
cd attio-api
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your API credentials:
   - Follow the [Environment Setup Guide](environment-setup-guide.md) for detailed instructions on obtaining credentials

### Step 4: Start the Development Server

```bash
pnpm dev
```

This will start the server in development mode with hot reloading.

## Project Structure

The project follows this structure:

```
attio-api/
├── docs/                   # Documentation
├── memory-bank/            # Project context and documentation
├── src/
│   ├── index.js            # Application entry point
│   ├── config/             # Configuration files
│   ├── routes/             # API routes
│   │   ├── zoho.js         # Zoho webhook endpoints
│   │   ├── attio.js        # Attio webhook endpoints
│   │   └── braintree.js    # Braintree webhook endpoints
│   ├── services/           # Business logic
│   │   ├── zohoService.js  # Zoho API interactions
│   │   ├── attioService.js # Attio API interactions
│   │   └── braintreeService.js # Braintree API interactions
│   └── utils/              # Utility functions
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── README.md               # Project overview
```

## Creating Initial Files

Let's create the basic file structure:

1. Create the main application file:

```javascript
// src/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

// Import routes
const zohoRoutes = require("./routes/zoho");
const attioRoutes = require("./routes/attio");
const braintreeRoutes = require("./routes/braintree");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/webhooks/zoho", zohoRoutes);
app.use("/webhooks/attio", attioRoutes);
app.use("/webhooks/braintree", braintreeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. Create the basic route files:

```javascript
// src/routes/zoho.js
const express = require("express");
const router = express.Router();

// Webhook endpoint for Zoho Subscriptions
router.post("/", async (req, res) => {
  try {
    console.log("Received webhook from Zoho:", req.body);
    // TODO: Add webhook handling logic
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error handling Zoho webhook:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
```

```javascript
// src/routes/attio.js
const express = require("express");
const router = express.Router();

// Webhook endpoint for Attio
router.post("/", async (req, res) => {
  try {
    console.log("Received webhook from Attio:", req.body);
    // TODO: Add webhook handling logic
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error handling Attio webhook:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
```

```javascript
// src/routes/braintree.js
const express = require("express");
const router = express.Router();

// Webhook endpoint for Braintree
router.post("/", async (req, res) => {
  try {
    console.log("Received webhook from Braintree:", req.body);
    // TODO: Add webhook handling logic
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error handling Braintree webhook:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
```

3. Create basic service files:

```javascript
// src/services/zohoService.js
// Zoho Subscriptions API interactions

class ZohoService {
  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    this.organizationId = process.env.ZOHO_ORGANIZATION_ID;
    this.accessToken = null;
    this.tokenExpiryTime = 0;
  }

  // Method to get a valid access token
  async getAccessToken() {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpiryTime) {
      return this.accessToken;
    }

    // TODO: Implement token refresh logic
    return null;
  }

  // Method to create a customer in Zoho Subscriptions
  async createCustomer(customerData) {
    // TODO: Implement customer creation logic
    return null;
  }

  // Method to create a subscription in Zoho Subscriptions
  async createSubscription(subscriptionData) {
    // TODO: Implement subscription creation logic
    return null;
  }

  // Method to record a payment in Zoho Subscriptions
  async recordPayment(paymentData) {
    // TODO: Implement payment recording logic
    return null;
  }
}

module.exports = new ZohoService();
```

```javascript
// src/services/attioService.js
// Attio API interactions

class AttioService {
  constructor() {
    this.apiKey = process.env.ATTIO_API_KEY;
  }

  // Method to get client information
  async getClient(clientId) {
    // TODO: Implement client retrieval logic
    return null;
  }

  // Method to update client with external IDs
  async updateClientIds(clientId, zohoCustomerId, braintreeCustomerId) {
    // TODO: Implement client update logic
    return null;
  }

  // Method to update subscription status
  async updateSubscriptionStatus(clientId, subscriptionStatus) {
    // TODO: Implement subscription status update logic
    return null;
  }
}

module.exports = new AttioService();
```

```javascript
// src/services/braintreeService.js
// Braintree API interactions

class BraintreeService {
  constructor() {
    this.environment = process.env.BT_ENVIRONMENT;
    this.merchantId = process.env.BT_MERCHANT_ID;
    this.publicKey = process.env.BT_PUBLIC_KEY;
    this.privateKey = process.env.BT_PRIVATE_KEY;
    this.gateway = null;
  }

  // Initialize Braintree gateway
  init() {
    // TODO: Implement Braintree gateway initialization
    return null;
  }

  // Generate payment link
  async generatePaymentLink(amount, description) {
    // TODO: Implement payment link generation if available
    return null;
  }

  // Create a customer in Braintree
  async createCustomer(customerData) {
    // TODO: Implement customer creation logic
    return null;
  }

  // Process a payment
  async processPayment(customerId, amount, descriptor) {
    // TODO: Implement payment processing logic
    return null;
  }
}

module.exports = new BraintreeService();
```

## Next Steps

1. Create a `package.json` file:

```bash
pnpm init
```

2. Install required dependencies:

```bash
pnpm add express dotenv body-parser axios winston
pnpm add -D nodemon
```

3. Update `package.json` to include development scripts:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

4. Begin implementing the service-specific logic based on API documentation

## Testing Your Setup

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Test the health endpoint:

   ```bash
   curl http://localhost:3000/health
   ```

   You should receive a response like:

   ```json
   { "status": "OK", "message": "Server is running" }
   ```

3. For webhook testing, use ngrok to create a public URL:
   ```bash
   ngrok http 3000
   ```

This completes the basic setup for the Attio Integration API project. Next, you'll need to implement the specific integration logic for each service.
