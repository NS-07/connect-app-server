const mongoose = require("mongoose");

const connectSchema = new mongoose.Schema({
  name: String,
  number: String,
  timeStamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});

const connectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connections: [connectSchema],
});

mongoose.model("CONNECTION", connectionSchema);
