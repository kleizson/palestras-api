const moment = require("moment");
const tracksModel = require("../models/tracks");
const palestraModel = require("../models/palestra");

module.exports = {
  /**
   * @function store()  Faz a logica da organização dos horários e armazena no banco de dados
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

    // usei a biblioteca moment para trabalhar com as horas
    moment.locale("pt-br");

    // Função que gera um novo array contendo um objeto com nome e duração das palestras
    function gerarObjetosPalestra(arquivoPalestras) {
      let palestras = arquivoPalestras.map((linha) => {
        return {
          nome: linha.split(/\d/)[0].trim(),
          duracao: linha.match(/\d|lightning+/g).join(""),
        };
      });
      return palestras;
    }
    // Função organiza em ordem crescente as durações das palestras, fica mais fácil de trabalhar com os horários.
    function ordenarPalestras(palestras) {
      let palestrasOrdenadas = palestras.sort((a, b) => {
        a.duracao === "lightning" ? (a.duracao = 5) : a.duracao;
        b.duracao === "lightning" ? (b.duracao = 5) : b.duracao;
        return parseInt(b.duracao) - parseInt(a.duracao);
      });
      return palestrasOrdenadas;
    }

    // Função que cria os horários para cada palestra
    function gerarHorario(palestrasOrdenadas) {
      let day = 0;
      let palestrasOrganizadas = [];
      let horarioInicialPalestras = moment("09:00", "HH:mm");

      //Estou percorrendo o Array com os objetos das palestras
      //coloquei algumas condições e a cada volta, o horario é acrescentado p duração da palestra
      palestrasOrdenadas.map((palestras) => {
        let duracaoPaletra =
          palestras.duracao === "lightning" ? 5 : palestras.duracao;

        if (
          horarioInicialPalestras.format("LT") >= "12:00" &&
          horarioInicialPalestras.format("LT") < "13:00"
        ) {
          palestrasOrganizadas.push({
            nome: "Almoço",
            duracao: "60",
            hora: "12:00",
            day: day,
          });

          horarioInicialPalestras = moment("13:00", "HH:mm");
        } else if (horarioInicialPalestras.format("LT") > "16:00") {
          if (
            moment(horarioInicialPalestras)
              .add(parseInt(duracaoPaletra), "minutes")
              .format("LT") > "17:00"
          ) {
            palestrasOrganizadas.push({
              nome: "Evento de Networking",
              hora: horarioInicialPalestras.format("LT"),
              day: day,
            });
            horarioInicialPalestras = moment("09:00", "HH:mm");
          }
        }
        horarioInicialPalestras.format("LT") === "09:00" ? day++ : day;
        palestrasOrganizadas.push({
          ...palestras,
          hora: horarioInicialPalestras.format("LT"),
          day: day,
        });
        horarioInicialPalestras.add(parseInt(duracaoPaletra), "minutes");
      });
      palestrasOrganizadas.push({
        nome: "Evento de Networking",
        hora:
          horarioInicialPalestras.format("LT") <= "16:00"
            ? "17:00"
            : horarioInicialPalestras.format("LT"),
        day: day,
      });
      return palestrasOrganizadas;
    }

    // Função para cadastrar no banco de dados as track e as suas palestras organizadas por numero
    async function cadastrandoTracksBancoDeDados(palestrasOrganizadas) {
      for (
        let contadorTrack = 1;
        contadorTrack <=
        palestrasOrganizadas[palestrasOrganizadas.length - 1].day;
        contadorTrack++
      ) {
        await tracksModel.create({
          track: {
            [`track${contadorTrack}`]: palestrasOrganizadas.filter(
              (palestras) => palestras.day === contadorTrack
            ),
          },
        });
      }
    }

    try {
      const palestras = gerarHorario(
        ordenarPalestras(gerarObjetosPalestra(arquivoPalestras))
      );

      cadastrandoTracksBancoDeDados(palestras);

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
        return res.status(403).json({
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

    const palestra = await palestraModel.findById(id);

    if (palestra === null) {
      return res.status(403).json({
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

    const palestra = await palestraModel.findById(id);

    if (palestra === null) {
      return res.status(403).json({
        error: {
          message: "Id de palestra não existe!",
        },
      });
    }

    if (Object.entries(req.body).length === 0) {
      return res.status(403).json({
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

    const palestra = await palestraModel.findById(id);

    if (palestra === null) {
      return res.status(403).json({
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
