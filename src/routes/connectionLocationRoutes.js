const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Connection = mongoose.model("CONNECTION");
const User = mongoose.model("USER");

const router = express.Router();

router.use(requireAuth);

//Route to get connections
router.get("/connections", async (req, res) => {
  const connections = await Connection.find({ userId: req.user._id });
  res.send(connections);
});

//Route to update users connections location in the database(update the connections array)
module.exports = router;
