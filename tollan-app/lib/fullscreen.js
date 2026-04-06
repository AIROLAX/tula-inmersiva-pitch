/** API de pantalla completa con prefijos (Chrome, Safari, Firefox, Edge legacy) */
export function requestFullscreen(el) {
  if (!el) return Promise.reject(new Error("no element"));
  if (typeof el.requestFullscreen === "function") return el.requestFullscreen();
  if (typeof el.webkitRequestFullscreen === "function") return el.webkitRequestFullscreen();
  if (typeof el.mozRequestFullScreen === "function") return el.mozRequestFullScreen();
  if (typeof el.msRequestFullscreen === "function") return el.msRequestFullscreen();
  return Promise.reject(new Error("fullscreen not supported"));
}

export function exitFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
  if (document.msExitFullscreen) return document.msExitFullscreen();
  return Promise.reject(new Error("exit fullscreen not supported"));
}

export function isFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

/** iOS Safari: solo el elemento <video> puede ir a pantalla completa nativa */
export function enterVideoFullscreenNative(videoEl) {
  if (!videoEl) return false;
  if (typeof videoEl.webkitEnterFullscreen === "function") {
    videoEl.webkitEnterFullscreen();
    return true;
  }
  return false;
}
