class DA {
  constructor(url, org, path, token) {
    this.apiUrl = url;
    this.org = org;
    this.token = token;
    this.path = path;
  }

  async fetchDoc() {
    // Function logic for fetching a document
    const url = `${this.apiUrl}/${this.org}${this.path}`;
    try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "text/html",
      },
    });
      if (!response.ok) {
        throw new Error(`Error fetching from DA: ${response.statusText}`);
      }
    const htmlText = await response.text();
    return htmlText;
    } catch (error) {
      console.error("Error fetching from DA:", error);
      throw error;
    }
  }
}

module.exports = DA;
