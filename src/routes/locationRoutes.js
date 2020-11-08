const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Location = mongoose.model("LOCATION");

const router = express.Router();

router.use(requireAuth);

//Route to post user's current location
router.post("/location", async (req, res) => {
  const { timeStamp, coords } = req.body;

  if (!timeStamp || !coords) {
    return res
      .status(422)
      .send({ error: "You must provide us the coordinates." });
  }

  try {
    const location = new Location({
      timeStamp,
      coords,
      userId: req.user._id,
    });
    await location.save();
    res.send(location);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
