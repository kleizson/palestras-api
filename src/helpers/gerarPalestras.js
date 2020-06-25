const moment = require("moment");

module.exports = function gerarPalestras(arquivoPalestras) {
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
  return gerarHorario(ordenarPalestras(gerarObjetosPalestra(arquivoPalestras)));
};
