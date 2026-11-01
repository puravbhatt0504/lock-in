// Practice Reading tests (data in tests-*.js). Same question format and marking as the mocks in material/.
const TESTS = window.TESTS;
const N = Math.min(Math.max(+new URLSearchParams(location.search).get('n') || 1, 1), TESTS.length);
const T = TESTS[N - 1];
const KEY = 'ielts-practice-r' + N;
let S = {};
try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
S.a = S.a || {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
document.title = `Reading Test ${N} · IELTS practice`;
$('title').textContent = `Reading Test ${N}`;
$('pick').innerHTML = TESTS.map((_, i) => `<button data-n="${i + 1}" aria-selected="${i + 1 === N}">${i + 1}</button>`).join(' ');
$('pick').onclick = (e) => { if (e.target.dataset.n) location.search = '?n=' + e.target.dataset.n; };

function renderGroup(g) {
  let h = `<div class="grp"><div class="t">${g.t}</div><div class="i">${g.i}</div>`;
  if (g.box) h += `<div class="box">${g.box}</div>`;
  if (g.head) h += `<div style="font-weight:700;margin:6px 0">${g.head}</div>`;
  for (const it of g.items) {
    const [n, prompt] = it, id = 'R' + n, v = S.a[id] || '';
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
$('body').innerHTML = T.map((p, k) => `<h3>Reading Passage ${k + 1} · ${p.title}</h3><p class="muted">${p.hint}</p><div class="split"><div class="passage">${
  p.text.map((t, j) => `<p>${p.letters ? `<b class="pl">${'ABCDEFGH'[j]}</b>` : ''}${esc(t)}</p>`).join('')}</div><div>${p.groups.map(renderGroup).join('')}</div></div>`).join('');
const keep = (e) => { const q = e.target.dataset && e.target.dataset.q; if (q) { S.a[q] = e.target.value; save(); } };
document.addEventListener('input', keep);
document.addEventListener('change', keep);

// Official Academic Reading raw score → band table.
const norm = (s) => String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.,]$/, '');
const BANDS = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]];
const band = (raw) => BANDS.find(([min]) => raw >= min)[1];

function mark() {
  let raw = 0;
  const miss = [];
  T.forEach((p, k) => p.groups.forEach((g) => g.items.forEach((it) => {
    const id = 'R' + it[0], given = S.a[id] || '';
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
    <p class="muted">Missed per passage: ${per.map((m, k) => `P${k + 1} ${m}`).join(' · ')}. Band 7 needs 30, Band 7.5 needs 33.
    For every red answer, find the sentence in the passage that proves the right one and note the question type in your mistakes log.</p>`;
  S.done = true; S.raw = raw; save();
}

let tick = null;
function countdown(secs) {
  const end = Date.now() + secs * 1000;
  const draw = () => {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    $('clock').textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    if (!left) { clearInterval(tick); mark(); }
  };
  draw(); tick = setInterval(draw, 1000);
}
$('start').onclick = () => { $('start').disabled = true; countdown(60 * 60); };
$('submit').onclick = () => { if (S.done || confirm('Submit Reading? You can’t change answers afterwards.')) { clearInterval(tick); $('clock').textContent = ''; mark(); } };
$('reset').onclick = () => { if (confirm('Clear every answer and the score for this test?')) { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); } };
if (S.done) mark();
