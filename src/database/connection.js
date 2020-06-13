require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_LINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
