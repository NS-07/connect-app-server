const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Connection = mongoose.model("CONNECTION");
const User = mongoose.model("USER");
const Location = mongoose.model("LOCATION");

const router = express.Router();

router.use(requireAuth);

//Route to get connections
router.get("/connections", async (req, res) => {
  const connections = await Connection.find({ userId: req.user._id });
  res.send(connections);
});

//Route to update users connections location in the database(update the connections array)
router.put("/update", async (req, res) => {
  try {
    let { connections } = await Connection.findOne({ userId: req.user._id });
    for (let i = 0; i < connections.length; i++) {
      const { number } = connections[i];
      const user = await User.findOne({ number });
      const user_id = user._id;
      const location = await Location.findOne({ userId: user_id });
      connections[i].coords = location.coords;
    }
    await Connection.updateOne({ userId: req.user._id }, { connections });
    res.send();
  } catch (err) {
    console.log("Error");
    res.status(422).send("Something went Wrong");
  }
});
module.exports = router;
