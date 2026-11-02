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

- **Study blocks:** YouTube, YouTube Music, anime/manga sites (official and pirate: hianime, 9anime, gogoanime, animepahe, mangadex, …) and movie/TV streaming sites redirect to a "Not now" page; games close (with a 5-minute warning first).
  Streaming and piracy sites are caught three ways, since their domains keep changing: by name (`fmovies`, `dulo`, `yts`, `…movies…`, `…flix…`), by the video hosts their players come from (vidsrc, megacloud, streamtape, …), and by reading the page during a block (`stream-detect.js`: "watch free movies", episode lists, embedded players). A domain caught by its page is remembered and blocked by name after that. The page reader is only injected while a block is on, so normal browsing carries no extension script.
- **Earn mode** (on by default): outside blocks, those sites stay locked until you tick today's main task.
- **Games** stay closed until the daily unlock time (`games.freeAfter`, `00:00` = only during study blocks) and close again at the curfew (`games.curfew`) until 06:00. A curfew before 06:00, like `01:30`, counts as the end of the previous night. `games.curfewDays` (e.g. `["Mon","Tue","Wed","Thu","Fri"]`) limits it to those nights; leave it out for every night. A night without a curfew stays free until 06:00.
- **Emergency pass:** 10 minutes for sites, 15 for games, once a day, and you have to type a sentence.

## Changing the schedule

Two editors, same file: the new tab's **Edit schedule** page (needs the PC installer run once, it saves through native messaging) or the game blocker's dashboard. You can change the plan dates, study blocks, game unlock times and the curfew. Changes apply within 30 seconds, and saving is locked while a block is running.

The day-by-day study plan (tasks, video and PDF links) lives in `chrome-extension/plan.js`. It's my IELTS + dMAT plan; replace it with your own. Days with several parts (mock tests, reading + writing days) show one tickable row per part, each with its own links.

## Practice tests

`chrome-extension/practice/` holds original IELTS Academic practice material, linked from the plan days that use it:

- **Reading Tests 1–8** (`reading.html?n=1…8`): 3 passages, 40 questions in the current question types, a 60-minute timer, and marking with the official raw-score-to-band table. Passages are shorter than the real exam (about 450–550 words, the real ones run 700–900), so real tests feel longer.
- **Listening Tests 1–8** (`listening.html?n=1…8`): 4 parts, 40 questions, read aloud with the usual reading pauses, marked with the Listening band table, transcripts after you submit. In Microsoft Edge each part gets its own cast of Edge's natural voices (British, Australian, New Zealand, Canadian, Irish and American, 16 speakers across the tests, needs internet). Other browsers fall back to their built-in voices, which sound robotic. The recordings are shorter than the real exam (about 8–11 minutes of speech).
- **Speaking sets 1–36** (`speaking.html?n=1…36`): sets 1–4 are the evening mocks, and every morning from 2 Nov to 3 Dec links its own set (5–36). The examiner's voice asks Part 1 and Part 3 questions one at a time, and Part 2 has the 1-minute prep and 2-minute talk timer. **Start recording** saves the audio for playback and download, and the browser's speech-to-text writes each answer under its question and times it. If speech-to-text isn't available, dictate with Win+H or type. **Rate my speaking** estimates Fluency, Lexical Resource and Grammar bands from speed, answer length, word variety, linking clauses, tenses and common errors (including Indian English ones like "cousin brother" and "pass out of college"). It can't hear pronunciation, so it's an estimate: **Copy for Claude to mark** builds an examiner prompt with every question and timed answer.
- **Writing Task 1 sets 1–7 and Task 2 sets 1–11** (`writing.html?task=1|2&n=…`): charts and tables drawn on the page, a 20/40-minute timer and autosave. **Check my writing** flags word count, missing overview or position, repeated words, common learner errors, informal words and mechanical linkers. It isn't a band score: **Copy for Claude to mark** builds a full examiner prompt, and **Save to a file** puts the task and your answer in Downloads.

`chrome-extension/material/` (git-ignored) holds local files the plan links to: the official band descriptor PDFs and the two listening mocks.

## Google Calendar

With `GOOGLE_CALENDAR_ICS_URL` set, the PC app fetches the calendar every 10 minutes and writes the next 3 weeks of matching events into `schedule.json`. Only timed events whose title starts with the filter (default `IELTS`, comma-separated for several) count, and they replace the weekly blocks. Sync needs the PC app running.

## Phone

The extension and blocker can't reach your phone. Use Android Digital Wellbeing → Focus mode or iPhone Screen Time with the same times.

`phone-blocker/` is a separate Android app (Lock In Food) that blocks food-delivery apps and junk food in grocery carts. It runs as device owner, so read its `README.txt` before installing: once locked, it can't be uninstalled until its end date.

## Honest note

Anything you install you can also uninstall. This adds friction; it can't make the choice for you.
