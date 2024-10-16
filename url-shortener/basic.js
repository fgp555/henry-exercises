const express = require("express");

const app = express();

let dataTemp = [
  {
    longUrl: "https://www.google.com/",
    shortUrl: "google",
  },
  {
    longUrl: "https://www.example.com/demo2",
    shortUrl: "example",
  },
];

app.get("/", (req, res) => {
  res.json({ hello: "world" });
});

app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  const find1 = dataTemp.find((e) => e.shortUrl === shortUrl);
  if (find1) {
    // res.json(find1);
    res.redirect(find1.longUrl);
  } else {
    res.json({ message: "shortUrl no found" });
  }
});

app.listen(3000, () => console.log("3000"));
