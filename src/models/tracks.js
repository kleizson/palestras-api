const mongoose = require("../database/connection");

const TracksSchema = new mongoose.Schema({
  track: {
    type: [Object],
  },
});

const Track = mongoose.model("tracks", TracksSchema);

module.exports = Track;
