// Practice Listening tests (data in listen-*.js), read aloud by the browser's speech voices like the mocks in material/.
// Script lines: ['N' | 'W' | 'M', text] = narrator / woman / man; ['P', seconds, label] = reading pause.
const TESTS = window.LTESTS;
const N = Math.min(Math.max(+new URLSearchParams(location.search).get('n') || 1, 1), TESTS.length);
const T = TESTS[N - 1];
const KEY = 'ielts-practice-l' + N;
let S = {};
try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
S.a = S.a || {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
document.title = `Listening Test ${N} · IELTS practice`;
$('title').textContent = `Listening Test ${N}`;
$('pick').innerHTML = TESTS.map((_, i) => `<button data-n="${i + 1}" aria-selected="${i + 1 === N}">${i + 1}</button>`).join(' ');
$('pick').onclick = (e) => { if (e.target.dataset.n) location.search = '?n=' + e.target.dataset.n; };

function renderGroup(g) {
  let h = `<div class="grp"><div class="t">${g.t}</div><div class="i">${g.i}</div>`;
  if (g.box) h += `<div class="box">${g.box}</div>`;
  if (g.head) h += `<div style="font-weight:700;margin:6px 0">${g.head}</div>`;
  for (const it of g.items) {
    const [n, prompt] = it, id = 'L' + n, v = S.a[id] || '';
    h += `<div class="q" id="q-${id}"><span class="n">${n}</span>`;
    if (Array.isArray(it[2])) {            // gap fill
      const [pre, post] = prompt.split('___');
      h += `${esc(pre)}<input type="text" data-q="${id}" value="${esc(v)}" autocomplete="off" spellcheck="false" aria-label="Answer ${n}">${esc(post || '')}`;
    } else if (g.sel) {                    // pick from a list
      h += `${esc(prompt)} <select data-q="${id}" aria-label="Answer ${n}"><option value=""></option>${g.sel.map((o) => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    } else {                               // multiple choice
      h += `${esc(prompt)}<div class="opts">${it[3].map((o, k) => { const L = 'ABCD'[k]; return `<label><input type="radio" name="${id}" data-q="${id}" value="${L}"${v === L ? ' checked' : ''}> <b>${L}</b>&nbsp; ${esc(o)}</label>`; }).join('')}</div>`;
    }
    h += `<span class="key"></span></div>`;
  }
  return h + '</div>';
}
$('body').innerHTML = T.map((p, k) => `<h3>Part ${k + 1}</h3>${p.groups.map(renderGroup).join('')}`).join('');
const keep = (e) => { const q = e.target.dataset && e.target.dataset.q; if (q) { S.a[q] = e.target.value; save(); } };
document.addEventListener('input', keep);
document.addEventListener('change', keep);

// Usual published Academic/General Listening raw score → band table.
const norm = (s) => String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/^£/, '').replace(/\s+/g, ' ').trim().replace(/[.,]$/, '');
const BANDS = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]];
const band = (raw) => BANDS.find(([min]) => raw >= min)[1];

function mark() {
  let raw = 0;
  const miss = [];
  T.forEach((p, k) => p.groups.forEach((g) => g.items.forEach((it) => {
    const id = 'L' + it[0], given = S.a[id] || '';
    const keys = Array.isArray(it[2]) ? it[2] : [it[2]];
    const ok = keys.some((x) => norm(x) === norm(given));
    raw += ok;
    if (!ok) miss.push(k);
    const row = $('q-' + id);
    row.classList.remove('ok', 'bad'); row.classList.add(ok ? 'ok' : 'bad');
    row.querySelector('.key').textContent = ok ? '✓' : `✗  answer: ${keys[0]}`;
  })));
  document.querySelectorAll('[data-q]').forEach((el) => { el.disabled = true; });
  const per = T.map((_, k) => miss.filter((m) => m === k).length);
  $('score').innerHTML = `<div class="score">${raw} / 40 correct · Band ${band(raw).toFixed(1)}</div>
    <p class="muted">Missed per part: ${per.map((m, k) => `P${k + 1} ${m}`).join(' · ')}. Band 7 needs 30, Band 7.5 needs 32.
    Read the transcript below and find where each red answer was said. Note whether you missed it, misspelt it or broke the word limit.</p>`;
  $('scripts').innerHTML = '<h3>Transcripts</h3>' + T.map((p, k) => `<details><summary>Part ${k + 1}</summary><div class="script">${
    p.script.filter((l) => l[0] !== 'P').map(([w, t]) => `<p><span class="who">${{ N: '', W: 'Woman:', M: 'Man:' }[w]}</span>${esc(t)}</p>`).join('')}</div></details>`).join('');
  S.done = true; S.raw = raw; save();
}

/* ---------- audio (built-in speech voices) ---------- */
const synth = window.speechSynthesis;
let playing = false;
const FEMALE = /female|zira|hazel|susan|libby|sonia|maisie|mia|emma|aria|jenny|natasha|clara|catherine|karen|moira|tessa|samantha|serena|kate|fiona|heera|neerja|linda|eva/i;
function pickVoices() {
  const en = synth.getVoices().filter((v) => /^en/i.test(v.lang));
  const nat = (list) => list.filter((v) => /natural/i.test(v.name) && !/maisie/i.test(v.name));
  const pref = (list) => nat(list).find((v) => /en-GB/i.test(v.lang)) || nat(list)[0] || list.find((v) => /en-GB/i.test(v.lang)) || list[0];
  const fem = en.filter((v) => FEMALE.test(v.name)), mal = en.filter((v) => !FEMALE.test(v.name));
  const W = pref(fem) || pref(en), M = pref(mal) || pref(en);
  return { W, M, N: en.find((v) => v !== W && v !== M) || M || W };
}
// Edge's natural voices, cast per part with the IELTS mix of accents. Other browsers fall back to pickVoices().
const CAST = { GB: [['Sonia'], ['Ryan', 'Thomas']], AU: [['Natasha'], ['William']], NZ: [['Molly'], ['Mitchell']],
  CA: [['Clara'], ['Liam']], IE: [['Emily'], ['Connor']], US: [['Jenny', 'Aria', 'Emma'], ['Guy', 'Andrew', 'Brian']] };
const MIX = ['GB', 'AU', 'GB', 'NZ', 'CA', 'GB', 'US', 'IE', 'GB', 'AU', 'NZ'];
const ACCENT = { GB: 'British', AU: 'Australian', NZ: 'New Zealand', CA: 'Canadian', IE: 'Irish', US: 'American' };
function castFor(p, base) {
  const natural = (name) => synth.getVoices().find((v) => v.name.includes(` ${name} `) && /natural/i.test(v.name));
  const one = (acc, sex) => { const pool = CAST[acc][sex], v = natural(pool[(N + p) % pool.length]); return v && { v, label: `${v.name.split(' ')[1]} (${ACCENT[acc]})` }; };
  const i = N * 4 + p, W = one(MIX[i % MIX.length], 0), M = one(MIX[(i + 3) % MIX.length], 1), Nr = natural('Libby');
  return { W: W ? W.v : base.W, M: M ? M.v : base.M, N: Nr || base.N, labels: { W: W && W.label, M: M && M.label } };
}
// Edge lists its robotic desktop voices at once and the natural ones a moment later: wait for those (other browsers: any voices).
const voicesReady = new Promise((res) => {
  if (!synth) return res();
  const edge = /Edg\//.test(navigator.userAgent), t0 = Date.now();
  const t = setInterval(() => {
    const v = synth.getVoices();
    if ((edge ? v.some((x) => /natural/i.test(x.name)) : v.length) || Date.now() - t0 > 5000) { clearInterval(t); res(); }
  }, 100);
});
const sayOne = (text, voice, rate) => new Promise((res) => {
  // Kept in window: Chromium can drop an unreferenced utterance and never fire onend.
  const u = window.__utter = new SpeechSynthesisUtterance(text);
  if (voice) { u.voice = voice; u.lang = voice.lang; }
  let quiet = 0, done = false, w = 0;
  const end = () => { if (done) return; done = true; clearInterval(w); res(); };
  u.rate = rate; u.onend = u.onerror = end;
  synth.speak(u);
  w = setInterval(() => { quiet = synth.speaking || synth.pending ? 0 : quiet + 1; if (quiet >= 4) end(); }, 250);   // backup if onend never fires
});
async function say(text, voice, rate) {
  // Chrome's Google voices cut off long utterances, so those go sentence by sentence; Edge's natural voices read whole lines.
  if (!voice || !/google/i.test(voice.name)) return sayOne(text, voice, rate);
  for (const s of text.match(/[^.!?]+[.!?]*/g) || [text]) { if (!playing) return; await sayOne(s.trim(), voice, rate); }
}
const wait = (secs, msg) => new Promise((res) => {
  const end = Date.now() + secs * 1000;
  const t = setInterval(() => {
    const left = Math.ceil((end - Date.now()) / 1000);
    if (left <= 0 || !playing) { clearInterval(t); return res(); }
    $('status').textContent = `${msg}: ${left}s`;
  }, 200);
});
async function playFrom(start) {
  if (!synth) { $('status').textContent = 'This browser has no built-in speech voices. Use Edge or Chrome.'; return; }
  await voicesReady;
  const rate = +$('rate').value;
  playing = true; $('play').disabled = true; $('stop').disabled = false;
  for (let p = start; p < T.length && playing; p++) {
    const V = castFor(p, pickVoices()), who2 = [...new Set(T[p].script.map((l) => l[0]))].filter((w) => V.labels[w]);
    const playingMsg = `Part ${p + 1} · playing${who2.length ? ' · ' + who2.map((w) => V.labels[w]).join(', ') : ' · open in Microsoft Edge for natural voices'}`;
    for (const [who, a, b] of T[p].script) {
      if (!playing) break;
      if (who === 'P') { await wait(a, `Part ${p + 1} · ${b}`); continue; }
      $('status').textContent = playingMsg;
      await say(a, V[who], rate);
    }
  }
  if (playing) $('status').textContent = 'Recording finished. Check your spelling, then submit.';
  playing = false; $('play').disabled = false; $('stop').disabled = true;
}
$('play').onclick = () => playFrom(+$('from').value);
$('stop').onclick = () => { playing = false; synth.cancel(); $('status').textContent = 'Stopped.'; };
$('submit').onclick = () => { if (S.done || confirm('Submit Listening? You can’t change answers afterwards.')) { playing = false; synth && synth.cancel(); mark(); } };
$('reset').onclick = () => { if (confirm('Clear every answer and the score for this test?')) { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); } };
if (S.done) mark();
