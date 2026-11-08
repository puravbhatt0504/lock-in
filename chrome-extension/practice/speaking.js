// Speaking tests (sets in speak-sets.js). The examiner's voice asks, you answer out loud. While recording, the browser's speech-to-text
// writes each answer under its question and each answer is timed; speak-review.js then estimates the bands.
const SETS = window.SPEAK_SETS;
const N = Math.min(Math.max(+new URLSearchParams(location.search).get('n') || 1, 1), SETS.length);
const SET = SETS[N - 1];
const KEY = 'ielts-speaking-' + N;
const CARD = SET.card.join(' ');
let S = {};
try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
S.p1 = S.p1 || []; S.p3 = S.p3 || []; S.p2 = S.p2 || { q: CARD, text: '', secs: 0 };
S.pf = S.pf || { q: SET.follow, text: '', secs: 0 };   // the examiner's one-question follow-up after Part 2
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
document.title = `Speaking set ${N} · IELTS practice`;
$('title').textContent = `Speaking set ${N}`;
$('pick').innerHTML = `<select aria-label="Speaking set">${SETS.map((_, i) => `<option value="${i + 1}"${i + 1 === N ? ' selected' : ''}>Set ${i + 1}</option>`).join('')}</select>`;
$('pick').onchange = (e) => { location.search = '?n=' + e.target.value; };
const [task, ...rest] = SET.card;
$('card').innerHTML = `<p><b>${task}</b></p><p>You should say:</p><ul>${rest.slice(0, -1).map((p) => `<li>${p}</li>`).join('')}</ul><p>${rest[rest.length - 1]}</p>`;

// The examiner's voice: one natural British voice per set in Edge, else any English voice.
const synth = window.speechSynthesis;
let talking = false, quietUntil = 0, utter = null, examiner = '';   // utter: keeps the utterance alive, or Chromium may drop it and never fire onend
// Edge lists its robotic desktop voices at once and the natural ones a moment later: wait for those (other browsers: any voices).
const voicesReady = new Promise((res) => {
  if (!synth) return res();
  const edge = /Edg\//.test(navigator.userAgent), t0 = Date.now();
  const t = setInterval(() => {
    const v = synth.getVoices();
    if ((edge ? v.some((x) => /natural/i.test(x.name)) : v.length) || Date.now() - t0 > 5000) { clearInterval(t); res(); }
  }, 100);
});
const say = (text) => new Promise(async (res) => {
  if (!synth) return res();
  talking = true; examiner = text;
  await voicesReady;
  synth.cancel();
  const en = synth.getVoices().filter((v) => /^en/i.test(v.lang)), name = ['Ryan', 'Sonia', 'Thomas', 'Libby'][(N - 1) % 4];
  const nat = en.filter((x) => /natural/i.test(x.name) && !/maisie/i.test(x.name));
  const v = nat.find((x) => x.name.includes(` ${name} `)) || nat.find((x) => /en-GB/i.test(x.lang)) || nat[0] || en.find((x) => /en-GB/i.test(x.lang)) || en[0];
  const u = utter = new SpeechSynthesisUtterance(text);
  if (v) { u.voice = v; u.lang = v.lang; }
  let quiet = 0, w = 0, done = false;
  const end = () => { if (done) return; done = true; clearInterval(w); if (utter === u) { talking = false; quietUntil = Date.now() + 700; } res(); };
  u.rate = 0.95; u.onend = u.onerror = end;
  synth.speak(u);
  // Backup for when onend never fires: carry on once the voice has been silent for a second.
  w = setInterval(() => { quiet = synth.speaking || synth.pending ? 0 : quiet + 1; if (quiet >= 4) end(); }, 250);
});

/* ---------- answers: one box per question, filled by speech-to-text, Win+H dictation or typing ---------- */
let recording = false;
let cur = null;                                        // the answer being spoken: { part, i, t0 }
const slot = (c) => (Array.isArray(S[c.part]) ? S[c.part][c.i] : S[c.part]);
const boxFor = (c) => document.querySelector(`textarea[data-part="${c.part}"][data-i="${c.i}"]`);
function tally() { if (cur && cur.t0) { const a = slot(cur); a.secs = (a.secs || 0) + (Date.now() - cur.t0) / 1000; cur.t0 = 0; save(); } }
let last = null, lastUntil = 0;                         // the answer just closed: words still being recognised belong to it
// Words shown as "Hearing:" but not final yet. If the recogniser never finalises them (it stops, or the next question starts), they are kept as heard.
let pending = '', pendingTo = null;
function keep(to, t) { const a = slot(to); a.text = (a.text ? a.text + ' ' : '') + t; save(); const b = boxFor(to); if (b) b.value = a.text; }
function flush() { if (pending && pendingTo) keep(pendingTo, pending); pending = ''; pendingTo = null; }
// ponytail: a final that arrives after this 1.2 s wait into the next answer repeats those words; rare, and a repeat beats a lost sentence.
function closeAnswer() {
  tally();
  if (cur) { const c = last = cur; lastUntil = Date.now() + 1200; setTimeout(() => { if (pendingTo === c) flush(); }, 1200); }
  cur = null;
}
// In the moment after the examiner stops, text made mostly of the question's words is their voice; anything else is you starting to answer.
function isEcho(t) {
  if (Date.now() >= quietUntil) return false;
  const q = new Set(SpeakReview.words(examiner)), w = SpeakReview.words(t);
  return w.filter((x) => q.has(x)).length * 2 > w.length;
}
function openAnswer(part, i) { closeAnswer(); cur = { part, i, t0: recording ? Date.now() : 0 }; }
function box(part, i) {
  const a = slot({ part, i });
  const t = Object.assign(document.createElement('textarea'), { className: 'ans', value: a.text || '', spellcheck: false,
    placeholder: 'Your answer is written here while you record. Or press Win+H to dictate, or type it.' });
  t.dataset.part = part; t.dataset.i = i;
  t.oninput = () => { a.text = t.value; save(); };
  return t;
}
function addQ(part, i, now) {
  const li = document.createElement('li');
  li.className = now ? 'now' : 'done';
  li.append(document.createTextNode(S[part][i].q), box(part, i));
  $(part).append(li);
}
// Questions stay hidden until asked, as in the real test.
function asker(part, list, btn) {
  const finish = () => { $(btn).disabled = true; $(btn).textContent = 'Part finished'; };
  S[part].forEach((_, i) => addQ(part, i, false));
  if (S[part].length >= list.length) finish();
  $(btn).onclick = async () => {
    if (!recording) startRec(); else reviveSR();
    const i = S[part].length;
    [...$(part).children].forEach((li) => { li.className = 'done'; });
    closeAnswer();
    if (i >= list.length) return finish();
    S[part].push({ q: list[i], text: '', secs: 0 }); save();
    addQ(part, i, true);
    $(btn).disabled = true;                              // a second click would cut the examiner off and skip a question
    await say(list[i]);
    $(btn).disabled = false;
    openAnswer(part, i);
  };
}
asker('p1', SET.p1, 'ask1');
asker('p3', SET.p3, 'ask3');
$('p2box').append(box('p2', 0));
function showFollow() {
  $('follow').innerHTML = `Examiner’s follow-up: <i>${SET.follow}</i>`;
  if (!boxFor({ part: 'pf', i: 0 })) $('follow').after(box('pf', 0));
}
if (S.pf.text) showFollow();

function beep() {
  try { const c = new AudioContext(), o = c.createOscillator(); o.connect(c.destination); o.frequency.value = 880; o.start(); o.stop(c.currentTime + 0.4); } catch (e) {}
}
function countdown(secs, label) {
  return new Promise((res) => {
    const end = Date.now() + secs * 1000;
    const t = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      $('clock').textContent = `${label} ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
      if (!left) { clearInterval(t); beep(); res(); }
    }, 250);
  });
}
$('prep').onclick = async () => {
  if (!recording) startRec(); else reviveSR();
  closeAnswer();
  $('prep').disabled = true;
  await say('Here is your topic. You have one minute to prepare. You can make some notes.');
  $('status').textContent = 'Make notes: one or two words per point.';
  await countdown(60, 'Prepare');
  await say('Please start speaking now. Talk for up to two minutes.');
  $('status').textContent = 'Keep talking until the beep. Cover every point on the card.';
  S.p2.q = CARD; S.p2.secs = 0; save();
  openAnswer('p2', 0);
  await countdown(120, 'Talk');
  closeAnswer();
  $('clock').textContent = '';
  $('status').textContent = 'Time.';
  showFollow();
  await say('Thank you. ' + SET.follow);
  $('status').textContent = 'Answer the follow-up in a sentence or two, then go on to Part 3.';
  openAnswer('pf', 0);                                  // stays open until the first Part 3 question
};

/* ---------- recording: audio to play back + speech-to-text into the answer boxes ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, mr = null, retries = 0, srLive = false, retryT = 0;
const LIVE = 'Recording. Answers appear under each question.';
// Speech-to-text died: stop the answer clock (dead time would count as silence and pull the speech rate down),
// then keep bringing it back by itself; only after several failures in a row ask for a click.
function srDown(why) {
  const r = rec; rec = null; srLive = false; tally(); flush();
  if (r) { try { r.abort(); } catch (x) {} }
  clearTimeout(retryT);
  if (!recording) return;
  if (retries >= 6) return paused(why);
  $('recstat').textContent = 'Speech-to-text dropped out: reconnecting…';
  retryT = setTimeout(() => { if (recording && !rec) startSR(); }, 400 * ++retries);
}
// Edge sometimes accepts start() and then never starts: treat that as a failure too.
const watch = (me) => setTimeout(() => { if (rec === me && !srLive && recording) srDown('stuck'); }, 3000);
// Edge ends speech-to-text after pauses and won't always restart it without a click, so every click
// (next question, Part 2 start, or anywhere on the page) brings it back if it has stopped.
function reviveSR() {
  if (!recording || !SR || (rec && srLive)) return;
  if (rec) { const r = rec; rec = null; try { r.abort(); } catch (x) {} }
  retries = 0; startSR();
  $('recstat').textContent = LIVE;
}
document.addEventListener('pointerdown', reviveSR);
async function startRec() {
  recording = true; retries = 0;
  if (SR) startSR();                                   // Edge only allows speech-to-text to start straight from the click
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch (e) { stopRec(); $('recstat').textContent = 'Microphone blocked. Allow it from the address bar, then press Start recording again.'; return; }
  if (SR && !rec) { retries = 0; startSR(); }          // refused while the microphone prompt was open: the permission is settled now
  if (cur) cur.t0 = Date.now();
  $('rec').textContent = 'Stop recording'; $('rec').classList.add('on');
  const chunks = [];
  mr = new MediaRecorder(stream);
  mr.ondataavailable = (e) => chunks.push(e.data);
  mr.onstop = () => {
    stream.getTracks().forEach((t) => t.stop());
    const url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType }));
    $('audio').src = url; $('audio').hidden = false;
    Object.assign($('dl'), { href: url, download: `ielts-speaking-set${N}-${new Date().toISOString().slice(0, 10)}.webm`, hidden: false });
  };
  mr.start();
  if (!SR) $('recstat').textContent = 'Recording audio. This browser can’t write down speech: click in an answer box and press Win+H to dictate.';
  else if (rec) $('recstat').textContent = 'Recording. Answers appear under each question.';
}
function startSR() {
  clearTimeout(retryT);
  rec = new SR();
  rec.lang = 'en-IN'; rec.interimResults = true;   // Indian English: fewer misheard words for an Indian accent
  // Android Chrome repeats earlier words in each result in continuous mode, so there it takes one phrase at a time (onend restarts it).
  rec.continuous = !/Android/i.test(navigator.userAgent);
  rec.onresult = (e) => {
    let interim = '';
    for (let k = e.resultIndex; k < e.results.length; k++) {
      const r = e.results[k], t = r[0].transcript.trim();
      if (!r.isFinal) { interim += t + ' '; continue; }
      // Into the open answer, or the one just closed if these are its last words; never the examiner's voice.
      const to = cur && !talking && !isEcho(t) ? cur : Date.now() < lastUntil ? last : null;
      if (to === pendingTo) pending = '';
      if (t && to) keep(to, t);
    }
    if (cur && !talking && !isEcho(interim)) { pending = interim.trim(); pendingTo = cur; }
    $('heard').textContent = interim && cur ? 'Hearing: ' + interim : '';
  };
  const me = rec;
  rec.onstart = () => {
    if (rec !== me) return;
    srLive = true; retries = 0;
    if (recording && cur && !cur.t0) cur.t0 = Date.now();   // back after a drop-out: the answer clock runs again
    $('recstat').textContent = LIVE;
  };
  // Errors (network, the microphone prompt still open, …) are retried; no-speech and aborted just end it, and onend restarts it.
  rec.onerror = (e) => { if (rec === me && e.error !== 'no-speech' && e.error !== 'aborted') srDown(e.error); };
  rec.onend = () => {                                   // it stops by itself after silence: start it again
    if (rec && rec !== me) return;
    flush();
    if (rec !== me) return;
    srLive = false;
    if (!recording) return;
    try { me.start(); watch(me); } catch (x) { srDown('stopped'); }
  };
  try { rec.start(); watch(me); } catch (x) { srDown('could not start'); }
}
function paused(why) {
  if (recording) $('recstat').textContent = `Speech-to-text paused (${why}). Audio is still recording. Click anywhere on the page, or ask the next question, and it starts again.`;
}
function stopRec() {
  recording = false;
  tally();
  const r = rec; rec = null; srLive = false; if (r) r.stop();
  if (mr && mr.state !== 'inactive') mr.stop();
  $('rec').textContent = 'Start recording'; $('rec').classList.remove('on');
  $('heard').textContent = '';
  $('recstat').textContent = 'Stopped. Play it back below, check the answer boxes, then press Rate my speaking.';
}
$('rec').onclick = () => (recording ? stopRec() : startRec());

/* ---------- review ---------- */
const input = () => ({ p1: S.p1, p2: Object.assign({}, S.p2, { q: CARD }), p3: S.p3 });
$('rate').onclick = () => {
  if (recording) stopRec();
  const r = SpeakReview.rate(input());
  const notes = `<ul class="fb">${r.notes.map(([c, m]) => `<li class="${c}">${m}</li>`).join('')}</ul>`;
  if (r.overall === null) { $('review').innerHTML = notes; return; }
  S.result = { date: new Date().toISOString().slice(0, 10), fc: r.fc, lr: r.lr, gra: r.gra, overall: r.overall }; save();
  $('review').innerHTML = `<h3>Estimated bands</h3>
    <table class="res"><tr><td>Fluency and Coherence</td><td><b>${r.fc}</b></td></tr><tr><td>Lexical Resource</td><td><b>${r.lr}</b></td></tr>
    <tr><td>Grammatical Range and Accuracy</td><td><b>${r.gra}</b></td></tr><tr><td>Pronunciation</td><td class="muted">not rated from text: play your recording and check it against the descriptors</td></tr></table>
    <div class="score">About Band ${r.overall.toFixed(1)} overall</div>
    <p class="muted">The overall averages the three criteria above; your Pronunciation band moves it up or down. ${r.n} words${r.wpm ? `, ${Math.round(r.wpm)} words a minute` : ''}.</p>
    ${notes}
    <p class="muted">This is an estimate from your transcript: speed, answer length, word variety, linking clauses, tenses and common errors. For an examiner-style band per criterion with every mistake corrected, press <b>Copy for Claude to mark</b> and paste it into a chat with Claude.</p>`;
};
const forMarking = () => {
  const a = (x) => `A (${SpeakReview.words(x.text).length} words${x.secs ? `, ${Math.round(x.secs)} s` : ''}): ${x.text || '(no answer)'}`;
  return `Please mark my IELTS Speaking test like an examiner, using the official band descriptors (Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation). This is a speech-to-text transcript with answer times, so judge Pronunciation only from clues such as words the recogniser clearly misheard, and say how sure you are. Give a band for each criterion and an overall band, list every grammar and vocabulary mistake with the correction, point out answers that were too short or off topic, then give a Band 8 version of my Part 2 answer and of my weakest Part 3 answer, and the 3 changes that would raise my score most.

SPEAKING SET ${N}

PART 1
${S.p1.map((x) => `Q: ${x.q}\n${a(x)}`).join('\n\n')}

PART 2
Cue card: ${task} You should say: ${rest.slice(0, -1).join('; ')}; ${rest[rest.length - 1]}
${a(S.p2)}${S.pf.text ? `
Examiner’s follow-up: ${S.pf.q}
${a(S.pf)}` : ''}

PART 3
${S.p3.map((x) => `Q: ${x.q}\n${a(x)}`).join('\n\n')}`;
};
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(forMarking()); $('msg').textContent = 'Copied. Paste it into a chat with Claude.'; }
  catch (e) { $('msg').textContent = 'Copy failed. Use Save to a file instead.'; }
};
$('save').onclick = () => {
  const el = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([forMarking()], { type: 'text/plain' })),
    download: `ielts-speaking-set${N}-${new Date().toISOString().slice(0, 10)}.txt`,
  });
  el.click(); setTimeout(() => URL.revokeObjectURL(el.href), 1000);
  $('msg').textContent = 'Saved to your Downloads folder.';
};
$('reset').onclick = () => { if (confirm('Clear your answers for this set and start again?')) { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); } };
