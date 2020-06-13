const routes = require("express").Router();
const multer = require("multer");

const palestrasController = require("./controllers/palestrasController");
const tracksController = require("./controllers/tracksController");

const storage = multer.memoryStorage();

// Rotas para as paletras
routes.post(
  "/palestras",
  multer({ storage }).single("file"),
  palestrasController.store
);
routes.get("/palestras", palestrasController.index);
routes.get("/palestras/:id", palestrasController.show);
routes.put("/palestras/:id");
routes.delete("/palestras/:id");
// Rotas para as Tracks
routes.get("/tracks");
routes.get("/tracks");
routes.delete("/tracks/:id");

module.exports = routes;
