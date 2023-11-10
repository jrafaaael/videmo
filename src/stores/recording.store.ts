import { atom } from "nanostores";
import type { Recording } from "../types/recording";

export const recording = atom<Recording | null>(null);
