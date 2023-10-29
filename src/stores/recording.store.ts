import { atom } from "nanostores";

interface Recording {
  blobUrl: string;
  id: string;
  estimatedDuration: number;
}

export const recording = atom<Recording | null>(null);
