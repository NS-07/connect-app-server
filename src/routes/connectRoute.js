const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Connection = mongoose.model("CONNECTION");
const User = mongoose.model("USER");
const Location = mongoose.model("LOCATION");

const router = express.Router();

Router.use(requireAuth);

//Route to find if the person to connect with is registered in the database
router.get("/connectFind", async (req, res) => {
  const { number } = req.body;
  if (!number) {
    res.status(422).send({ error: "Please provide the number" });
  }
  const user = await User.findOne({ number });

  if (!user) {
    return res.status(422).send("No user with this number found.");
  } else {
    return res.send({ name: user.name, number: user.number });
  }
});

// Route to send Request

// //Route to make the connection
// router.post("/connect", async (req, res) => {
//   const { timeStamp, coords } = await Location.findOne({
//     userId: req.user._id,
//   });
//   const { number } = req.body;
//   const user_location = await Location.findOne({ number });
//   const user_to_connect = await User.findOne({ number });
//   const user_to_connect_id = user_to_connect._id;
//   const user_to_connect_location = await Location.findOne({
//     userId: user_to_connect_id,
//   });
// });
