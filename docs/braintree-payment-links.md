# Braintree Payment Links Guide

## Overview

Braintree payment links allow you to create a hosted payment page that can be shared with customers to collect payment information securely without building a custom UI. This is ideal for our Attio integration as it simplifies development and eliminates PCI compliance concerns.

## Availability Check

Braintree payment links are part of Braintree's newer features and might not be available in all regions or account types. Here's how to check and what alternatives to consider.

### Checking Availability

1. Log in to your Braintree account (sandbox or production)
2. Navigate to the "Tools" section
3. Look for "Payment Links" or similar feature
4. If present, you can create and manage payment links here

If payment links aren't available, contact Braintree support to ask about availability in your region/account.

## Alternatives if Payment Links Aren't Available

If Braintree payment links aren't available in your region or account type, here are alternative approaches:

### Option 1: Braintree Drop-in UI

Braintree offers a pre-built UI component called Drop-in UI that minimizes development effort:

1. **Functionality**: Collects and tokenizes payment information
2. **Integration**: Simple JavaScript integration
3. **Hosting**: Host a minimal HTML page that includes the Drop-in UI
4. **Implementation**:

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <title>Payment</title>
       <script src="https://js.braintreegateway.com/web/dropin/1.33.0/js/dropin.min.js"></script>
     </head>
     <body>
       <div id="dropin-container"></div>
       <button id="submit-button">Pay</button>

       <script>
         // Get the client token from your server
         fetch("/api/braintree/client-token")
           .then((response) => response.json())
           .then((data) => {
             braintree.dropin.create(
               {
                 authorization: data.clientToken,
                 container: "#dropin-container",
               },
               (createErr, instance) => {
                 document
                   .getElementById("submit-button")
                   .addEventListener("click", () => {
                     instance.requestPaymentMethod((err, payload) => {
                       if (err) {
                         console.error(err);
                         return;
                       }

                       // Submit payload.nonce to your server
                       fetch("/api/braintree/process-payment", {
                         method: "POST",
                         headers: {
                           "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                           paymentMethodNonce: payload.nonce,
                           customerId: "CUSTOMER_ID_FROM_URL_PARAM",
                           subscriptionId: "SUBSCRIPTION_ID_FROM_URL_PARAM",
                         }),
                       })
                         .then((response) => response.json())
                         .then((result) => {
                           // Handle success - redirect to success page
                           window.location.href = "/payment-success";
                         })
                         .catch((error) => {
                           console.error("Error:", error);
                         });
                     });
                   });
               }
             );
           });
       </script>
     </body>
   </html>
   ```

### Option 2: Braintree Hosted Fields

For more customization while maintaining PCI compliance:

1. **Functionality**: Provides iframe-based form fields
2. **Integration**: More complex but offers style customization
3. **Hosting**: Host an HTML page with your form design
4. **Implementation**: See Braintree documentation for details

### Option 3: PayPal Checkout Integration

Since Braintree is owned by PayPal, this might be an easier alternative:

1. **Functionality**: "Pay with PayPal" button that handles the entire payment flow
2. **Integration**: Simple JavaScript SDK
3. **Hosting**: Can be a minimal page or integrated into emails
4. **PCI Compliance**: Handled entirely by PayPal

## Implementation Strategy

Based on available options, we'll use this decision flow:

1. **First choice**: Use Braintree payment links if available (simplest)
2. **Second choice**: Use Braintree Drop-in UI (minimal development)
3. **Third choice**: Use PayPal Checkout integration (wide availability)
4. **Last resort**: Use Braintree Hosted Fields (most complex)

## Testing Payment Links in Sandbox

If payment links are available in your sandbox account:

1. Go to the Braintree Sandbox Control Panel
2. Navigate to Tools > Payment Links
3. Create a test payment link
4. Configure settings (amount, description, etc.)
5. Test the link by making a payment with test card data (e.g., card number 4111 1111 1111 1111)
6. Verify the transaction appears in your sandbox account
7. Note the webhook events that are triggered

## Implementation in Our API

Once we've determined the approach, we'll implement it in our API as follows:

1. **For payment links**: Generate unique links via Braintree API and store them in Attio
2. **For Drop-in UI**: Host a secure page with the Drop-in UI that communicates with our API
3. **For hosted fields**: Create a custom payment page that uses Braintree's hosted fields

The core workflow remains the same in all cases - only the payment collection method changes.

## Next Steps

1. Verify Braintree payment links availability in your account
2. Decide on the implementation approach based on availability
3. Set up the appropriate sandbox testing environment
4. Implement the selected approach in our API

We'll adapt our implementation based on your findings regarding Braintree payment links availability.
