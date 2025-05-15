const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
const { formattedDate } = require("./transformer");
const RF = require("./services/rainfocus");
const DA = require("./services/da");
const HLX = require("./services/hlx");
const autoUpdateContent = require("./utils/content-update");
const { JSDOM } = require("jsdom");
require("dotenv").config();
const app = express();
const PORT = 5001;

// Register '.mustache' extension with Mustache Express
app.engine("html", mustacheExpress());

// Set 'views' directory for templates and set view engine
app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "html");

// Serve static files (optional)
app.use(express.static(path.join(__dirname, "public")));

// Route to render template
app.get("/", async (req, res) => {
  // Fetch data from Rainfocus
  const apiProfileId = process.env.API_PROFILE_ID;
  const sessionId = process.env.SESSION_ID;
  const RFService = new RF(apiProfileId, sessionId);
  const payload = await RFService.fetchDoc();
  console.log("Payload from Rainfocus:", payload);
  if (!payload) {
    return res.status(500).send("Error fetching data from Rainfocus");
  }
  const finalPayload = {
    eventName: payload.data[0].eventName,
    abstract: payload.data[0].abstract,
    participants: payload.data[0].participants,
    ...payload,
  };

  //Fetch HTML from DA
  const daUrl = "https://admin.da.live/source";
  const daOrg = "adobecom";
  const daPath = "/da-bacom/drafts/sharmeeb/t1-events/sample-template.html";
  const daToken = process.env.DA_TOKEN;
  const DAService = new DA(daUrl, daOrg, daPath, daToken);
  const daHTML = await DAService.fetchDoc();
  console.log("DA Document:", daHTML);
  if (!daHTML) {
    return res.status(500).send("Error fetching data from DA");
  }

  // Render the template with the payload
  const dom = new JSDOM(daHTML);
  const updatedDOM = autoUpdateContent(dom.window.document, finalPayload);

  // TODO: Publish to EDS
//   const hlxUrl = "https://admin.hlx.page/preview";
//   const hlxOrg = "adobecom";
//   const hlxPath = "/da-bacom/main/drafts/sharmeeb/t1-events/sample-event";
//   const hlxToken = process.env.HLX_TOKEN;
//   const HLXService = new HLX(hlxUrl, hlxOrg, hlxPath, hlxToken);
//   const hlxRes = await HLXService.preview();
//   console.log("HLX Document:", hlxHTML);
//   if (!hlxHTML) {
//     return res.status(500).send("Error fetching data from HLX");
//   }

  res.send(updatedDOM.documentElement.outerHTML);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
