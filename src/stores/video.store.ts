import { atom } from "nanostores";

interface Video {
  blobUrl: string;
  id: string;
  estimatedDuration: number;
}

export const video = atom<Video | null>(null);
