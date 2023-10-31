// Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
export default async function getBlobDuration(blob: string) {
  const tempVideo = document.createElement("video");

  const duration = new Promise((resolve) => {
    tempVideo.addEventListener("loadedmetadata", () => {
      if (tempVideo.duration === Infinity) {
        tempVideo.currentTime = Number.MAX_SAFE_INTEGER;
        tempVideo.ontimeupdate = () => {
          tempVideo.ontimeupdate = null;
          resolve(tempVideo.duration);
          tempVideo.currentTime = 0;
        };
      } else {
        resolve(tempVideo.duration);
      }
    });
  });

  tempVideo.preload = "metadata";
  tempVideo.src = blob;

  return await duration;
}
