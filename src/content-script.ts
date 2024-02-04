import type { Rule } from "./types";

(async () => {
  console.log("Loaded");

  function replaceRules(rules: Rule[]) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (('tagName' in node) && node.tagName === "SCRIPT" && "src" in node) {
            const foundRule = rules.find((rule) =>
              (node.src as string).match(rule.selector)
            );
            if (foundRule && foundRule.enabled) {
              node.src = foundRule.url;
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  chrome.runtime.onMessage.addListener((request) => {
    if (!("rules" in request)) return;

    replaceRules(request.rules);
  });

  chrome.runtime.sendMessage({ type: "getRules" });
})();
