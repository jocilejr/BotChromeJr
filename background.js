update-chrome.storage.local.get-behavior
function n(e, t, o) {
  chrome.tabs.query({ url: e }, function(s) {
    s.length > 0 && s.forEach((a) => {
      chrome.tabs.sendMessage(a.id, { action: t, dados: o });
    });
  });
}
async function h(e, t = null) {
  return new Promise((o) => {
    chrome.storage.local.get([e], function(s) {
      if (chrome.runtime.lastError) {
        console.error(`Erro ao obter "${e}" do storage local`, chrome.runtime.lastError);
        o(t);
        return;
      }
      const a = s && Object.prototype.hasOwnProperty.call(s, e) ? s[e] : void 0;
      o(a === void 0 ? t : a);
    });
  });
}
function d(e) {
  const t = new Date(e), o = /* @__PURE__ */ new Date(), s = t.getTime() - o.getTime();
  return s <= 12e4 || s < 0;
}
async function f() {
  const i = await h("notifications", []), e = Array.isArray(i) ? i : [], t = [], o = [];
  let s = 0;
  for (const a of e) {
    if (!a || typeof a != "object")
      continue;
    !a.timeOut && d(`${a.date}T${a.time}`) && (a.timeOut = !0, o.push(a));
    a.timeOut && !a.read && s++;
    t.push(a);
  }
  n("https://web.whatsapp.com/*", "Update_Notificação", { update: t, dispart: o, tam: s });

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
