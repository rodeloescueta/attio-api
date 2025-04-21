const express = require("express");
const router = express.Router();
const { AttioAPI } = require("../services/attio");
const marked = require("marked");

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

    if (!dealData || !dealData.data || !dealData.data.values) {
      console.error("Invalid deal data structure:", dealData);
      return res.status(404).send("Deal data not found or invalid");
    }

    // Log the data structure for debugging
    console.log("Deal Data Structure:", JSON.stringify(dealData, null, 2));

    // Render the proposal template with the data
    res.render("proposal", {
      data: dealData.data,
      marked: marked,
    });
  } catch (error) {
    console.error("Error fetching deal:", error);
    const errorMessage =
      error.response?.data?.message || "Error loading deal data";
    res.status(error.response?.status || 500).send(errorMessage);
  }
});

module.exports = router;
