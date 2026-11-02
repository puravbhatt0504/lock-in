// Speaking reviewer: estimates Fluency and Coherence, Lexical Resource and Grammatical Range and Accuracy from what you said
// (the transcript) and how long you spoke. Pronunciation can't be judged from text: listen to your recording, or have Claude mark it.
// ponytail: word-count heuristics calibrated on sample answers, not a trained model. Claude's marking is the real check.
(function (root) {
  const FILLER = /^(um+|uh+|uhm+|erm*|er+|ah+|hmm+|mm+)$/;
  const SOFT = /\b(you know|i mean|basically|literally|kind of|sort of)\b/gi;
  const MARKERS = ['to be honest', 'for example', 'for instance', 'on the other hand', 'having said that', 'what i mean is', 'in my experience', 'as far as i know',
    'i suppose', 'i guess', 'the thing is', 'apart from that', 'as a result', 'that is why', "that's why", 'in other words', 'on top of that', 'whereas', 'however',
    'mind you', 'personally', 'generally speaking', 'i would say', "i'd say", 'i reckon', 'it depends', 'let me think', 'the main reason', 'another thing', 'in the end', 'actually'];
  const CLAUSES = /\b(because|although|though|which|who|whose|whom|whereas|while|unless|if|when|whenever|since|until|so that|even though|as long as|rather than|not only|in case|whether|once)\b/gi;
  const TENSES = {
    past: /\b(was|were|did|went|had|used to|[a-z]{3,}ed)\b/,
    'present perfect': /\b(have|has|i've|we've|they've|you've|it's|he's|she's) (never |always |just |already |ever |recently )?(been|done|gone|seen|had|made|got|become|[a-z]{3,}ed)\b/,
    future: /\b(will|won't|i'll|we'll|it'll|going to)\b/,
    conditional: /\b(would|could|might)\b/,
    passive: /\b(is|are|was|were|been|being|be) (made|done|given|known|seen|built|taken|told|brought|taught|[a-z]{3,}ed)\b/,
  };
  const PLAIN = /\b(good|nice|bad|very|really|thing|things|stuff|a lot|lots of|big|great|okay|ok)\b/gi;
  const IDIOMS = ['piece of cake', 'once in a blue moon', 'over the moon', 'hit the books', 'keep in touch', 'make ends meet', 'at the end of the day', 'cup of tea',
    'best of both worlds', 'in the long run', 'for granted', 'horizons', 'breath of fresh air', 'off the top of my head', 'up to date', 'learn the ropes', 'arm and a leg',
    'from scratch', 'tight budget', 'extra mile', 'learning curve', 'comfort zone', 'rule of thumb', 'nick of time', 'bucket list', 'hustle and bustle', 'peace and quiet',
    'every now and then', 'now and again', 'come to think of it', 'by and large', 'pros and cons', 'look forward to', 'catch up with', 'on the same page', 'under pressure',
    'it goes without saying', 'a far cry from', 'make the most of', 'take a break', 'keep an eye on', 'at the drop of a hat', 'the last straw', 'in a nutshell'];
  // Common spoken errors, several typical of Indian English, which examiners count against Grammatical Range and Accuracy or Lexical Resource.
  const ERRORS = [
    [/\b(he|she|it) don't\b/g, 'doesn’t'], [/\bdoesn't (has|likes|goes|wants|needs|knows)\b/g, 'doesn’t + base verb (doesn’t have)'],
    [/\b(more|most) (better|worse|easier|bigger|happier|faster|best)\b/g, 'better / best (no more, most)'], [/\b(i am|i'm) agree\b/g, 'I agree'],
    [/\bdiscuss about\b/g, 'discuss (no "about")'], [/\b(informations|furnitures|advices|luggages|equipments|knowledges|homeworks|peoples|childs)\b/g, 'uncountable or irregular: information, advice, people, children'],
    [/\bsince (\d+|two|three|four|five|six|ten|many|several) (years|months|days|weeks)\b/g, 'for … years (since + a point in time)'],
    [/\b(did|didn't) (went|came|saw|bought|took|made|ate|got|was|liked|played|wanted|tried)\b/g, 'did + base verb (did go, didn’t buy)'],
    [/\b(can|could|should|will|would|must) able to\b/g, 'can (drop "able to") or will be able to'], [/\bcan able\b/g, 'can / am able to'],
    [/\bone of (my|the|his|her|our) ([a-z]+ )?(friend|place|thing|reason|memory|hobby|person|book|film|subject|teacher|relative)\b/g, 'one of my friends (plural noun)'],
    [/\bmyself is\b|^\s*myself [a-z]+/g, 'My name is … / I am …'], [/\bpass(ed)? out (of|from)\b/g, 'graduated from (finished school)'],
    [/\b(revert back|return back|repeat again)\b/g, 'reply / return / repeat'], [/\bcousin (brother|sister)\b/g, 'cousin'], [/\bout of station\b/g, 'out of town'],
    [/\bprepone[ds]?\b/g, 'bring forward (prepone is not understood outside India)'], [/\bmost of (people|students|children|parents)\b/g, 'most people (no "of")'],
    [/\b(we|they|you|people|peoples|children|students) was\b/g, 'were'],
    [/(?<!\b(does|did|do|can|could|will|would|should|might|must|may|let|make|made|help|see|saw|watch|hear|heard) )\b(he|she) (say|go|want|like|have|do|make|think|know|need|live|work|come)\b/g, 'he/she + verb-s (he says, she has)'], [/\beach (people|students|children|persons)\b/g, 'each person / each student'],
    [/\bvery (amazing|excellent|fantastic|delicious|enormous|terrible|perfect|unique|awesome)\b/g, 'absolutely + strong adjective, or drop "very"'],
    [/\b(\d+(st|nd|rd|th)|tenth|eleventh|twelfth) (standard|std)\b/g, 'Year 12 / Grade 12'], [/\bdo one thing\b/g, 'here is an idea / why don’t we'],
    [/\b(i|we|they|you) has\b/g, 'have'], [/\bthe (nature|society) is\b/g, 'nature / society (no "the" when general)'], [/\bless (people|students|cars|children)\b/g, 'fewer + plural noun'],
  ];
  // Everyday words of 6+ letters; other 6+ letter words count as less common vocabulary.
  const BASIC = new Set(('because people really actually should before little around always another through things something different family friends friend important school ' +
    'number problem problems place places person mother father brother sister children parents become became better course during enough example finally ' +
    'happen happened having little living myself nothing others pretty quickly rather second simply someone sometimes started started family morning evening ' +
    'without within whether yourself usually anything everything everyone somebody already between thought though going coming making taking getting trying ' +
    'wanted looking working playing watching eating sleeping talking studying reading person cities countries country city college office travel travelling ' +
    'weekend summer winter spring autumn friday monday sunday saturday minutes moment possible probably together towards inside outside around almost always ' +
    'mostly hardly anyway answer asking listen listening called expect enjoyed enjoy enjoys favourite favorite special general normal common simple single ' +
    'little person interesting interested especially basically definitely absolutely exactly certainly different difficult beautiful wonderful terrible ' +
    'learned learnt taught bought brought caught thought helped helping happy friends phones mobile internet online videos movies music games sports ' +
    'question questions remember reason reasons second really school schools teacher teachers student students university subject subjects friends ' +
    'restaurant market shopping clothes money prices expensive cheaper bigger smaller longer shorter higher better easier harder faster slower ' +
    'father mother grandfather grandmother husband parents cousins daughter around nowadays recently already actually although twenty thirty younger ' +
    'elder visiting mornings evenings weekends almost bedroom kitchen houses friendly person people really').split(' '));

  const norm = (t) => String(t || '').toLowerCase().replace(/[’‘]/g, "'");
  const words = (t) => (norm(t).match(/[a-z']+/g) || []).filter((w) => !FILLER.test(w));
  const fillers = (t) => (norm(t).match(/[a-z']+/g) || []).filter((w) => FILLER.test(w)).length;
  const count = (t, re) => (norm(t).match(re) || []).length;
  function mattr(w, n = 40) {
    if (w.length <= n) return new Set(w).size / Math.max(w.length, 1);
    let s = 0;
    for (let i = 0; i + n <= w.length; i++) s += new Set(w.slice(i, i + n)).size / n;
    return s / (w.length - n + 1);
  }
  const clamp = (x) => Math.min(8, Math.max(3, x));
  const whole = (x) => Math.floor(clamp(x) + 0.25);                 // criteria are whole bands; round down unless clearly over
  const overall = (xs) => Math.floor((xs.reduce((a, b) => a + b, 0) / xs.length) * 2 + 0.5) / 2;   // IELTS: .25 → .5, .75 → next band
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // input: { p1: [{ q, text, secs }], p2: { q, text, secs }, p3: [{ q, text, secs }] }   q = the question, secs = 0 when not timed
  function rate(input) {
    const p1 = (input.p1 || []).filter((a) => words(a.text).length), p3 = (input.p3 || []).filter((a) => words(a.text).length);
    const p2 = input.p2 && words(input.p2.text).length ? input.p2 : null;
    const answers = [...p1, ...(p2 ? [p2] : []), ...p3];
    const text = answers.map((a) => a.text).join(' \n'), w = words(text), n = w.length;
    const notes = [], ok = (m) => notes.push(['ok', m]), warn = (m) => notes.push(['warn', m]);
    if (n < 40) return { n, fc: null, lr: null, gra: null, overall: null, notes: [['warn', 'Not enough to rate yet: answer at least a few questions (your answers appear in the boxes under each question).']] };
    const per100 = (k) => (k * 100) / n;

    /* Fluency and Coherence */
    const timed = answers.filter((a) => a.secs > 3), tWords = timed.reduce((s, a) => s + words(a.text).length, 0), tSecs = timed.reduce((s, a) => s + a.secs, 0);
    const wpm = tSecs > 30 ? (tWords * 60) / tSecs : null;
    const p2w = p2 ? words(p2.text).length : 0;
    let fc;
    if (wpm) {
      fc = wpm >= 150 ? 8 : wpm >= 130 ? 7.5 : wpm >= 115 ? 7 : wpm >= 100 ? 6.5 : wpm >= 85 ? 6 : wpm >= 70 ? 5 : wpm >= 55 ? 4.5 : 4;
      (wpm < 100 ? warn : ok)(`Speech rate ${Math.round(wpm)} words a minute, counting pauses${wpm < 100 ? '. Band 7 speakers keep going at about 110–140; long silences pull Fluency down' : ''}.`);
    } else {
      fc = p2w >= 250 ? 7.5 : p2w >= 200 ? 7 : p2w >= 160 ? 6.5 : p2w >= 120 ? 6 : p2w >= 80 ? 5 : 4.5;
      warn('Not timed (record while you answer to measure your speed), so Fluency is estimated from answer lengths only.');
    }
    if (p2) (p2w < 160 ? warn : ok)(`Part 2: ${p2w} words${p2w < 160 ? '. Aim for 200+ (keep talking for the full 2 minutes: add a story, a comparison, how you felt)' : ''}.`);
    else warn('No Part 2 answer. The long turn carries a lot of weight for Fluency.');
    const avg = (xs) => xs.reduce((s, a) => s + words(a.text).length, 0) / Math.max(xs.length, 1);
    const a1 = avg(p1), a3 = avg(p3);
    if (p1.length) {
      const short = p1.map((a, i) => [i + 1, words(a.text).length]).filter(([, k]) => k < 15).map(([i]) => i);
      if (a1 < 15) fc = Math.min(fc, 5); else if (a1 < 22) fc = Math.min(fc, 6);
      (a1 < 22 ? warn : ok)(`Part 1 answers average ${Math.round(a1)} words${short.length ? ` (short: question ${short.join(', ')})` : ''}${a1 < 22 ? '. Give the answer, a reason and an example: about 25–45 words' : ''}.`);
    }
    if (p3.length) {
      if (a3 < 30) fc = Math.min(fc, 5.5); else if (a3 < 45) fc = Math.min(fc, 6.5);
      (a3 < 45 ? warn : ok)(`Part 3 answers average ${Math.round(a3)} words${a3 < 45 ? '. Develop them: your view, why, an example, the other side (50–90 words)' : ''}.`);
    }
    const fl = fillers(text), soft = count(text, SOFT);
    if (per100(fl) > 6) fc -= 1; else if (per100(fl) > 3) fc -= 0.5;
    if (per100(soft) > 3) fc -= 0.5;
    fl + soft > 3 ? warn(`${fl} hesitation sounds (um, er) and ${soft} filler phrases (you know, I mean, basically, sort of). Pause silently or use a thinking phrase like "That’s an interesting question…". Speech-to-text often drops "um", so check the recording too.`) : ok('Very few fillers in the transcript.');
    const reps = (norm(text).match(/\b([a-z']+) \1\b/g) || []).filter((r) => !/^(very very|bye bye|so so|no no)$/.test(r));
    if (per100(reps.length) > 2) { fc -= 0.5; warn(`Repeated words or restarts: ${reps.slice(0, 5).map((r) => `<mark>${esc(r)}</mark>`).join(', ')}.`); }
    const used = MARKERS.filter((m) => new RegExp(`\\b${m}\\b`).test(norm(text)));
    if (used.length >= 5) fc += 0.5; else if (used.length <= 1) fc -= 0.5;
    const tryThese = ['the thing is', 'to be honest', 'having said that', 'for instance', 'on the other hand', 'what i mean is'].filter((x) => !used.includes(x)).slice(0, 3);
    (used.length >= 4 ? ok : warn)(`Discourse markers used: ${used.length ? used.map((m) => `<mark>${m}</mark>`).join(', ') : 'none'}${used.length < 4 ? `. Add natural ones: ${tryThese.map((x) => `"${x}"`).join(', ')}` : ''}.`);

    /* Lexical Resource */
    const echo = new Set(words(answers.map((a) => a.q || '').join(' ')));   // words taken from the question don't count as your vocabulary
    const m = mattr(w), rare = w.filter((x) => x.length >= 6 && !BASIC.has(x) && !echo.has(x) && !echo.has(x.replace(/s$/, '')));
    let lr = m >= 0.8 ? 8 : m >= 0.76 ? 7 : m >= 0.72 ? 6.5 : m >= 0.68 ? 6 : m >= 0.62 ? 5 : 4;
    const rareShare = rare.length / n;
    if (rareShare >= 0.1) lr += 0.5; else if (rareShare < 0.05) lr -= 0.5;
    const rareTop = [...new Set(rare)].slice(0, 12);
    (rareShare >= 0.08 ? ok : warn)(`Word variety ${m.toFixed(2)} (different words per 40), less common words ${Math.round(rareShare * 100)}%${rareTop.length ? `: ${rareTop.map((x) => `<mark>${x}</mark>`).join(', ')}` : ''}${rareShare < 0.08 ? '. Use more precise words (fascinating, overwhelming, affordable, cramped, rewarding)' : ''}.`);
    const idi = IDIOMS.filter((x) => norm(text).includes(x));
    if (idi.length >= 2) lr += 0.5;
    (idi.length ? ok : warn)(idi.length ? `Idiomatic language: ${idi.map((x) => `<mark>${x}</mark>`).join(', ')}.` : 'No idiomatic phrases. Band 7+ uses a few naturally: "once in a blue moon", "out of my comfort zone", "make the most of".');
    const plain = norm(text).match(PLAIN) || [];
    if (per100(plain.length) > 6) lr -= 1; else if (per100(plain.length) > 4) lr -= 0.5;
    if (per100(plain.length) > 4) {
      const top = Object.entries(plain.reduce((c, x) => ((c[x] = (c[x] || 0) + 1), c), {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
      warn(`Plain words: ${top.map(([x, k]) => `<mark>${x}</mark> ×${k}`).join(', ')}. Swap some: good → rewarding, convenient; very big → huge, vast; things → aspects, items.`);
    }
    if (n < 300) { lr = Math.min(lr, 6); warn(`${n} words in total. A full test is usually 1,000+ words; with this little evidence the estimate is capped at 6.`); }

    /* Grammatical Range and Accuracy */
    const cl = count(text, CLAUSES), cpm = per100(cl);
    let gra = cpm >= 7 ? 7 : cpm >= 5 ? 6.5 : cpm >= 3.5 ? 6 : cpm >= 2 ? 5 : 4;
    (cpm >= 5 ? ok : warn)(`${cl} linking clauses (because, which, although, if, when…), ${cpm.toFixed(1)} per 100 words${cpm < 5 ? '. Join ideas into complex sentences: "which was…", "although I…", "if I had…"' : ''}.`);
    const tenses = Object.entries(TENSES).filter(([, re]) => re.test(norm(text))).map(([k]) => k), miss = Object.keys(TENSES).filter((k) => !tenses.includes(k));
    if (tenses.length >= 4) gra += 0.5; else if (tenses.length <= 2) gra -= 0.5;
    (miss.length <= 1 ? ok : warn)(`Structures used: ${tenses.join(', ') || 'mostly present simple'}${miss.length ? `. Missing: ${miss.join(', ')}${miss.includes('conditional') ? ' (try "If I had more time, I would…")' : ''}` : ''}.`);
    const errs = [];
    for (const a of answers) for (const [re, fix] of ERRORS) for (const x of norm(a.text).matchAll(re)) errs.push(`<mark>${esc(x[0].trim())}</mark> → ${fix}`);
    const ue = [...new Set(errs)];
    if (!errs.length && n >= 200) gra += 0.5; else if (per100(errs.length) >= 3) gra -= 1; else if (per100(errs.length) >= 1) gra -= 0.5;
    ue.length ? warn(`Possible errors: ${ue.slice(0, 12).join('; ')}.`) : ok('None of the common errors this checker looks for.');
    if (n < 300) gra = Math.min(gra, 6);

    const FC = whole(fc), LR = whole(lr), GRA = whole(gra);
    return { n, wpm, fc: FC, lr: LR, gra: GRA, overall: overall([FC, LR, GRA]), notes };
  }
  const api = { rate, words, mattr };
  if (typeof module !== 'undefined') module.exports = api; else root.SpeakReview = api;
})(typeof window !== 'undefined' ? window : globalThis);
