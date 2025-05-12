class Rainfocus {
  constructor(apiProfileId, sessionId) {
    this.apiUrl =
      "https://events.rainfocus.com/api/adobe/v2/entityDataDump/session";
    this.apiProfileId = apiProfileId;
    this.sessionId = sessionId;
  }

  async fetchDoc() {
    const url = `${this.apiUrl}?rfApiProfileId=${this.apiProfileId}&publishedFiles=true&sessionId=${this.sessionId}`;
    try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Error fetching RF data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching RF data:", error);
      throw error;
    }
  }
}

module.exports = Rainfocus;
