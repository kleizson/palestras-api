require("dotenv").config();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.NODE_ENV === "test"
    ? process.env.DB_URL_TESTE
    : process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

module.exports = mongoose;
