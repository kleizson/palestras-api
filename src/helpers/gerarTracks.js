module.exports = async function gerarTracks(palestrasOrganizadas) {
  const tracks = [];

  for (
    let contadorTrack = 1;
    contadorTrack <= palestrasOrganizadas[palestrasOrganizadas.length - 1].day;
    contadorTrack++
  ) {
    tracks.push({
      [`track${contadorTrack}`]: palestrasOrganizadas.filter(
        (palestras) => palestras.day === contadorTrack
      ),
    });
  }
  return tracks;
};
