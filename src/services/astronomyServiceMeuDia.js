import * as Astronomy from 'astronomy-engine';

const signos = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes',
];

export const obterSignoPorGraus = (longitude) => {
  const longitudeNormalizada = ((longitude % 360) + 360) % 360;
  return signos[Math.floor(longitudeNormalizada / 30)];
};

const obterSigno = (longitude) => obterSignoPorGraus(longitude);

const obterPosicao = (corpo, instante) => {
  const vetor = Astronomy.GeoVector(corpo, instante, true);
  return obterSigno(Astronomy.Ecliptic(vetor).elon);
};

export const obterSignoNatal = (dataNascimento) => {
  if (!dataNascimento) {
    return null;
  }

  let data;

  if (dataNascimento instanceof Date) {
    data = dataNascimento;
  } else if (typeof dataNascimento === 'string') {
    const match = dataNascimento.match(/^\d{2}\/\d{2}\/\d{4}$/);

    if (match) {
      const [dia, mes, ano] = dataNascimento.split('/').map(Number);
      data = new Date(ano, mes - 1, dia, 12, 0, 0, 0);
    } else {
      data = new Date(dataNascimento);
    }
  } else {
    data = new Date(dataNascimento);
  }

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  const tempoNascimento = Astronomy.MakeTime(data);
  const solNatal = Astronomy.SunPosition(tempoNascimento);
  return obterSignoPorGraus(solNatal.elon);
};

export const obterPosicoesAstrologicas = (instante = new Date()) => {
  try {
    return {
      sol: obterPosicao(Astronomy.Body.Sun, instante),
      lua: obterPosicao(Astronomy.Body.Moon, instante),
      mercurio: obterPosicao(Astronomy.Body.Mercury, instante),
      venus: obterPosicao(Astronomy.Body.Venus, instante),
      marte: obterPosicao(Astronomy.Body.Mars, instante),
      jupiter: obterPosicao(Astronomy.Body.Jupiter, instante),
      saturno: obterPosicao(Astronomy.Body.Saturn, instante),
      urano: obterPosicao(Astronomy.Body.Uranus, instante),
      netuno: obterPosicao(Astronomy.Body.Neptune, instante),
    };
  } catch (error) {
    console.error('Erro ao calcular posições astrológicas:', error);
    return {};
  }
};