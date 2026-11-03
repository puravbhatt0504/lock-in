// One Writing task per page: ?task=1&n=3 or ?task=2&n=5. Timer, autosave, instant checks, copy for marking, save to file.
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const q = new URLSearchParams(location.search);
const TASK = q.get('task') === '2' ? 2 : 1;
const LIST = TASK === 1 ? window.TASK1 : window.TASK2;
const N = Math.min(Math.max(+q.get('n') || 1, 1), LIST.length);
const P = LIST[N - 1];
const MIN = TASK === 1 ? 150 : 250, MINS = TASK === 1 ? 20 : 40;
const KEY = `ielts-practice-w${TASK}-${N}`;

document.title = `Writing Task ${TASK} · set ${N}`;
$('title').textContent = `Writing Task ${TASK} · set ${N}`;
$('pick').innerHTML = [1, 2].map((t) => (t === 1 ? window.TASK1 : window.TASK2).map((_, i) =>
  `<button data-t="${t}" data-n="${i + 1}" aria-selected="${t === TASK && i + 1 === N}">${t === 1 ? 'T1' : 'T2'}·${i + 1}</button>`).join(' ')).join(' &nbsp; ');
$('pick').onclick = (e) => { if (e.target.dataset.n) location.search = `?task=${e.target.dataset.t}&n=${e.target.dataset.n}`; };
$('ttl').textContent = `Writing Task ${TASK} · spend about ${MINS} minutes`;
if (TASK === 1) {
  $('intro').textContent = P.intro;
  $('ask').textContent = `Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least ${MIN} words.`;
  $('chart').innerHTML = chart(P);
} else {
  $('intro').innerHTML = `<i>${esc(P)}</i>`;
  $('ask').textContent = `Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least ${MIN} words.`;
}

function chart(c) {
  const names = Object.keys(c.series), cols = ['var(--bar1)', 'var(--bar2)', 'var(--ok)', 'var(--soft)'];
  if (c.type === 'table') {
    return `<table class="res"><tr><td></td>${c.x.map((h) => `<td><b>${esc(h)}</b></td>`).join('')}</tr>${names.map((n) =>
      `<tr><td><b>${esc(n)}</b></td>${c.series[n].map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table><p class="muted">Units: ${esc(c.unit)}</p>`;
  }
  const W = 620, H = 330, L = 48, B = 260, all = names.flatMap((n) => c.series[n]);
  const step = Math.max(...all) > 100 ? 50 : 10, max = Math.ceil(Math.max(...all) / step) * step;
  const y = (v) => B - (v / max) * (B - 20);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" role="img" aria-label="${esc(c.intro)}">`;
  for (let v = 0; v <= max; v += step) s += `<line x1="${L}" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}" stroke="currentColor" opacity=".15"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  const gap = (W - L - 20) / c.x.length;
  if (c.type === 'bar') {
    const bw = Math.min(26, (gap - 12) / names.length);
    c.x.forEach((lab, i) => {
      const x0 = L + 10 + i * gap;
      names.forEach((n, j) => { const v = c.series[n][i], xx = x0 + j * (bw + 2);
        s += `<rect x="${xx}" y="${y(v)}" width="${bw}" height="${B - y(v)}" fill="${cols[j]}"/><text x="${xx + bw / 2}" y="${y(v) - 4}" text-anchor="middle" font-size="11">${v}</text>`; });
      s += `<text x="${x0 + (bw + 2) * names.length / 2}" y="${B + 18}" text-anchor="middle" font-size="12">${esc(lab)}</text>`;
    });
  } else {
    const px = (i) => L + 20 + i * gap;
    c.x.forEach((lab, i) => { s += `<text x="${px(i)}" y="${B + 18}" text-anchor="middle">${esc(lab)}</text>`; });
    names.forEach((n, j) => {
      s += `<polyline fill="none" stroke="${cols[j]}" stroke-width="2.5" points="${c.series[n].map((v, i) => `${px(i)},${y(v)}`).join(' ')}"/>`;
      c.series[n].forEach((v, i) => { s += `<circle cx="${px(i)}" cy="${y(v)}" r="3.5" fill="${cols[j]}"/>`; });
    });
  }
  names.forEach((n, j) => { s += `<rect x="${L + j * 150}" y="${H - 22}" width="12" height="12" fill="${cols[j]}"/><text x="${L + 18 + j * 150}" y="${H - 12}">${esc(n)}</text>`; });
  return s + `<text x="${W - 10}" y="14" text-anchor="end" opacity=".7">${esc(c.unit)}</text></svg>`;
}

/* ---------- draft, timer, word count ---------- */
const essay = $('essay');
try { essay.value = localStorage.getItem(KEY) || ''; } catch (e) {}
const words = (t) => (t.trim().match(/\S+/g) || []).length;
const wc = () => { const c = words(essay.value); $('wc').textContent = `${c} words${c < MIN ? ` · under ${MIN}, which costs marks` : ''}`; $('wc').className = 'wc' + (c < MIN ? ' low' : ''); };
essay.addEventListener('input', () => { try { localStorage.setItem(KEY, essay.value); } catch (e) {} wc(); });
wc();
let tick = null;
$('start').textContent = `Start the ${MINS}-minute timer`;
const store = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
const timer = (end) => {
  $('start').disabled = true;
  tick = setInterval(() => {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    $('clock').textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    if (!left) { clearInterval(tick); store(KEY + '-end', null); $('clock').textContent = 'Time'; essay.readOnly = true; review(); }
  }, 1000);
};
$('start').onclick = () => { const end = Date.now() + MINS * 60000; store(KEY + '-end', end); timer(end); };
let saved = null;
try { saved = +localStorage.getItem(KEY + '-end'); } catch (e) {}
if (saved > Date.now()) timer(saved);   // a reload keeps the clock running

/* ---------- instant checks (rough; a band score needs a marker) ---------- */
const STOP = new Set('about above after again against because been before being below between both could does doing during each from further have having here into itself more most other ought over same should some such than that their theirs them themselves then there these they this those through under until very were what when where which while whom will with would your also many much people however although while whereas'.split(' '));
const ERRORS = [
  [/\binformations\b/gi, 'information (uncountable)'], [/\badvices\b/gi, 'advice (uncountable)'], [/\bresearches\b/gi, 'research (uncountable)'],
  [/\bknowledges\b/gi, 'knowledge (uncountable)'], [/\bequipments\b/gi, 'equipment (uncountable)'], [/\bfurnitures\b/gi, 'furniture (uncountable)'],
  [/\bchilds\b/gi, 'children'], [/\bpeoples\b/gi, 'people (unless you mean nations)'], [/\bthe most of\b/gi, 'most of'],
  [/\baccording to me\b/gi, 'in my opinion / I believe'], [/\bmore (better|worse|easier|cheaper|bigger)\b/gi, 'drop "more" (already comparative)'],
  [/\bdiscuss about\b/gi, 'discuss (no "about")'], [/\bin nowadays\b/gi, 'nowadays'], [/\bsince \d+ (years|months|decades)\b/gi, 'for … years (since + a point in time)'],
  [/\bpeople (is|was|has)\b/gi, 'people are / were / have'], [/\bless (people|students|cars|jobs|houses)\b/gi, 'fewer (countable nouns)'],
  [/\bevery people\b/gi, 'everyone / all people'], [/\bcould of\b|\bwould of\b|\bshould of\b/gi, 'could / would / should have'],
  [/\bin the other hand\b/gi, 'on the other hand'], [/\bdespite of\b/gi, 'despite (or in spite of)'], [/\bbesides of\b/gi, 'besides'],
  [/\b(it|he|she|this|that) don't\b/gi, 'does not'], [/\bits (a|an|the|very|not|important|clear|true)\b/gi, "it is (its = belonging to it)"],
  [/\bin my opinion,? i think\b/gi, 'pick one: "In my opinion" or "I think"'],
  [/\balot\b/gi, 'a lot (better: many / much / a great deal of)'], [/\bmake a research\b|\bmade a research\b/gi, 'carry out / did research'],
  [/(^|[.!?]\s+)[a-z]/g, 'capital letter at the start of a sentence'], [/\si\s/g, '"I" is always a capital'], [/\s+[,.]/g, 'no space before a comma or full stop'],
];
const INFORMAL = /\b(can't|don't|doesn't|won't|isn't|aren't|it's|i'm|they're|we're|there's|wasn't|didn't|shouldn't|couldn't|wouldn't|haven't|kids|stuff|things|gonna|wanna|okay|ok|lots of|a lot of|pretty good|really)\b/gi;
const CLICHES = /\b(in this day and age|every coin has two sides|a hot topic|since time immemorial|in a nutshell|last but not least|it is a well-known fact|a double-edged sword)\b/gi;
const LINKERS = /\b(moreover|furthermore|additionally|in addition|firstly|secondly|thirdly)\b/gi;

function review() {
  const t = essay.value.trim(), out = [];
  const ok = (m) => out.push(['ok', m]), warn = (m) => out.push(['warn', m]);
  if (!t) { $('review').innerHTML = '<p class="muted">Write something first.</p>'; return; }
  const n = words(t), paras = t.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  const sents = t.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  n < MIN ? warn(`${n} words: under ${MIN} loses marks for Task ${TASK === 1 ? 'Achievement' : 'Response'}.`) : n > MIN * 1.8 ? warn(`${n} words: much longer than needed. More words means more chances for errors and less time to check.`) : ok(`${n} words.`);
  paras.length < (TASK === 1 ? 3 : 4) ? warn(`${paras.length} paragraph(s). Use ${TASK === 1 ? '3–4 (intro, overview, 1–2 detail paragraphs)' : '4–5 (intro with your position, 2–3 body paragraphs, conclusion)'}, separated by blank lines.`) : ok(`${paras.length} paragraphs.`);
  if (TASK === 1) {
    /\b(overall|in general|generally|it is (clear|evident|noticeable))\b/i.test(t) ? ok('There is an overview sentence.') : warn('No clear overview. Add a sentence starting "Overall, …" that states the main trends without numbers. Without one, Task Achievement is capped at Band 5.');
    (t.match(/\d/g) || []).length < 6 ? warn('Very few figures. Support the main features with data from the chart.') : ok('Figures are used to support the description.');
    /\b(I think|I believe|in my opinion|my view)\b/i.test(t) ? warn('Task 1 should not contain your opinion. Report what the chart shows.') : ok('No personal opinion (correct for Task 1).');
    /\b(\d+(\.\d+)?)\s*(%|percent|per cent)\s+(more|less|higher|lower)\b/i.test(t) && warn('Differences between two percentages are "percentage points", not "%".');
  } else {
    const pos = /\b(I (strongly |firmly |partly )?(believe|think|agree|disagree|feel|would argue)|in my (view|opinion)|my view is|this essay (will )?argues?)\b/i;
    pos.test(paras[0] || '') ? ok('Your position is clear in the introduction.') : warn('State your position in the introduction ("I believe…", "In my view…"). An unclear position caps Task Response.');
    /\b(in conclusion|to conclude|to sum up|overall)\b/i.test(paras[paras.length - 1] || '') ? ok('There is a clear conclusion.') : warn('End with a conclusion paragraph that restates your position ("In conclusion, …").');
    pos.test(paras[paras.length - 1] || '') || /\b(should|must|outweigh|agree|disagree|positive|negative)\b/i.test(paras[paras.length - 1] || '') ? ok('The conclusion answers the question.') : warn('The conclusion should answer the exact question asked.');
  }
  const counts = {};
  (t.toLowerCase().match(/[a-z]{5,}/g) || []).filter((w) => !STOP.has(w)).forEach((w) => { counts[w] = (counts[w] || 0) + 1; });
  const rep = Object.entries(counts).filter(([, c]) => c >= (TASK === 1 ? 4 : 5)).sort((a, b) => b[1] - a[1]).slice(0, 6);
  rep.length ? warn(`Repeated words: ${rep.map(([w, c]) => `<mark>${w}</mark> ×${c}`).join(', ')}. Use synonyms or pronouns for some of them (Lexical Resource).`) : ok('No heavy word repetition.');
  const errs = [];
  for (const [re, fix] of ERRORS) for (const m of t.matchAll(re)) errs.push(`<mark>${esc(m[0].trim() || m[0])}</mark> → ${fix}`);
  errs.length ? warn(`Possible errors: ${[...new Set(errs)].slice(0, 12).join('; ')}.`) : ok('None of the common learner errors this checker looks for.');
  const inf = [...new Set((t.match(INFORMAL) || []).map((w) => w.toLowerCase()))];
  inf.length ? warn(`Informal language: ${inf.map((w) => `<mark>${esc(w)}</mark>`).join(', ')}. Use full forms (do not, it is) and formal words (children, many, considerable).`) : ok('Formal register.');
  const cl = [...new Set((t.match(CLICHES) || []).map((w) => w.toLowerCase()))];
  cl.length && warn(`Memorised phrases: ${cl.map((w) => `<mark>${esc(w)}</mark>`).join(', ')}. Examiners spot these and they do not raise your score.`);
  const lks = (t.match(LINKERS) || []).map((w) => w.toLowerCase()), lk = lks.length;
  const twice = [...new Set(lks.filter((w, i) => lks.indexOf(w) !== i))];
  (lk > 5 || twice.length) && warn(`${lk} mechanical linkers${twice.length ? `, ${twice.map((w) => `<mark>${w}</mark>`).join(', ')} used more than once` : ''}. Link ideas with reference words and varied structures instead (Coherence and Cohesion).`);
  const long = sents.filter((s) => words(s) > 40);
  long.length && warn(`${long.length} sentence(s) over 40 words, e.g. "<mark>${esc(long[0].slice(0, 80))}…</mark>". Split them; long sentences hide grammar errors.`);
  const avg = n / Math.max(sents.length, 1);
  avg < 11 ? warn(`Average sentence length is ${avg.toFixed(0)} words. Combine ideas with complex sentences (although, which, if, while) for Grammatical Range.`) : ok(`Average sentence length ${avg.toFixed(0)} words.`);
  $('review').innerHTML = `<h3>Quick review</h3><ul class="fb">${out.map(([c, m]) => `<li class="${c}">${m}</li>`).join('')}</ul>
    <p class="muted">These are automatic checks, not a band score. For a band per criterion with corrections, press <b>Copy for Claude to mark</b> and paste it into a chat with Claude.</p>`;
}
$('check').onclick = review;

const taskText = () => TASK === 1
  ? `${P.intro} Data (${P.unit}): ${P.x.join(', ')}; ${Object.entries(P.series).map(([k, v]) => `${k}: ${v.join(', ')}`).join('; ')}.`
  : P;
const forMarking = () => `Please mark my IELTS Academic Writing Task ${TASK} like an examiner, using the official band descriptors (${TASK === 1 ? 'Task Achievement' : 'Task Response'}, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Give a band for each criterion and an overall band, list every grammar and vocabulary mistake with the correction, then rewrite my two weakest paragraphs at Band 8 and tell me the 3 changes that would raise my score most.\n\nTASK: ${taskText()}\n\nMY ANSWER (${words(essay.value)} words):\n${essay.value}`;
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(forMarking()); $('msg').textContent = 'Copied. Paste it into a chat with Claude.'; }
  catch (e) { $('msg').textContent = 'Copy failed. Select the text yourself and copy it.'; }
};
$('save').onclick = () => {
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([forMarking()], { type: 'text/plain' })),
    download: `ielts-writing-task${TASK}-set${N}-${new Date().toISOString().slice(0, 10)}.txt`,
  });
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  $('msg').textContent = 'Saved to your Downloads folder.';
};
