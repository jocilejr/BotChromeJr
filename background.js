import { ensureRecurringAlarms, registerAlarmHandlers } from "./alarms.js";
import { ensureWhatsAppStatusListeners, openExtensionTab, openOrReloadWhatsAppTab } from "./tabs.js";

function getTomorrowDate() {
  const tomorrow = /* @__PURE__ */ new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DEFAULT_BACKUP_CONFIGURATION = {
  date: getTomorrowDate(),
  items: [
    "respostasRapidas",
    "respostasRapidasAcao",
    "categoria",
    "agendamentos",
    "agendamentosNaoDisparados",
    "sendAfterWhatsAppOpens",
    "crm",
    "contatos",
    "notes",
    "notifications",
    "perfil",
    "userTabs",
    "agrupamentos",
    "relatorio",
    "encomendas",
    "autoatendimento",
    "webhook",
    "IA",
    "status",
    "pinChat",
    "atendimento",
    "backupAutomatico",
    "whatsApi",
    "FollowUp",
    "fluxo"
  ],
  recurrency: "diario",
  time: "10:30"
};

function initializeStorageDefaults() {
  chrome.storage.local.get(null, (storedValues) => {
    chrome.storage.local.set({
      agendamentos: storedValues.agendamentos || [],
      agendamentosNaoDisparados: storedValues.agendamentosNaoDisparados || [],
      sendAfterWhatsAppOpens: storedValues.sendAfterWhatsAppOpens || !1,
      notifications: storedValues.notifications || [],
      userTabs: storedValues.userTabs || [],
      contatos: storedValues.contatos || [],
      notes: storedValues.notes || [],
      agendaMsg: storedValues.agendaMsg || [],
      perfil: storedValues.perfil || [],
      categoria: storedValues.categoria || [],
      initSystem: storedValues.initSystem || !1,
      backupAutomatico: storedValues.backupAutomatico || DEFAULT_BACKUP_CONFIGURATION,
      crm: storedValues.crm || [],
      fluxo: storedValues.fluxo || { workflows: [], currentWorkflow: null },
      fluxoFiles: storedValues.fluxoFiles || [],
      agrupamentos: storedValues.agrupamentos || [],
      relatorio: storedValues.relatorio || [],
      encomendas: storedValues.encomendas || [],
      autoatendimento: storedValues.autoatendimento || [],
      FollowUp: storedValues.FollowUp || [],
      webhook: storedValues.webhook || [],
      IA: storedValues.IA || { activeIA: null, keyGemini: "", keyGPT: "" },
      status: storedValues.status || [],
      pinChat: storedValues.pinChat || [],
      atendimento: storedValues.atendimento || void 0,
      whatsApi: storedValues.whatsApi || { active: !1, token: "", userID: "" },
      initDate: storedValues.initDate || !1,
      modalLead: storedValues.modalLead || {},
      guardaMsg: storedValues.guardaMsg || [],
      medias: storedValues.medias || [],
      respostasRapidas: storedValues.respostasRapidas || [],
      respostasRapidasAcao: storedValues.respostasRapidasAcao || []
    });
  });
}

function configureUninstallRedirect() {
  chrome.runtime.setUninstallURL(`https://backend.lotsofwms.in/api/common/v2/urls/uninstall.php?id=683f11a52f516`);
}

function handleInstallEvent(details) {
  if (details.reason === "install")
    fetch(`https://backend.lotsofwms.in/api/common/v2/urls/install.php?id=683f11a52f516`).then((response) => {
      if (!response.ok)
        throw new Error("Erro na requisição: " + response.status);
      return response.json();
    }).then((payload) => {
      payload.success && chrome.tabs.create({ url: payload.url });
    }).catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
    });
}

registerAlarmHandlers();
ensureRecurringAlarms();
ensureWhatsAppStatusListeners();

chrome.action.onClicked.addListener(() => {
  ensureRecurringAlarms();
  ensureWhatsAppStatusListeners();
  openOrReloadWhatsAppTab();
});

chrome.runtime.onInstalled.addListener(async function(details) {
  handleInstallEvent(details);
  openOrReloadWhatsAppTab();
  ensureRecurringAlarms();
  initializeStorageDefaults();
  ensureWhatsAppStatusListeners();
  configureUninstallRedirect();
});

chrome.runtime.onMessage.addListener((message) => {
  switch (message.message) {
    case "CRM":
      openExtensionTab("crm");
      break;
    case "FLOW":
      openExtensionTab("fluxo");
      break;
    case "funnil":
      openExtensionTab("funnil");
      break;
  }
});
