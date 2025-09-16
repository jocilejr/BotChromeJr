const WHATSAPP_URL = "https://web.whatsapp.com/*";
const whatsappTabs = /* @__PURE__ */ new Map();

export function sendMessageToUrl(url, action, dados) {
  chrome.tabs.query({ url }, function(tabs) {
    tabs.length > 0 && tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { action, dados });
    });
  });
}

export function openOrReloadWhatsAppTab() {
  chrome.tabs.query({ url: WHATSAPP_URL }, function(tabs) {
    tabs.length > 0 && tabs[0].id !== void 0
      ? chrome.tabs.reload(tabs[0].id)
      : chrome.tabs.create({ url: "https://web.whatsapp.com" });
  });
}

export function openExtensionTab(featureFolder) {
  const url = chrome.runtime.getURL(`${featureFolder}/src/index.html`);
  chrome.tabs.query({ url }, function(tabs) {
    tabs.length > 0 && tabs.forEach((tab) => {
      tab.id !== void 0 && chrome.tabs.remove(tab.id);
    });
    chrome.tabs.create({ url });
  });
}

function handleWhatsAppTabUpdated(tabId, _changeInfo, tab) {
  tab.url && whatsappTabs.set(tabId, tab.url);
}

function handleWhatsAppTabRemoved(tabId) {
  const url = whatsappTabs.get(tabId);
  whatsappTabs.delete(tabId);
  url && url.includes("https://web.whatsapp") && chrome.runtime.sendMessage({ action: "whatsIsClosed" });
}

export function ensureWhatsAppStatusListeners() {
  try {
    chrome.tabs.onUpdated.removeListener(handleWhatsAppTabUpdated);
    chrome.tabs.onRemoved.removeListener(handleWhatsAppTabRemoved);
  } catch (error) {
    console.error("erro ao remover os ouvintes do WhatsIsOpen", error);
  } finally {
    chrome.tabs.onUpdated.addListener(handleWhatsAppTabUpdated);
    chrome.tabs.onRemoved.addListener(handleWhatsAppTabRemoved);
  }
}

export { WHATSAPP_URL };
