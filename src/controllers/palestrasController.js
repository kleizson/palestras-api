const tracksModel = require("../models/tracks");
const palestraModel = require("../models/palestra");
const gerarTracks = require("../helpers/gerarTracks");
const gerarPalestras = require("../helpers/gerarPalestras");

module.exports = {
  /**
   * @function store()  armazena no banco de dados as palestras e as tracks.
   */

  async store(req, res) {
    if (!req.file) {
      return res.status(400).json({
        error: {
          message: "Arquivo não encontrado!",
        },
      });
    } else if (req.file.mimetype !== "text/plain") {
      return res.status(400).json({
        error: {
          message: "Arquivo em formato não aceito!",
        },
      });
    } else if (String(req.file.buffer) === "") {
      return res.status(400).json({
        error: {
          message: "Arquivo Vazio!",
        },
      });
    }

    const arquivoPalestras = String(req.file.buffer).split("\n");

    try {
      const palestras = gerarPalestras(arquivoPalestras);
      const tracks = await gerarTracks(palestras);

      tracks.map(
        async (track) =>
          await tracksModel.create({
            track: track,
          })
      );

      await palestraModel.create(...palestras);

      return res.status(201).json({
        message: "Upload feito com sucesso! Palestras cadastradas",
        palestras: palestras,
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
   * @function index()  Retorna todas as palestras do banco de dados
   */

  async index(req, res) {
    try {
      const palestras = await palestraModel.find();
      if (palestras.length === 0) {
        return res.status(400).json({
          message: "Você não adicionou nenhum item!",
        });
      }
      return res.status(200).json({
        palestras,
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
   * @function show()  Retorna uma palestra específica de acordo com o id passado
   */

  async show(req, res) {
    const { id } = req.params;

    const palestra = await palestraModel.findById(id).catch((err) => {
      return res.status(400).json({
        error: {
          message: "Id de palestra Invalido!",
        },
      });
    });

    if (palestra === null) {
      return res.status(400).json({
        error: {
          message: "Id de palestra não existe!",
        },
      });
    }

    try {
      const palestra = await palestraModel.findById(id);
      return res.status(200).json({
        palestra,
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
   * @function update()  Atualiza uma palestra no banco de dados
   */

  async update(req, res) {
    const { id } = req.params;

    const palestra = await palestraModel.findById(id).catch((err) => {
      return res.status(400).json({
        error: {
          message: "Id de palestra Invalido!",
        },
      });
    });

    if (palestra === null) {
      return res.status(400).json({
        error: {
          message: "Id de palestra não existe!",
        },
      });
    }

    if (Object.entries(req.body).length === 0) {
      return res.status(400).json({
        error: {
          message:
            "Não foi alterado nenhuma palestra! nenhum paramentro para alterar foi passado!",
        },
      });
    }

    if (req.body.hora || req.body.duracao) {
      return res.status(403).json({
        error: {
          message:
            "Não é permitido editar os horários ou a duração das palestras!",
        },
      });
    }

    try {
      await palestraModel.findByIdAndUpdate(id, req.body);
      const palestraAtualizada = await palestraModel.findById(id);
      return res.status(200).json({
        message: "Palestra atualizada com sucesso!",
        palestra: palestraAtualizada,
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
   * @function destroy()  Deleta uma palestra do banco de dados
   */

  async destroy(req, res) {
    const { id } = req.params;

    const palestra = await palestraModel.findById(id).catch((err) => {
      return res.status(400).json({
        error: {
          message: "Id de palestra Invalido!",
        },
      });
    });

    if (palestra === null) {
      return res.status(400).json({
        error: {
          message: "Id de palestra não existe!",
        },
      });
    }

    try {
      await palestraModel.findByIdAndRemove(id);
      return res.status(200).json({
        message: "Palestra deletada com sucesso!",
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
