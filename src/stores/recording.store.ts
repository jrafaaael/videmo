import { atom } from "nanostores";

interface Recording {
  blobUrl: string;
  id: string;
  duration: number;
}

export const recording = atom<Recording | null>(null);
