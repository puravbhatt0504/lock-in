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
let talking = false, quietUntil = 0;
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
  talking = true;
  await voicesReady;
  synth.cancel();
  const en = synth.getVoices().filter((v) => /^en/i.test(v.lang)), name = ['Ryan', 'Sonia', 'Thomas', 'Libby'][(N - 1) % 4];
  const nat = en.filter((x) => /natural/i.test(x.name) && !/maisie/i.test(x.name));
  const v = nat.find((x) => x.name.includes(` ${name} `)) || nat.find((x) => /en-GB/i.test(x.lang)) || nat[0] || en.find((x) => /en-GB/i.test(x.lang)) || en[0];
  const u = new SpeechSynthesisUtterance(text);
  if (v) { u.voice = v; u.lang = v.lang; }
  u.rate = 0.95; u.onend = u.onerror = () => { talking = false; quietUntil = Date.now() + 700; res(); };
  synth.speak(u);
});

/* ---------- answers: one box per question, filled by speech-to-text, Win+H dictation or typing ---------- */
let recording = false;
let cur = null;                                        // the answer being spoken: { part, i, t0 }
const slot = (c) => (c.part === 'p2' ? S.p2 : S[c.part][c.i]);
const boxFor = (c) => document.querySelector(`textarea[data-part="${c.part}"][data-i="${c.part === 'p2' ? 0 : c.i}"]`);
function tally() { if (cur && cur.t0) { const a = slot(cur); a.secs = (a.secs || 0) + (Date.now() - cur.t0) / 1000; cur.t0 = 0; save(); } }
function closeAnswer() { tally(); cur = null; }
function openAnswer(part, i) { closeAnswer(); cur = { part, i, t0: recording ? Date.now() : 0 }; }
function box(part, i) {
  const a = part === 'p2' ? S.p2 : S[part][i];
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
    const i = S[part].length;
    [...$(part).children].forEach((li) => { li.className = 'done'; });
    closeAnswer();
    if (i >= list.length) return finish();
    S[part].push({ q: list[i], text: '', secs: 0 }); save();
    addQ(part, i, true);
    await say(list[i]);
    openAnswer(part, i);
  };
}
asker('p1', SET.p1, 'ask1');
asker('p3', SET.p3, 'ask3');
$('p2box').append(box('p2', 0));

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
  $('follow').innerHTML = `Examiner’s follow-up: <i>${SET.follow}</i>`;
  await say('Thank you. ' + SET.follow);
};

/* ---------- recording: audio to play back + speech-to-text into the answer boxes ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, mr = null, retries = 0;
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
  rec = new SR();
  rec.lang = 'en-GB'; rec.continuous = true; rec.interimResults = true;
  rec.onresult = (e) => {
    let interim = '';
    for (let k = e.resultIndex; k < e.results.length; k++) {
      const r = e.results[k], t = r[0].transcript.trim();
      if (!r.isFinal) { interim += t + ' '; continue; }
      if (!t || !cur || talking || Date.now() < quietUntil) continue;   // skip the examiner's voice and talk between questions
      const a = slot(cur);
      a.text = (a.text ? a.text + ' ' : '') + t; save();
      const b = boxFor(cur); if (b) b.value = a.text;
    }
    $('heard').textContent = interim && cur ? 'Hearing: ' + interim : '';
  };
  rec.onerror = (e) => {
    if (e.error === 'no-speech' || e.error === 'aborted') return;
    rec = null;
    // Starting together with the microphone permission prompt can fail once: try again when the permission has settled.
    if (e.error === 'not-allowed' && recording && retries++ < 2) return setTimeout(() => { if (recording && !rec) { startSR(); $('recstat').textContent = 'Recording. Answers appear under each question.'; } }, 800);
    $('recstat').textContent = `Speech-to-text isn’t working right now (${e.error}). Audio is still recording. Press Stop and Start recording again, or click in an answer box and press Win+H to dictate.`;
  };
  rec.onend = () => { if (recording && rec) try { rec.start(); } catch (x) {} };   // it stops by itself after silence
  rec.start();
}
function stopRec() {
  recording = false;
  tally();
  const r = rec; rec = null; if (r) r.stop();
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
${a(S.p2)}

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
