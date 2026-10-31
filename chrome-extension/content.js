// YouTube is a single-page app: clicking a recommended video doesn't trigger a new page load,
// so the network rule can't see it. This checks the URL every 2s and on YouTube's own nav event.
(function () {
  const F = window.FOCUS;
  let leaving = false;
  async function check() {
    if (leaving) return;
    const store = await chrome.storage.local.get(null);
    if (!store.schedule) return;
    const state = F.computeState(store.schedule, store, new Date());
    if (state.blocked && !F.isAllowedYouTube(location.href)) {
      leaving = true;
      location.replace(chrome.runtime.getURL('blocked.html') + '?site=youtube#' + location.href);
    }
  }
  check();
  setInterval(check, 2000);
  document.addEventListener('yt-navigate-finish', check);
})();
