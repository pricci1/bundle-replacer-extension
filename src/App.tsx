import { type Component, batch, For } from "solid-js";

import styles from "./App.module.css";
import { createLocalStore } from "./store";
import { type Rule } from "./types";

const [rules, setRules] = await createLocalStore<Rule[]>("rules");

const RulesForm: Component = () => {
  const addRule = (e: SubmitEvent) => {
    e.preventDefault();
    if (!e.target) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as unknown as Rule;
    batch(() => {
      setRules((oldRules) => [
        ...oldRules,
        { selector: data.selector, url: data.url, enabled: true },
      ]);
    });
  };
  return (
    <form onSubmit={addRule}>
      <input
        type="text"
        name="selector"
        id="selector"
        placeholder="target script includes"
        required
      />
      <input
        type="text"
        name="url"
        id="url"
        placeholder="target url"
        required
      />
      <button>+</button>
    </form>
  );
};

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h3>Mockdule Federation</h3>
      </header>
      <div>
        <RulesForm />
        <For each={rules()}>
          {(rule, i) => (
            <div>
              <input
                type="checkbox"
                onChange={(e) =>
                  setRules((old) => [
                    ...old.slice(0, i()),
                    { ...rule, enabled: e.currentTarget.checked },
                    ...old.slice(i() + 1),
                  ])
                }
                checked={rule.enabled}
                name={`${i}-enabled`}
                id={`${i}-enabled`}
              />
              <p>{rule.selector}</p>
              <p>{rule.url}</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default App;
