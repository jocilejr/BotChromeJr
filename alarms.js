import { config } from "./config.js";
import { sendMessageToUrl, WHATSAPP_URL } from "./tabs.js";

function getStorageValue(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function(data) {
      data[key] === void 0 ? reject() : resolve(data[key]);
    });
  });
}

function hasNotificationTimedOut(dateString) {
  const targetDate = new Date(dateString);
  const currentDate = /* @__PURE__ */ new Date();
  const diff = targetDate.getTime() - currentDate.getTime();
  return diff <= 12e4 || diff < 0;
}

async function updateNotifications() {
  const notifications = await getStorageValue("notifications");
  const updatedNotifications = [];
  const dispatchableNotifications = [];
  let unreadCount = 0;
  for (let notification of notifications)
    !notification.timeOut && hasNotificationTimedOut(`${notification.date}T${notification.time}`) && (notification.timeOut = !0, dispatchableNotifications.push(notification)), notification.timeOut && !notification.read && unreadCount++, updatedNotifications.push(notification);
  sendMessageToUrl(WHATSAPP_URL, "Update_Notificação", {
    update: updatedNotifications,
    dispart: dispatchableNotifications,
    tam: unreadCount
  });
}

async function fetchDomSelectorVersion() {
  try {
    const response = await fetch(config.domSelector);
    const payload = await response.json();
    typeof payload == "object" && typeof payload.version == "string" && sendMessageToUrl(WHATSAPP_URL, "Update_DomSelector", { version: payload.version });
  } catch (error) {
    console.error("Error ao tentar Capturar o Dom Selector virtual", error);
  }
}

export function ensureRecurringAlarms() {
  chrome.alarms.get("One_Minute", (alarm) => {
    alarm || chrome.alarms.create("One_Minute", { periodInMinutes: 1 });
  });
  chrome.alarms.get("Five_Minutes", (alarm) => {
    alarm || chrome.alarms.create("Five_Minutes", { periodInMinutes: 5 });
  });
  chrome.alarms.get("Ten_Minutes", (alarm) => {
    alarm || chrome.alarms.create("Ten_Minutes", { periodInMinutes: 10 });
  });
  chrome.alarms.get("Thirty_Minutes", (alarm) => {
    alarm || chrome.alarms.create("Thirty_Minutes", { periodInMinutes: 30 });
  });
}

function onAlarmTriggered(alarm) {
  switch (alarm.name) {
    case "One_Minute":
      sendMessageToUrl(WHATSAPP_URL, "Update_Agendamento", {});
      sendMessageToUrl(WHATSAPP_URL, "Update_Status", {});
      sendMessageToUrl(WHATSAPP_URL, "Update_BackupAutomatico", {});
      sendMessageToUrl(WHATSAPP_URL, "Update_MeetAoVivo", {});
      updateNotifications();
      break;
    case "Five_Minutes":
      sendMessageToUrl(WHATSAPP_URL, "license_update", {});
      sendMessageToUrl(WHATSAPP_URL, "dispatch_timing_follow", {});
      break;
    case "Ten_Minutes":
      fetchDomSelectorVersion();
      break;
    case "Thirty_Minutes":
      sendMessageToUrl(WHATSAPP_URL, "Remote-Notificacao", {});
      break;
    case "keepAwake":
      chrome.runtime.getPlatformInfo();
      break;
  }
}

export function registerAlarmHandlers() {
  chrome.alarms.onAlarm.addListener(onAlarmTriggered);
}
