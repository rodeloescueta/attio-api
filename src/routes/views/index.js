/**
 * View Routes
 *
 * This module defines the routes for client-facing views like proposals and quotes.
 * These routes use EJS templates to render HTML pages for customers to view and
 * interact with their proposals, quotes, and service agreements.
 */

const express = require("express");
const router = express.Router();
const { validateViewToken } = require("../../middleware/tokenAuth");
const logger = require("../../utils/logger");

// Import controllers
// Note: These controllers don't exist yet and need to be created
// const proposalController = require('../../controllers/views/proposalController');
// const quoteController = require('../../controllers/views/quoteController');

// Home page route (for demonstration purposes)
router.get("/", (req, res) => {
  res.render("home", {
    title: "Welcome",
    message: "Welcome to the Attio Integration Portal",
  });
});

// Proposal view route (with token validation)
router.get("/proposals/:id", validateViewToken, (req, res) => {
  // This is a placeholder until the proposalController is implemented
  logger.info(`Accessing proposal view for ID: ${req.params.id}`);

  // Temporary mock data
  const proposalData = {
    id: req.params.id,
    title: `Proposal #${req.params.id}`,
    client: "Sample Client",
    date: new Date().toLocaleDateString(),
    services: [
      {
        name: "Service 1",
        description: "Description of service 1",
        price: "$100",
      },
      {
        name: "Service 2",
        description: "Description of service 2",
        price: "$200",
      },
    ],
    total: "$300",
    validUntil: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    serviceAgreement:
      "# Service Agreement\n\nThis is a sample service agreement in markdown format. When properly implemented, this will be converted to formatted HTML.",
  };

  // In the real implementation, the controller would fetch the proposal data from Attio
  // and convert the markdown service agreement to HTML before rendering

  res.render("proposals/show", {
    title: `Proposal - ${proposalData.title}`,
    proposal: proposalData,
  });
});

// Quote view route (with token validation)
router.get("/quotes/:id", validateViewToken, (req, res) => {
  // This is a placeholder until the quoteController is implemented
  logger.info(`Accessing quote view for ID: ${req.params.id}`);

  // Temporary mock data
  const quoteData = {
    id: req.params.id,
    title: `Quote #${req.params.id}`,
    client: "Sample Client",
    date: new Date().toLocaleDateString(),
    items: [
      { name: "Item 1", quantity: 1, unitPrice: "$100", total: "$100" },
      { name: "Item 2", quantity: 2, unitPrice: "$50", total: "$100" },
    ],
    subtotal: "$200",
    tax: "$20",
    total: "$220",
    validUntil: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  };

  // In the real implementation, the controller would fetch the quote data from Attio

  res.render("quotes/show", {
    title: `Quote - ${quoteData.title}`,
    quote: quoteData,
  });
});

// Error pages for testing
router.get("/error", (req, res) => {
  res.status(500).render("errors/error", {
    title: "Error",
    message: "This is a sample error page",
  });
});

router.get("/unauthorized", (req, res) => {
  res.status(401).render("errors/unauthorized", {
    title: "Unauthorized",
    message: "This is a sample unauthorized page",
  });
});

router.get("/not-found", (req, res) => {
  res.status(404).render("errors/not-found", {
    title: "Not Found",
    message: "This is a sample not found page",
  });
});

module.exports = router;
