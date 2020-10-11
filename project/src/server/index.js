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

// your API calls

// example API call
// app.get("/apod", async (req, res) => {
//   try {
//     let image = await fetch(
//       `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2020-09-29&api_key=gqfDpRxJPggnjyOhdpU8zqNut1Hgcl4b8OehsJma`
//     ).then(res => res.json());
//     res.send({ image });
//   } catch (err) {
//     console.log("error:", err);
//   }
// });

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.roverName}/photos?sol=2100?&api_key=${process.env.API_KEY}`
