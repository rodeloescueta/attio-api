/**
 * Markdown Processing Utilities
 *
 * This module provides functions for converting markdown text to HTML,
 * with proper sanitization to prevent XSS attacks. It's primarily used
 * for rendering service agreements and other formatted content in the
 * client-facing views.
 */

const logger = require("./logger");

/**
 * Converts markdown text to HTML with sanitization.
 *
 * Note: This is a placeholder implementation. You'll need to install
 * the required dependencies first:
 *
 * pnpm add marked sanitize-html
 *
 * Once installed, uncomment the code below and remove the placeholder.
 */

// Placeholder implementation until dependencies are installed
async function convertToHtml(markdown) {
  if (!markdown) return "";

  try {
    // This is a very basic placeholder that just wraps text in paragraphs
    // Replace this with the actual implementation after installing dependencies
    logger.info("Converting markdown to HTML (placeholder implementation)");

    return `<p>${markdown.replace(/\n\n/g, "</p><p>")}</p>`;
  } catch (error) {
    logger.error(`Error converting markdown to HTML: ${error.message}`);
    throw new Error("Failed to convert markdown to HTML");
  }
}

/**
 * Real implementation (uncomment after installing dependencies)
 *
 * async function convertToHtml(markdown) {
 *   if (!markdown) return '';
 *
 *   const marked = require('marked');
 *   const sanitizeHtml = require('sanitize-html');
 *
 *   try {
 *     // Configure marked options
 *     marked.setOptions({
 *       gfm: true,          // GitHub flavored markdown
 *       breaks: true,       // Convert line breaks to <br>
 *       headerIds: true,    // Add IDs to headers
 *       mangle: false       // Don't escape HTML
 *     });
 *
 *     // Convert markdown to HTML
 *     const html = marked.parse(markdown);
 *
 *     // Sanitize HTML to prevent XSS
 *     const sanitizedHtml = sanitizeHtml(html, {
 *       allowedTags: sanitizeHtml.defaults.allowedTags.concat([
 *         'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'span'
 *       ]),
 *       allowedAttributes: {
 *         ...sanitizeHtml.defaults.allowedAttributes,
 *         'img': ['src', 'alt', 'title', 'width', 'height'],
 *         'a': ['href', 'name', 'target', 'rel'],
 *         '*': ['class', 'id', 'style']
 *       }
 *     });
 *
 *     logger.info('Successfully converted markdown to HTML');
 *     return sanitizedHtml;
 *   } catch (error) {
 *     logger.error(`Error converting markdown to HTML: ${error.message}`);
 *     throw new Error('Failed to convert markdown to HTML');
 *   }
 * }
 */

/**
 * Extracts plain text from markdown for use in summaries or meta descriptions.
 *
 * @param {string} markdown - The markdown text to process
 * @param {number} maxLength - Maximum length of the plain text
 * @returns {string} Plain text without markdown formatting
 */
function extractPlainText(markdown, maxLength = 200) {
  if (!markdown) return "";

  try {
    // Basic removal of markdown formatting
    let text = markdown
      .replace(/#+\s+(.*)/g, "$1") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
      .replace(/!\[(.*?)\]\(.*?\)/g, "$1") // Remove images
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    // Truncate to maxLength if needed
    if (text.length > maxLength) {
      text = text.substring(0, maxLength).trim() + "...";
    }

    return text;
  } catch (error) {
    logger.error(`Error extracting plain text from markdown: ${error.message}`);
    return "";
  }
}

module.exports = {
  convertToHtml,
  extractPlainText,
};
