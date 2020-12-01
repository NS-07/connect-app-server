require("./src/Models/User");
require("./src/Models/Location");
require("./src/Models/Connection");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/authRoutes");
const requireAuth = require("./src/middlewares/requireAuth");
const locationRoute = require("./src/routes/locationRoutes");
const connectionLocationRoutes = require("./src/routes/connectionLocationRoutes");
const connectRoute = require("./src/routes/connectRoute");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(locationRoute);
app.use(connectionLocationRoutes);
app.use(connectRoute);

mongoose.connect("mongodb://localhost:27017/connectuserDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("open", () => {
  console.log("Connected to mongo");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your number is ${req.user.number}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
