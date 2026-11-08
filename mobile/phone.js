/* Phone copy only (added by mobile/build.sh): a link back to the hub, and dictation hints that make sense off Windows. */
(() => {
  const windows = /Windows/.test(navigator.userAgent);
  const fix = (s) => s.replace(/click in (an answer|a) box and press/g, 'tap in $1 box and press')
    .replace(/press (<b>)?Win\+H(<\/b>)?/g, 'tap the mic key on your keyboard').replace(/Win\+H/g, 'the keyboard mic');
  // Keep the screen on while a test is open: a sleeping phone stops the Listening audio and the Speaking examiner.
  let lock = null, asking = false;
  const awake = async () => {
    if (lock || asking || document.visibilityState !== 'visible' || !navigator.wakeLock) return;
    asking = true;
    try { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); } catch (e) {}
    asking = false;
  };
  document.addEventListener('visibilitychange', awake);
  addEventListener('pointerdown', awake);
  awake();
  addEventListener('DOMContentLoaded', () => {
    const h = document.querySelector('header');
    if (h) {
      const a = document.createElement('a');
      a.href = '../'; a.textContent = '← All tests'; a.style.cssText = 'font-size:14px;margin-right:12px';
      h.prepend(a);
    }
    if (windows) return;
    const sweep = () => {
      document.querySelectorAll('textarea[placeholder*="Win+H"]').forEach((t) => { t.placeholder = fix(t.placeholder); });
      document.querySelectorAll('#recstat, main p').forEach((p) => { if (p.textContent.includes('Win+H')) p.innerHTML = fix(p.innerHTML); });
    };
    sweep();
    new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
