/* Phone copy only (added by mobile/build.sh): a link back to the hub, and dictation hints that make sense off Windows. */
(() => {
  const windows = /Windows/.test(navigator.userAgent);
  const fix = (s) => s.replace(/press Win\+H to dictate/g, 'tap the mic key on your keyboard to dictate')
    .replace(/press Win\+H/g, 'tap the mic key on your keyboard').replace(/Win\+H/g, 'keyboard mic');
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
