import { createEffect, createSignal, type Signal } from "solid-js";

export async function createLocalStore<T extends object>(
  name: string
): Promise<Signal<T>> {
  const { rules } = await chrome.storage.local.get(name);
  const [state, setState] = createSignal<T>(rules || []);

  createEffect(() => {
    (async () => {
      await chrome.storage.local.set({ [name]: state() });
    })();
  });

  return [state, setState];
}
