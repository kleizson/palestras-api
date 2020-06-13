require("dotenv").config();
const server = require("./index");

server.listen(process.env.PORT || 3333, () => {
  console.log("Servidor iniciado...");
});
