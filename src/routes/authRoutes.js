require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
//To get access to that user model(collection)
const User = mongoose.model("USER");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { number, name, password } = req.body;
  try {
    const user = new User({ number, name, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.TOKENSTRING);
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { number, password } = req.body;

  if (!number || !password) {
    return res.status(422).send({ error: "Must provide number and password" });
  }

  const user = await User.findOne({ number });
  if (!user) {
    return res.status(422).send({ error: "Invalid number or password" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.TOKENSTRING);
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid number or password" });
  }
});

module.exports = router;
