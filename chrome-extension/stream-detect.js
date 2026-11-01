// Streaming/piracy sites change domains all the time, so during a block this reads the page itself
// (title, meta, headings, menu, embedded players). A hit is sent to the background, which blocks the domain by name from then on.
(function () {
  const F = window.FOCUS;
  if (F.isSafeHost(location.hostname)) return;
  let leaving = false;

  function page() {
    const meta = (n) => (document.querySelector(`meta[name="${n}"],meta[property="${n}"]`) || {}).content || '';
    const parts = [meta('description'), meta('keywords'), meta('og:site_name'), meta('og:title'),
      ...[...document.querySelectorAll('h1,h2,nav a,header a')].slice(0, 60).map((e) => e.textContent.trim())];
    return {
      title: document.title,
      text: parts.filter(Boolean).join(' | ').slice(0, 4000),
      frames: [...document.querySelectorAll('iframe[src]')].map((f) => f.src),
      bigVideo: [...document.querySelectorAll('video')].some((v) => v.clientWidth >= 480),
    };
  }

  async function check() {
    if (leaving) return;
    const store = await chrome.storage.local.get(null);
    if (!store.schedule || !F.computeState(store.schedule, store, new Date()).blocked) return;
    if (F.streamScore(page()) < F.STREAM_MIN) return;
    leaving = true;
    chrome.runtime.sendMessage({ type: 'stream-site', host: location.hostname });
    location.replace(chrome.runtime.getURL('blocked.html') + '?site=stream#' + location.href);
  }

  check();
  setTimeout(check, 3000); // players and menus often arrive after load
  setTimeout(check, 8000);
})();
