const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Location = mongoose.model("LOCATION");

const router = express.Router();

router.use(requireAuth);

//Route to post user's current location
//Route is working correctly
router.post("/location", async (req, res) => {
  const { timeStamp, coords } = req.body.location;

  if (!timeStamp || !coords) {
    return res
      .status(422)
      .send({ error: "You must provide us the coordinates." });
  }

  try {
    const doc = await Location.findOne({ userId: req.user._id });
    if (doc === null) {
      const location = new Location({
        timeStamp,
        coords,
        userId: req.user._id,
      });
      await location.save();
      res.send();
    } else {
      await Location.updateOne({ userId: req.user._id }, { timeStamp, coords });
      res.send();
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
