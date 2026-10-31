importScripts('plan.js');
const F = self.FOCUS;
const BLOCKED_PAGE = chrome.runtime.getURL('blocked.html');

// Read on every tick: the Edit schedule page or the game blocker's editor may have changed the file.
async function loadSchedule(current) {
  const schedule = await (await fetch(chrome.runtime.getURL('schedule.json'), { cache: 'no-store' })).json();
  if (JSON.stringify(schedule) !== JSON.stringify(current)) await chrome.storage.local.set({ schedule });
  return schedule;
}

let lastBlocked = null;

async function refresh() {
  const store = await chrome.storage.local.get(null);
  const schedule = await loadSchedule(store.schedule).catch(() => store.schedule);
  const state = F.computeState(schedule, store, new Date());

  if (state.blocked !== lastBlocked) {
    try {
      const existing = await chrome.declarativeNetRequest.getDynamicRules();
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existing.map((r) => r.id),
        addRules: state.blocked ? F.dnrRules(BLOCKED_PAGE) : [],
      });
      lastBlocked = state.blocked;
    } catch (e) {
      console.error('IELTS Focus: could not update block rules', e); // tab sweep below still enforces
    }
  }

  // Tabs already open on a blocked site get redirected too (DNR only catches new navigations).
  if (state.blocked) {
    const tabs = await chrome.tabs.query({});
    for (const t of tabs) {
      if (!t.url) continue;
      const site = F.isAnime(t.url) ? 'anime' : (F.isYouTube(t.url) && !F.isAllowedYouTube(t.url)) ? 'youtube' : null;
      if (site) chrome.tabs.update(t.id, { url: `${BLOCKED_PAGE}?site=${site}#${t.url}` });
    }
  }
}

function ensureAlarm() { chrome.alarms.create('tick', { periodInMinutes: 0.5 }); }

chrome.runtime.onInstalled.addListener(async () => {
  await loadSchedule(); // pick up schedule.json edits on every reload
  const { settings } = await chrome.storage.local.get('settings');
  if (!settings) await chrome.storage.local.set({ settings: { earnMode: true, testDate: '2026-12-05' } });
  ensureAlarm();
  lastBlocked = null;
  refresh();
});
chrome.runtime.onStartup.addListener(() => { ensureAlarm(); lastBlocked = null; refresh(); });
chrome.alarms.onAlarm.addListener(refresh);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && (changes.done || changes.pass || changes.settings)) refresh();
});
ensureAlarm();
refresh();
