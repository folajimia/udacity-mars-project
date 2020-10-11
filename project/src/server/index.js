require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

app.post("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.roverName}/latest_photos?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    debugger;
    res.send({ image });
    console.log(image);
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
