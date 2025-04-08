```markdown
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

````

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

````

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
