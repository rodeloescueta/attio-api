const express = require("express");
const router = express.Router();
const { AttioAPI } = require("../services/attio");

// Show deal page
router.get("/:record_id", async (req, res) => {
  try {
    const attio = new AttioAPI();
    const recordId = req.params.record_id;

    if (!recordId) {
      return res.status(400).send("Record ID is required");
    }

    // Fetch deal data from Attio
    const dealData = await attio.getRecord("deals", recordId);

    if (!dealData) {
      return res.status(404).send("Deal not found");
    }

    console.log("Deal Data:", JSON.stringify(dealData, null, 2));

    // Render the data directly in a simple page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Deal Data</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 p-8">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold mb-4">Deal Data</h1>
            <pre class="bg-white p-6 rounded-lg shadow overflow-auto">${JSON.stringify(
              dealData,
              null,
              2
            )}</pre>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching deal:", error);
    const errorMessage =
      error.response?.data?.message || "Error loading deal data";
    res.status(error.response?.status || 500).send(errorMessage);
  }
});

module.exports = router;
