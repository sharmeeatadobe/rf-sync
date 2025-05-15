class HLX {
    constructor(url, org, path, token) {
      this.apiUrl = url; //https://admin.hlx.page/preview
      this.org = org; //adobecom
      this.path = path;//da-bacom/main/drafts/sharmeeb/t1-events/sample-event
      this.token = token;
    }
  
    async preview() {
      const url = `${this.apiUrl}/${this.org}${this.path}`;
      try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
        if (!response.ok) {
          throw new Error(`Error previewing in HLX: ${response.statusText}`);
        }
      return await response.json();
      } catch (error) {
        console.error("Error previewing in HLX:", error);
        throw error;
      }
    }
  }
  
  module.exports = HLX;
  