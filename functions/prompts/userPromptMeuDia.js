const generateUserPromptMeuDia = (userData = {}) => {
  const {
    nome = '',
    dataNascimento = '',
    estadoCivil = '',
    orientacaoSexual = '',
  } = userData;

  return `Gere uma previsão para o dia de hoje, com base nas seguintes informações:
- Nome: ${nome}
- Data nascimento: ${dataNascimento}
- Estado civil: ${estadoCivil}
- Orientação sexual: ${orientacaoSexual}`;
};

module.exports = { generateUserPromptMeuDia };
