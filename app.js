const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
const { formattedDate } = require("./transformer");
const RF = require("./services/rainfocus");
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
  const payload1 = {
    eventTitle: "MAX London 2025",
    eventVenue: "London",
    eventDesc: "<p>Join us for a special event!</p>",
    timestamp: formattedDate("1746622911009"),
  };
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
    ...payload,
  };

  res.render("./summit-2025/session.html", finalPayload);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
