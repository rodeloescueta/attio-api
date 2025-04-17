/**
 * URL Generator Utilities
 *
 * This module provides functions for generating secure URLs for client-facing
 * views like proposals and quotes. It includes functions for creating secure
 * tokens and calculating expiration dates.
 */

const crypto = require("crypto");
const logger = require("./logger");

/**
 * Generates a cryptographically secure random token.
 *
 * @param {number} length - The length of the token in bytes (default: 32)
 * @returns {string} A hex-encoded random token
 */
function generateSecureToken(length = 32) {
  try {
    return crypto.randomBytes(length).toString("hex");
  } catch (error) {
    logger.error(`Error generating secure token: ${error.message}`);
    throw new Error("Failed to generate secure token");
  }
}

/**
 * Calculates an expiration date for a token.
 *
 * @param {number} days - Number of days until expiration (default: 30)
 * @returns {Date} Expiration date
 */
function calculateExpiryDate(days = 30) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  return expiryDate;
}

/**
 * Generates a secure URL for a proposal.
 *
 * Note: This is a simplified implementation. In a real implementation,
 * you would store the token in Attio or another persistent storage.
 *
 * @param {string} proposalId - The identifier for the proposal
 * @param {number} expiryDays - Days until the URL expires (default: 30)
 * @param {string} baseUrl - Base URL for the application (default: process.env.BASE_URL or '')
 * @returns {Object} Object containing URL, token, and expiry date
 */
function generateProposalUrl(
  proposalId,
  expiryDays = 30,
  baseUrl = process.env.BASE_URL || ""
) {
  try {
    const token = generateSecureToken();
    const expiryDate = calculateExpiryDate(expiryDays);

    // In a real implementation, store the token and expiry date in Attio or another storage

    // Format the URL
    const url = `${baseUrl}/proposals/${proposalId}?token=${token}`;

    logger.info(`Generated secure URL for proposal ${proposalId}`);

    return {
      url,
      token,
      expiryDate,
      proposalId,
    };
  } catch (error) {
    logger.error(`Error generating proposal URL: ${error.message}`);
    throw new Error("Failed to generate proposal URL");
  }
}

/**
 * Generates a secure URL for a quote.
 *
 * @param {string} quoteId - The identifier for the quote
 * @param {number} expiryDays - Days until the URL expires (default: 30)
 * @param {string} baseUrl - Base URL for the application (default: process.env.BASE_URL or '')
 * @returns {Object} Object containing URL, token, and expiry date
 */
function generateQuoteUrl(
  quoteId,
  expiryDays = 30,
  baseUrl = process.env.BASE_URL || ""
) {
  try {
    const token = generateSecureToken();
    const expiryDate = calculateExpiryDate(expiryDays);

    // In a real implementation, store the token and expiry date in Attio or another storage

    // Format the URL
    const url = `${baseUrl}/quotes/${quoteId}?token=${token}`;

    logger.info(`Generated secure URL for quote ${quoteId}`);

    return {
      url,
      token,
      expiryDate,
      quoteId,
    };
  } catch (error) {
    logger.error(`Error generating quote URL: ${error.message}`);
    throw new Error("Failed to generate quote URL");
  }
}

/**
 * Checks if a token has expired.
 *
 * @param {Date} expiryDate - The expiration date to check
 * @returns {boolean} True if the token has expired, false otherwise
 */
function isTokenExpired(expiryDate) {
  if (!expiryDate) return true;

  const now = new Date();
  return now > expiryDate;
}

module.exports = {
  generateSecureToken,
  calculateExpiryDate,
  generateProposalUrl,
  generateQuoteUrl,
  isTokenExpired,
};
