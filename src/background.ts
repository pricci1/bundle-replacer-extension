chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === "getRules" && sender.tab?.id) {
      chrome.storage.local.get("rules").then((rules) => {
        chrome.tabs.sendMessage(sender.tab!.id!, { rules });
      });

    return true;
  }
});
