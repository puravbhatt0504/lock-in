const F = window.FOCUS;
const $ = (id) => document.getElementById(id);
const PHRASE = 'I will make up these 10 minutes tonight';
const params = new URLSearchParams(location.search);
const rawOriginal = location.hash.slice(1);
const original = /^https?:\/\//i.test(rawOriginal) ? rawOriginal : '';
document.getElementById('typed').addEventListener('paste', (e) => e.preventDefault()); // type it, don't paste it

$('site').textContent = params.get('site') === 'anime' ? 'Anime sites blocked' : 'YouTube blocked';
$('phrase').textContent = PHRASE;

(async () => {
  const store = await chrome.storage.local.get(null);
  const now = new Date();
  const st = store.schedule ? F.computeState(store.schedule, store, now) : null;

  if (st && !st.blocked && original) { location.replace(original); return; } // block ended; send them back

  $('why').textContent = !st ? '' : st.block
    ? `${st.block.label} until ${st.block.end}. Back to it.`
    : st.lockedFreeTime ? 'Free time unlocks once today’s main task is ticked in your tracker.' : '';
  if (st && st.block) {
    const b = st.block;
    $('bar').style.width = Math.min(100, (now - b.startAt) / (b.endAt - b.startAt) * 100) + '%';
    $('span').textContent = `${b.start} – ${b.end}`;
    $('mins').textContent = `${Math.ceil((b.endAt - now) / 60000)} min left`;
    $('left').hidden = false;
  }

  const plan = F.PLAN[F.ymd(now)];
  $('task').textContent = plan ? plan.main : 'No plan task today.';
  (plan && plan.v || []).forEach((n) => {
    const a = Object.assign(document.createElement('a'), { className: 'chip', href: F.videoUrl(n), textContent: `#${n} ${F.VIDEOS[n][1]}` });
    $('vids').append(a);
  });
  (plan && plan.l || []).forEach((k) => {
    $('vids').append(Object.assign(document.createElement('a'), { className: 'chip', href: F.LINKS[k][1], textContent: F.LINKS[k][0] }));
  });

  const today = F.ymd(now);
  if (store.pass && store.pass.date === today) {
    $('typed').disabled = true; $('go').disabled = true;
    $('passmsg').textContent = 'Today’s pass is already used.';
  }
  $('go').onclick = async () => {
    if ($('typed').value.trim() !== PHRASE) { $('passmsg').textContent = 'Doesn’t match. Type it exactly.'; return; }
    await chrome.storage.local.set({ pass: { date: today, until: Date.now() + 10 * 60 * 1000 } });
    $('passmsg').textContent = 'Unlocked for 10 minutes.';
    setTimeout(() => { if (original) location.replace(original); }, 800);
  };
})();

// Pages can't follow file:// links; the tabs API can, once "Allow access to file URLs" is on.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="file:"]');
  if (!a) return;
  e.preventDefault();
  chrome.tabs.update({ url: a.href }).catch(() => alert('To open the mocks: chrome://extensions → IELTS Focus → Details → turn on "Allow access to file URLs".'));
});
