export const config = {
  // Nome Da WL Ativa
  name: "BotStar Plus",
  // Versão de build
  version: "7.4.2",
  // Chave de criptografia
  cript_key: "ffce211a-7b07-4d91-ba5d-c40bb4034a83",
  //Url do backend Principal
  backend: "https://backend.lotsofwms.in/",
  // Url do backend de funções auxiliares
  backend_utils: "https://backend-utils.wascript.com.br/",
  // WebSockets
  webSocket: {
    "multi-atendimento": "https://multi-atendimento.wascript.com.br",
    "api-whatsapp": "https://api-whatsapp.wascript.com.br"
  },
  // Url do painel de gestão
  painel_Gestor: "https://wa.link/73606u",
  // Url do audio transcriber
  audio_transcriber: "https://audio-transcriber.wascript.com.br/transcription",
  // Selector de elementos DOM
  domSelector: "https://backend.lotsofwms.in/api/common/v2/domselector.php",
  // Limite de mídia no Resposta Rápida
  midiaLimit: 50
};
