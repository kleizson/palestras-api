require("dotenv").config({ path: "../.env" });
const server = require("./index");

console.log(process.env.PORT);
server.listen(process.env.PORT || 3333, () => {
  console.log("Servidor iniciado...");
});
