const formatDateBR = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const generateUserPromptMeuDia = (userData = {}) => {
  const {
    nome = '',
    dataNascimento = '',
    estadoCivil = '',
    genero = '',
  } = userData;

  return `Gere uma previsão para o dia de hoje, com base nas seguintes informações:
- Data atual: ${formatDateBR()}
- Nome: ${nome}
- Data nascimento: ${dataNascimento}
- Estado civil: ${estadoCivil}
- Gênero: ${genero}`;
};

module.exports = { generateUserPromptMeuDia };
