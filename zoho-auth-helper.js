// Simple Express server to handle Zoho OAuth callback
const express = require("express");
const axios = require("axios");

// Create Express app
const app = express();
const PORT = 3000;

// Zoho OAuth credentials
const CLIENT_ID = process.env.ZOHO_CLIENT_ID || "YOUR_CLIENT_ID";
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "http://localhost:3000/auth/zoho/callback";

// Callback route
app.get("/auth/zoho/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("No authorization code received from Zoho");
    }

    console.log("🎉 Authorization code received:", code);
    console.log("\n📋 Copy this code for the next step!");

    // Instructions for manual token exchange
    res.send(`
      <h1>Zoho Authorization Code Received!</h1>
      <p>Code: <strong>${code}</strong></p>
      <h2>Next Steps:</h2>
      <p>Run this cURL command in your terminal to get your refresh token:</p>
      <pre>
curl -X POST https://accounts.zoho.com/oauth/v2/token \\
-d "code=${code}" \\
-d "client_id=${CLIENT_ID}" \\
-d "client_secret=${CLIENT_SECRET}" \\
-d "redirect_uri=${REDIRECT_URI}" \\
-d "grant_type=authorization_code"
      </pre>
      <p>Or use this URL for Postman or similar tool:</p>
      <pre>
POST https://accounts.zoho.com/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

code=${code}
client_id=${CLIENT_ID}
client_secret=${CLIENT_SECRET}
redirect_uri=${REDIRECT_URI}
grant_type=authorization_code
      </pre>
    `);
  } catch (error) {
    console.error("Error handling callback:", error);
    res.status(500).send("Error processing the authorization code");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Zoho OAuth helper server running at http://localhost:${PORT}

📝 Instructions:
1. Visit this URL in your browser to start the OAuth flow:
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoSubscriptions.fullaccess.all&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}

2. Log in to your Zoho account if prompted
3. Authorize the application
4. You'll be redirected back to this server with the authorization code
5. Follow the instructions shown to exchange the code for a refresh token
  `);
});
