const express = require("express");
const moovies = require("./moovies.js");



const app = express();

app.use("/api", moovies.mooviesBackend)



app.listen(80);

