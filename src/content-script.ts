import type { Rule } from "./types";

(async () => {
  const currentHostname = document.location.hostname;
  function replaceRules(rules: Rule[]) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if ("tagName" in node && node.tagName === "SCRIPT" && "src" in node) {
            const foundRule = rules.find(
              (rule) =>
                rule.hostname === currentHostname &&
                rule.enabled &&
                (node.src as string).match(rule.selector)
            );
            if (foundRule) {
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
    const rules = request.rules as Rule[];
    const allowedHostnames = rules.map((rule) => rule.hostname);
    if (!allowedHostnames.includes(currentHostname)) return;

    console.log("BundleReplacer loaded");

    replaceRules(rules);
  });

  chrome.runtime.sendMessage({ type: "getRules" });
})();
