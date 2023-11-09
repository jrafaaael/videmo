import { atom } from "nanostores";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export const ffmpeg = atom(new FFmpeg());
