import { type Component, batch, For, createSignal } from "solid-js";

import styles from "./App.module.css";
import { createLocalStore } from "./store";
import { type Rule } from "./types";

const [rules, setRules] = await createLocalStore<Rule[]>("rules");

const RulesForm: Component = () => {
  let hostnameInput: HTMLInputElement;
  const [ruleType, setRuleType] = createSignal<Rule['type']>("replace");

  const addRule = (e: SubmitEvent) => {
    e.preventDefault();
    if (!e.target) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as unknown as Rule;
    batch(() => {
      setRules((oldRules) => [
        ...oldRules,
        {
          selector: data.selector,
          url: data.url,
          enabled: true,
          hostname: data.hostname,
          type: ruleType(),
        },
      ]);
    });
  };

  return (
    <form onSubmit={addRule}>
      <fieldset>
        <legend>Rule Type</legend>
        <fieldset class={styles.ruleTypeContainer}>
          <label>
            <input
              type="radio"
              name="rule-type"
              value="replace"
              checked={ruleType() === "replace"}
              onChange={() => setRuleType("replace")}
            />
            Replace
          </label>
          <label>
            <input
              type="radio"
              name="rule-type"
              value="inject"
              checked={ruleType() === "inject"}
              onChange={() => setRuleType("inject")}
            />
            Inject
          </label>
        </fieldset>
      </fieldset>

      <fieldset>
        {ruleType() === "replace" && (
          <label>
            Regex
            <input type="text" name="selector" id="selector" required />
          </label>
        )}
        <label>
          Target URL
          <input type="text" name="url" id="url" required />
        </label>
        <label>
          Target Hostname
          <fieldset role="group">
            <input
              ref={(el) => (hostnameInput = el)}
              type="text"
              name="hostname"
              id="hostname"
              required
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                chrome.tabs
                  .query({ active: true, currentWindow: true })
                  .then((tabs) => {
                    const currentTabUrl = tabs?.[0].url;
                    if (!currentTabUrl) return;

                    const currentTabHostname = new URL(currentTabUrl).hostname;
                    hostnameInput.value = currentTabHostname;
                  });
              }}
              class="secondary"
            >
              Current
            </button>
          </fieldset>
        </label>
      </fieldset>

      <button type="submit">Add rule</button>
    </form>
  );
};

const App: Component = () => {
  return (
    <main>
      <header class={styles.header}>
        <h3>BundleReplacer</h3>
      </header>
      <section style={{ padding: "5px" }}>
        <RulesForm />
        <For each={rules()}>
          {(rule, i) => (
            <article class={styles.ruleContainer}>
              <div class={styles.ruleOptions}>
                <div class={styles.ruleEnabled}>
                  <input
                    data-tooltip="Enable/disable"
                    type="checkbox"
                    onChange={(e) =>
                      setRules((old) => [
                        ...old.slice(0, i()),
                        { ...rule, enabled: e.currentTarget.checked },
                        ...old.slice(i() + 1),
                      ])
                    }
                    checked={rule.enabled}
                    name={`${i()}-enabled`}
                    id={`${i()}-enabled`}
                  />
                </div>
                <div class={styles.ruleDelete}>
                  <span
                    data-tooltip="Remove"
                    onClick={() => {
                      setRules((old) => [
                        ...old.slice(0, i()),
                        ...old.slice(i() + 1),
                      ]);
                    }}
                  >
                    🗑️
                  </span>
                </div>
              </div>
              {rule.selector && (
                <div class={styles.ruleSelector}>
                  <p>{rule.selector}</p>
                </div>
              )}
              <div class={styles.targetUrl}>
                <p>{rule.url}</p>
              </div>
              <div class={styles.targetHostname}>
                <p>{rule.hostname}</p>
              </div>
            </article>
          )}
        </For>
      </section>
    </main>
  );
};

export default App;
