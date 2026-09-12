# MeuDiaAI

Aplicativo mobile em React Native / Expo para gerar previsões diárias personalizadas com IA, com backend em Firebase Functions para orquestrar a chamada ao OpenAI.

## Visão geral

Este projeto foi simplificado para suportar a funcionalidade de previsão do dia, usando os prompts e a lógica em [functions/index.js](functions/index.js) e os arquivos de prompt em [functions/prompts](functions/prompts).

### Funcionalidade principal
- Geração de previsão diária personalizada com IA
- Integração com Firebase Functions
- Prompt do sistema e do usuário separados para facilitar manutenção

## Estrutura do projeto

- [App.js](App.js) — ponto de entrada do app Expo
- [functions/index.js](functions/index.js) — endpoint Firebase com a lógica de previsão diária
- [functions/prompts/systemPromptMeuDia.js](functions/prompts/systemPromptMeuDia.js) — prompt do sistema para Meu Dia
- [functions/prompts/userPromptMeuDia.js](functions/prompts/userPromptMeuDia.js) — montagem do prompt do usuário
- [package.json](package.json) — dependências do app mobile
- [functions/package.json](functions/package.json) — dependências das Cloud Functions

## Como rodar

### App mobile

```bash
npm install
npm start
```

A partir daí, use o Expo para abrir no emulador ou no dispositivo.

### Firebase Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

## Variáveis / segredos

O backend usa o segredo Firebase:

- OPENAI_API_KEY

Esse valor deve estar configurado no Firebase em ambiente de produção/desenvolvimento conforme necessário.

## Observação

A versão atual do projeto foi limpa para manter somente a lógica de previsão diária, removendo módulos e prompts que não estavam mais sendo usados pela aplicação.
