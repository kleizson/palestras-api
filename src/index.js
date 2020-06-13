const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // liberando acesso de outros dominios a api
app.use(express.urlencoded({ extended: false })); // lidar com informações vindas do Body da requisição
app.use(express.json()); // lidar com requisições em formato json

app.use(require("./routes"));

module.exports = app;
