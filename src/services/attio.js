const axios = require("axios");

class AttioAPI {
  constructor() {
    this.apiKey = process.env.ATTIO_API_KEY;
    this.workspaceId = process.env.ATTIO_WORKSPACE_ID || "sellerinteractive";
    this.baseURL = process.env.ATTIO_API_URL || "https://api.attio.com/v2";
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getRecord(objectType, recordId) {
    try {
      const response = await this.client.get(
        `/objects/${objectType}/records/${recordId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${objectType} record:`, error);
      throw error;
    }
  }

  async updateRecord(objectType, recordId, data) {
    try {
      const response = await this.client.patch(
        `/objects/${objectType}/records/${recordId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating ${objectType} record:`, error);
      throw error;
    }
  }
}

module.exports = { AttioAPI };
