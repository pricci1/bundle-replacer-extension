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
                rule.type === "replace" &&
                rule.hostname === currentHostname &&
                rule.enabled &&
                rule.selector &&
                (node.src as string).match(rule.selector)
            );
            if (foundRule) {
              node.src = foundRule.url!;
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

  function injectRules(rules: Rule[]) {
    rules.forEach((rule) => {
      if (
        rule.type === "inject" &&
        rule.hostname === currentHostname &&
        rule.enabled &&
        rule.url
      ) {
        const script = document.createElement("script");
        script.src = rule.url;
        document.head.appendChild(script);
      }
    });
  }

  chrome.runtime.onMessage.addListener((request) => {
    if (!("rules" in request)) return;
    const rules = request.rules as Rule[];
    const allowedHostnames = rules.map((rule) => rule.hostname);
    if (!allowedHostnames.includes(currentHostname)) return;

    console.log("BundleReplacer loaded");

    replaceRules(rules);
    injectRules(rules);
  });

  chrome.runtime.sendMessage({ type: "getRules" });
})();
