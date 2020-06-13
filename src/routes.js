const routes = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();

// Rotas para as paletras
routes.post("/palestras", storage);
routes.get("/palestras");
routes.get("/palestras/:id");
routes.put("/palestras/:id");
routes.delete("/palestras/:id");
// Rotas para as Tracks
routes.get("tracks");
routes.get("tracks");
routes.delete("tracks/:id");
