const F = window.FOCUS;
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  kids.flat().forEach((k) => k !== '' && k != null && n.append(k instanceof Node ? k : document.createTextNode(k)));
  return n;
};
const fmtDate = (key) => new Date(key + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const PLAN_DAYS = Object.keys(F.PLAN);
const isMockDay = (k) => F.PLAN[k] && /MOCK #|DIAGNOSTIC/.test(F.PLAN[k].main);

let store = {};

async function load() {
  store = await chrome.storage.local.get(null);
  store.done = store.done || {};
  store.mocks = store.mocks || [];
  store.settings = Object.assign({ earnMode: true, testDate: '2026-12-05' }, store.settings || {});
  render();
}

function render() {
  const now = new Date();
  const today = F.ymd(now);
  const schedule = store.schedule;
  const plan = F.PLAN[today];

  // countdown + plan progress
  const days = Math.round((new Date(store.settings.testDate + 'T00:00:00') - new Date(today + 'T00:00:00')) / 864e5);
  $('countdown').textContent = days > 0 ? days : days === 0 ? '0' : '✓';
  $('countlabel').textContent = days > 1 ? 'days to test day' : days === 1 ? 'day. Test is tomorrow' : days === 0 ? 'Test day. Go get it.' : 'Test done';
  $('testdate').textContent = fmtDate(store.settings.testDate);
  $('clock').textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dayNo = PLAN_DAYS.indexOf(today) + 1;
  const past = PLAN_DAYS.filter((k) => k <= today).length;
  $('planbar').style.width = (past / PLAN_DAYS.length * 100) + '%';
  $('planmeter').setAttribute('aria-valuenow', past);
  $('planmeter').setAttribute('aria-valuemax', PLAN_DAYS.length);
  $('planday').textContent = dayNo ? `Day ${dayNo} of ${PLAN_DAYS.length}` : today < PLAN_DAYS[0] ? `Plan starts ${fmtDate(PLAN_DAYS[0])}` : 'Plan complete';
  $('weekname').textContent = plan ? `Week ${plan.week} · ${F.WEEK_TITLES[plan.week]}` : '';

  renderStatus(schedule, now);

  // today
  const tasks = $('tasks'); tasks.replaceChildren();
  $('weekno').textContent = fmtDate(today);
  if (plan) {
    $('weektitle').textContent = 'Today';
    const d = store.done[today] || {};
    tasks.append(taskRow('main', 'Main task', plan.main, !!d.main, plan.v || [], plan.l || []));
    (plan.steps || []).forEach((st, i) => tasks.append(taskRow('s' + i, st.at, st.t, !!d['s' + i], st.v || [], st.l || [])));
    if (!plan.noLock && plan.am !== false) tasks.append(taskRow('am', 'Morning · 10:00', F.MORNING, !!d.am, []));
  } else {
    $('weektitle').textContent = 'No plan task today';
    tasks.append(el('p', { className: 'empty' }, today < PLAN_DAYS[0] ? 'Your six-week plan starts soon. Book the test first.' : 'Plan complete. Well done.'));
  }

  // stats
  const doneCount = PLAN_DAYS.filter((k) => store.done[k] && store.done[k].main).length;
  const streak = F.streak(store, now);
  $('streak').textContent = streak;
  $('streak-side').textContent = streak ? 'Keep it going' : 'Tick today to start';
  $('progress').replaceChildren(String(doneCount), el('small', {}, `/${PLAN_DAYS.length}`));
  $('progressbar').style.width = (doneCount / PLAN_DAYS.length * 100) + '%';
  const missed = PLAN_DAYS.filter((k) => k < today && !(store.done[k] && store.done[k].main)).length;
  $('progress-side').textContent = missed ? `${missed} missed` : 'None missed';
  const last = store.mocks[store.mocks.length - 1];
  $('lastmock').textContent = last ? F.ieltsOverall(last.l, last.r, last.w, last.s).toFixed(1) : '–';
  $('lastmock-side').textContent = last ? fmtDate(last.date) : 'Diagnostic: Sun 1 Nov';

  renderWeeks(today);
  renderMocks();

  $('earn').checked = !!store.settings.earnMode;
  $('tdate').value = store.settings.testDate;
}

function renderStatus(schedule, now) {
  const st = schedule ? F.computeState(schedule, store, now) : null;
  const box = $('status');
  const set = (state, label, title, detail) => {
    box.dataset.state = state;
    $('st-state').textContent = label;
    $('st-state').classList.toggle('pulse', state === 'block');
    $('st-title').textContent = title;
    $('st-detail').textContent = detail;
  };
  $('st-prog').hidden = true;
  if (!st) set('off', 'Loading', 'Reading your schedule…', '');
  else if (st.block && !st.pass) {
    const b = st.block, span = b.endAt - b.startAt;
    set('block', 'Study block', b.label, `YouTube, anime, streaming sites and games are blocked until ${b.end}. Plan videos still open.`);
    $('st-bar').style.width = Math.min(100, (now - b.startAt) / span * 100) + '%';
    $('st-span').textContent = `${b.start} – ${b.end}`;
    $('st-left').textContent = `${Math.ceil((b.endAt - now) / 60000)} min left`;
    $('st-prog').hidden = false;
  } else if (st.lockedFreeTime && !st.pass) {
    set('lock', 'Earn mode', 'Tick today’s main task to unlock free time', 'YouTube, anime and streaming sites stay locked until it’s done.');
  } else if (st.active) {
    set('free', st.pass ? 'Emergency pass' : 'Free time', st.pass ? 'Emergency pass active' : 'Free time. You earned it.', 'Nothing is blocked right now.');
  } else {
    set('off', 'Off', F.ymd(now) < schedule.activeFrom ? `Plan starts ${fmtDate(schedule.activeFrom)}` : 'Plan finished', 'Blocking is off outside the study plan.');
  }
  $('st-next').textContent = st && st.next ? `Next block: ${st.next.label}, ${F.ymd(st.next.startAt) === st.today ? 'today' : fmtDate(F.ymd(st.next.startAt))} ${st.next.start}–${st.next.end}` : '';
  const c = schedule && schedule.calendar;
  $('st-cal').textContent = !schedule ? '' : !(c && c.url) ? 'Weekly blocks. Connect Google Calendar under Schedule.'
    : c.error ? 'Google Calendar sync failed. Open Schedule for details.'
    : c.syncedAt ? `Blocks from Google Calendar · synced ${F.hm(new Date(c.syncedAt))}` : 'Connecting to Google Calendar…';
}

function renderWeeks(today) {
  const box = $('weeks'); box.replaceChildren(el('span'));
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d) => box.append(el('span', { className: 'h' }, d)));
  const first = new Date(PLAN_DAYS[0] + 'T00:00:00');
  let d = F.addDays(first, -((first.getDay() + 6) % 7));
  const lastKey = PLAN_DAYS[PLAN_DAYS.length - 1];
  for (let w = 1; F.ymd(d) <= lastKey; w++) {
    box.append(el('span', { className: 'w' }, 'W' + w));
    for (let i = 0; i < 7; i++, d = F.addDays(d, 1)) {
      const k = F.ymd(d), p = F.PLAN[k];
      const done = store.done[k] && store.done[k].main;
      const test = k === store.settings.testDate;
      const cls = ['cell', !p && !test ? 'none' : done ? 'done' : k < today ? 'miss' : '', k === today ? 'today' : '', test ? 'test' : isMockDay(k) ? 'mock' : ''];
      const tag = test ? 'Test' : isMockDay(k) ? 'Mock' : k === today ? 'Today' : done ? '✓' : '';
      box.append(el('div', { className: cls.join(' '), title: p ? `${fmtDate(k)}: ${p.main}` : fmtDate(k) }, String(d.getDate()), el('span', { className: 'tag' }, tag)));
    }
  }
}

function renderMocks() {
  const box = $('mocks'); box.replaceChildren();
  if (!store.mocks.length) { box.append(el('p', { className: 'empty' }, 'No mocks yet. Your cold diagnostic is on Sun 1 Nov. Add the four band scores here afterwards.')); return; }
  [...store.mocks].map((m, i) => [m, i]).reverse().forEach(([m, i]) => {
    const o = F.ieltsOverall(m.l, m.r, m.w, m.s);
    const ok = o >= 7.5 && Math.min(m.l, m.r, m.w, m.s) >= 7;
    const band = (name, v) => el('div', { className: 'band' + (v < 7 ? ' low' : '') }, name, el('b', {}, v.toFixed(1)),
      el('div', { className: 'track' }, Object.assign(el('i'), { style: `width:${v / 9 * 100}%` })));
    const del = el('button', { className: 'quiet', title: 'Remove this mock', ariaLabel: 'Remove mock from ' + fmtDate(m.date) }, 'Remove');
    del.onclick = () => { store.mocks.splice(i, 1); chrome.storage.local.set({ mocks: store.mocks }); };
    box.append(el('div', { className: 'mrow' },
      el('span', { className: 'date small muted' }, fmtDate(m.date)),
      el('div', { className: 'bands' }, band('Listening', m.l), band('Reading', m.r), band('Writing', m.w), band('Speaking', m.s)),
      el('div', { className: 'overall' }, o.toFixed(1), el('small', { className: ok ? 'ok' : 'no' }, ok ? 'On target' : 'Below 7.5 / 7.0')),
      del));
  });
}

function taskRow(key, label, text, checked, vids, links = []) {
  const id = 'chk-' + key;
  const box = el('input', { type: 'checkbox', className: 'check', id, checked });
  box.onchange = () => {
    const today = F.ymd(new Date());
    store.done[today] = Object.assign({}, store.done[today], { [key]: box.checked });
    const steps = (F.PLAN[today] && F.PLAN[today].steps) || [];
    if (key[0] === 's' && steps.length && steps.every((_, i) => store.done[today]['s' + i])) store.done[today].main = true;
    chrome.storage.local.set({ done: store.done });
  };
  const chips = vids.length || links.length ? el('div', { className: 'chips' }, [
    ...vids.map((n) => el('a', { className: 'chip', href: F.videoUrl(n) }, `#${n} ${F.VIDEOS[n][1]}`)),
    ...links.map((k) => el('a', { className: 'chip', href: F.LINKS[k][1] }, F.LINKS[k][0])),
  ]) : '';
  return el('div', { className: `task ${key === 'main' ? 'main' : ''} ${checked ? 'done' : ''}` }, box,
    el('div', {}, el('label', { htmlFor: id }, el('span', { className: 'eyebrow' + (key === 'main' ? ' red' : '') + ' lab' }, label), el('span', { className: 'txt' }, text)), chips));
}

$('mockform').onsubmit = (e) => {
  e.preventDefault();
  const v = (id) => parseFloat($(id).value);
  store.mocks.push({ date: $('m-date').value, l: v('m-l'), r: v('m-r'), w: v('m-w'), s: v('m-s') });
  store.mocks.sort((a, b) => a.date.localeCompare(b.date));
  chrome.storage.local.set({ mocks: store.mocks });
  e.target.reset(); $('m-date').value = F.ymd(new Date());
};
$('earn').onchange = () => chrome.storage.local.set({ settings: Object.assign({}, store.settings, { earnMode: $('earn').checked }) });
$('tdate').onchange = () => $('tdate').value && chrome.storage.local.set({ settings: Object.assign({}, store.settings, { testDate: $('tdate').value }) });

$('m-date').value = F.ymd(new Date());
chrome.storage.onChanged.addListener(load);
setInterval(render, 30000);
load();

