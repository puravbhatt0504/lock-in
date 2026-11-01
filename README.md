# Lock In

A study lock-in kit for Windows + Chrome, built to get through IELTS and dMAT prep. One schedule drives everything:

- **Chrome extension:** blocks YouTube and anime sites during study blocks (plan videos stay open), and turns the new tab into a tracker: today's task with links, streak, week view, mock-score log with IELTS band rounding.
- **PC game blocker:** closes Valorant/Riot, Steam, Epic and anything installed through them during study blocks, before a daily unlock time, and after a late-night curfew. Tray icon + dashboard, written in PowerShell/WPF, no admin needed.
- **Google Calendar sync (optional):** plan study sessions as calendar events and the blocks follow them.

Both read `chrome-extension/schedule.json`, so the extension and the PC app always agree.

## Setup (about 5 minutes)

1. Clone the repo.
2. Copy `chrome-extension/schedule.example.json` to `chrome-extension/schedule.json` (the PC installer does this for you), then edit the dates and blocks, or use either editor later.
3. **Optional, Google Calendar:** copy `.env.example` to `.env` and paste your calendar's *Secret address in iCal format* (Google Calendar → Settings → your calendar → Integrate calendar). Never commit `.env`.
4. **Chrome extension:** `chrome://extensions` → Developer mode → **Load unpacked** → pick `chrome-extension`. Edge works the same way.
5. **PC game blocker:** double-click `pc-blocker/install.bat`. It starts now and at every login and lives in the tray. Remove it with `pc-blocker/uninstall.bat`.

## How blocking works

- **Study blocks:** YouTube, YouTube Music, anime and movie/TV streaming sites redirect to a "Not now" page; games close (with a 5-minute warning first).
  Streaming and piracy sites are caught three ways, since their domains keep changing: by name (`fmovies`, `dulo`, `yts`, `…movies…`, `…flix…`), by the video hosts their players come from (vidsrc, megacloud, streamtape, …), and by reading the page during a block (`stream-detect.js`: "watch free movies", episode lists, embedded players). A domain caught by its page is remembered and blocked by name after that.
- **Earn mode** (on by default): outside blocks, those sites stay locked until you tick today's main task.
- **Games** stay closed until the daily unlock time (`games.freeAfter`) and close again at the curfew (`games.curfew`). A curfew earlier than the unlock time, like `01:30`, counts as the end of the previous night. `games.curfewDays` (e.g. `["Mon","Tue","Wed","Thu","Fri"]`) limits it to those nights; leave it out for every night.
- **Emergency pass:** 10 minutes for sites, 15 for games, once a day, and you have to type a sentence.

## Changing the schedule

Two editors, same file: the new tab's **Edit schedule** page (needs the PC installer run once, it saves through native messaging) or the game blocker's dashboard. You can change the plan dates, study blocks, game unlock times and the curfew. Changes apply within 30 seconds, and saving is locked while a block is running.

The day-by-day study plan (tasks, video and PDF links) lives in `chrome-extension/plan.js`. It's my IELTS + dMAT plan; replace it with your own.

## Google Calendar

With `GOOGLE_CALENDAR_ICS_URL` set, the PC app fetches the calendar every 10 minutes and writes the next 3 weeks of matching events into `schedule.json`. Only timed events whose title starts with the filter (default `IELTS`, comma-separated for several) count, and they replace the weekly blocks. Sync needs the PC app running.

## Phone

The extension and blocker can't reach your phone. Use Android Digital Wellbeing → Focus mode or iPhone Screen Time with the same times.

`phone-blocker/` is a separate Android app (Lock In Food) that blocks food-delivery apps and junk food in grocery carts. It runs as device owner, so read its `README.txt` before installing: once locked, it can't be uninstalled until its end date.

## Honest note

Anything you install you can also uninstall. This adds friction; it can't make the choice for you.
