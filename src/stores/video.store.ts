import { atom } from "nanostores";

interface Video {
  blobUrl: string;
  id: string;
}

export const video = atom<Video | null>(null);
