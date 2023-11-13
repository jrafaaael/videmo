import { writable } from "svelte/store";
import { recording } from "../../../stores/recording.store";

function createEdits() {
  const { set, subscribe } = writable({
    startAt: 0,
    endAt: recording.get()?.duration ?? Infinity,
  });

  return {
    subscribe,
    set,
  };
}

export const edits = createEdits();
