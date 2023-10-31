interface Params {
  sec: number;
  totalPixels: number;
  totalSeconds: number;
}

export function secondsToPixels({ sec, totalPixels, totalSeconds }: Params) {
  return (sec * totalPixels) / totalSeconds;
}
