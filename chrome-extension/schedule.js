// Schedule editor. The extension can't write its own files, so saving goes through the
// native messaging host that pc-blocker\install.bat registers (pc-blocker\schedule-host.ps1).
const F = window.FOCUS;
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  kids.flat().forEach((k) => n.append(k instanceof Node ? k : document.createTextNode(k)));
  return n;
};
const HOST = 'com.ieltsfocus.schedule';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let current = null;

const readFile = async () => (await fetch('schedule.json', { cache: 'no-store' })).json();
const msg = (text, kind = '') => { $('msg').textContent = text; $('msg').className = kind; };

function blockRow(b) {
  const remove = el('button', { type: 'button' }, 'Remove');
  const row = el('div', { className: 'block' },
    el('div', { className: 'row' },
      el('input', { type: 'text', className: 'name', value: b.label || '', maxLength: 60, ariaLabel: 'Block name' }), remove),
    el('div', { className: 'pills' }, DAYS.map((d) =>
      el('label', { className: 'pill' }, el('input', { type: 'checkbox', value: d, checked: (b.days || []).includes(d) }), d))),
    el('div', { className: 'row' }, el('span', { className: 'lab' }, 'Time'),
      el('input', { type: 'time', className: 'start', value: b.start || '', ariaLabel: 'Start time' }), 'to',
      el('input', { type: 'time', className: 'end', value: b.end || '', ariaLabel: 'End time' })),
    el('div', { className: 'row' }, el('span', { className: 'lab' }, 'Dates'),
      el('input', { type: 'date', className: 'from', value: b.from || '', ariaLabel: 'First day' }), 'to',
      el('input', { type: 'date', className: 'until', value: b.until || '', ariaLabel: 'Last day' }),
      el('span', { className: 'muted small' }, 'optional')));
  remove.onclick = () => row.remove();
  return row;
}

function render(s) {
  $('from').value = s.activeFrom;
  $('until').value = s.activeUntil;
  $('blocks').replaceChildren(...s.blocks.map(blockRow));
  const free = (s.games && s.games.freeAfter) || {};
  $('free').replaceChildren(...DAYS.map((d) => el('label', {}, d, el('input', { type: 'time', id: 'free-' + d, value: free[d] || '00:00' }))));
  $('curfew').value = (s.games && s.games.curfew) || '';
  $('cal-url').value = (s.calendar && s.calendar.url) || '';
  $('cal-prefix').value = s.calendar ? (s.calendar.prefix || '') : 'IELTS';
  renderCal(s);
}

// Sync status, written into schedule.json by the PC app
function renderCal(s) {
  const c = s.calendar, badge = $('cal-badge'), list = $('cal-list');
  const synced = !!(c && c.url && c.syncedAt);
  const fmt = (k) => new Date(k + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  list.hidden = true;
  $('paused').hidden = !synced;
  $('weekly').classList.toggle('paused', synced);
  if (!(c && c.url)) { badge.textContent = 'Not connected'; badge.className = 'badge'; $('cal-status').textContent = 'Using the weekly blocks below.'; return; }
  if (c.error) {
    badge.textContent = 'Sync failed'; badge.className = 'badge err';
    $('cal-status').textContent = c.error + (synced ? ' Using the events from the last good sync.' : ' The weekly blocks apply until it works.');
  } else if (!synced) {
    badge.textContent = 'Connecting'; badge.className = 'badge';
    $('cal-status').textContent = 'Saved. The PC app fetches your calendar within a minute (it needs to be running).';
    return;
  } else { badge.textContent = 'Connected'; badge.className = 'badge on'; }
  if (!synced) return;
  const today = F.ymd(new Date());
  const next = (c.events || []).filter((e) => e.date >= today).slice(0, 5);
  if (!c.error) $('cal-status').textContent = `Synced ${F.hm(new Date(c.syncedAt))}: ${(c.events || []).length} study events in the next 3 weeks.` + (next.length ? ' Coming up:' : '');
  list.replaceChildren(...next.map((e) => el('li', {}, el('span', { className: 'num' }, fmt(e.date)), el('span', { className: 'num' }, `${e.start} – ${e.end}`), el('span', {}, e.label))));
  list.hidden = !next.length;
}

function read() {
  const blocks = [...document.querySelectorAll('.block')].map((r) => {
    const b = {
      label: r.querySelector('.name').value.trim(),
      days: [...r.querySelectorAll('.pills input:checked')].map((i) => i.value),
      start: r.querySelector('.start').value,
      end: r.querySelector('.end').value,
    };
    if (r.querySelector('.from').value) b.from = r.querySelector('.from').value;
    if (r.querySelector('.until').value) b.until = r.querySelector('.until').value;
    return b;
  });
  const freeAfter = Object.fromEntries(DAYS.map((d) => [d, $('free-' + d).value]));
  return { activeFrom: $('from').value, activeUntil: $('until').value, blocks, games: { freeAfter, curfew: $('curfew').value || null },
    calendar: { url: $('cal-url').value.trim(), prefix: $('cal-prefix').value.trim() } };
}

// No moving the goalposts mid-block: saving waits until the block is over.
function updateLock() {
  const b = current && F.activeBlock(current, new Date());
  $('save').disabled = !!b;
  if (b) msg(`Locked during ${b.label} (until ${b.end}). You can save after the block.`, 'lock');
  else if ($('msg').className === 'lock') msg('');
}

$('add').onclick = () => {
  const row = blockRow({ label: 'New block', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '18:00', end: '19:00' });
  $('blocks').append(row);
  row.querySelector('.name').select();
};

$('cancel').onclick = () => { location.href = 'newtab.html'; };

$('save').onclick = async () => {
  updateLock();
  if ($('save').disabled) return;
  msg('Saving…');
  let res;
  try {
    res = await chrome.runtime.sendNativeMessage(HOST, { schedule: read() });
  } catch (e) {
    msg(`Can’t reach the desktop helper (${e.message}). Run pc-blocker\\install.bat once, then try again.`, 'err');
    return;
  }
  if (!res || !res.ok) { msg((res && res.error) || 'Could not save.', 'err'); return; }
  current = await readFile();
  await chrome.storage.local.set({ schedule: current });
  render(current);
  msg('Saved. Blocking uses it now; the game blocker picks it up within 10 seconds.', 'ok');
};

(async () => {
  try { current = await readFile(); } catch { current = (await chrome.storage.local.get('schedule')).schedule; }
  render(current);
  updateLock();
  setInterval(async () => {
    updateLock();
    try { const f = await readFile(); if (JSON.stringify(f.calendar) !== JSON.stringify(current.calendar)) { current.calendar = f.calendar; renderCal(current); } } catch {}
  }, 15000);
})();
