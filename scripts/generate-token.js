#!/usr/bin/env node

/**
 * Script to generate a secure random API token
 * Run with: node scripts/generate-token.js
 */

const crypto = require("crypto");

// Generate a secure random token of 32 bytes and convert to hexadecimal
const token = crypto.randomBytes(32).toString("hex");

console.log("\n=== API Access Token Generator ===\n");
console.log("Generated token:");
console.log(token);
console.log("\nAdd this to your .env file as:");
console.log(`API_ACCESS_TOKEN=${token}\n`);
console.log("Keep this token secure and do not share it.\n");
