const mongoose = require("../database/connection");

const PalestraSchema = new mongoose.Schema({
  nome: {
    type: String,
  },
  duracao: {
    type: String,
  },
  hora: {
    type: String,
  },
  day: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Palestras = mongoose.model("palestras", PalestraSchema);

module.exports = Palestras;
