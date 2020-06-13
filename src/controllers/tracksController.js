const tracksModel = require("../models/tracks");

module.exports = {
  /**
   * @function index()  Retorna todas as tracks do banco de dados
   */

  async index(req, res) {
    try {
      const tracks = await tracksModel.find();
      if (tracks.length === 0) {
        return res.status(403).json({
          message: "Você não adicionou nenhum item!",
        });
      }
      return res.status(200).json({
        tracks,
      });
    } catch (error) {
      return res.status(500).json({
        error: {
          message: error,
        },
      });
    }
  },

  /**
   * @function show()  Retorna uma track específica de acordo com o id passado
   */

  async show(req, res) {
    const { id } = req.params;

    try {
      const track = await tracksModel.findById(id);

      return res.status(200).json({
        track,
      });
    } catch (error) {
      return res.status(500).json({
        error: {
          message: error,
        },
      });
    }
  },

  /**
   * @function destroy()  Deleta uma track do banco de dados
   */

  async destroy(req, res) {
    const { id } = req.params;

    try {
      await tracksModel.findByIdAndRemove(id);
      return res.status(200).json({
        message: "track deletada com sucesso!",
      });
    } catch (error) {
      return res.status(500).json({
        error: {
          message: error,
        },
      });
    }
  },
};
