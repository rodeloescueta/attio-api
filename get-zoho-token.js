// Load environment variables from helper.env file
require("dotenv").config({ path: "./helper.env" });

// Run the helper server
require("./zoho-auth-helper");
