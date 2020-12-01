const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Connection = mongoose.model("CONNECTION");
const User = mongoose.model("USER");
const Location = mongoose.model("LOCATION");

const router = express.Router();

router.use(requireAuth);

//Route to find if the person to connect with is registered in the database
//Route is working correctly
router.post("/connectFind", async (req, res) => {
  const { number } = req.body;
  if (!number) {
    res.status(422).send({ error: "Please provide the number" });
  }
  const user = await User.findOne({ number });

  if (!user) {
    return res.status(422).send("No user with this number found.");
  }
  let connected = false;
  try {
    const { connections } = await Connection.findOne({ userId: req.user._id });

    if (connections != null) {
      const index = connections.findIndex(
        (element) => element.number === number
      );
      if (index === -1) {
        connected = false;
      } else {
        connected = true;
      }
    }
  } catch {
    console.log("Not Connected yet");
  }
  return res.send({
    name: user.name,
    number: user.number,
    isConnected: connected,
  });
});

// //Route to make the connection
//Route is working correctly
router.post("/connect", async (req, res) => {
  const user_location = await Location.findOne({
    userId: req.user._id,
  });
  const { number } = req.body;
  const user = await User.findOne({ _id: req.user._id });
  const user_to_connect = await User.findOne({ number });
  const user_to_connect_id = user_to_connect._id;
  const user_to_connect_location = await Location.findOne({
    userId: user_to_connect_id,
  });
  const new_connection_1 = {
    name: user.name,
    number: user.number,
    timeStamp: user_location.timeStamp,
    coords: user_location.coords,
  };
  const new_connection_2 = {
    name: user_to_connect.name,
    number: user_to_connect.number,
    timeStamp: user_to_connect_location.timeStamp,
    coords: user_to_connect_location.coords,
  };

  try {
    let doc_1 = await Connection.find({ userId: req.user._id });
    let doc_2 = await Connection.find({ userId: user_to_connect_id });
    if (doc_1.length === 0) {
      const connect_1 = new Connection({
        userId: req.user._id,
        connections: [new_connection_2],
      });
      await connect_1.save();
    } else {
      await Connection.updateOne(
        { userId: req.user._id },
        { $push: { connections: new_connection_2 } }
      );
    }
    if (doc_2.length === 0) {
      const connect_2 = new Connection({
        userId: user_to_connect_id,
        connections: [new_connection_1],
      });
      await connect_2.save();
    } else {
      await Connection.updateOne(
        { userId: user_to_connect_id },
        { $push: { connections: new_connection_1 } }
      );
    }
    res.send();
  } catch (err) {
    res.status(422).send("Unknown Error Occured");
  }
});

module.exports = router;
