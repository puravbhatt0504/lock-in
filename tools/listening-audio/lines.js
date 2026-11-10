// Prints every line that needs a recording as JSON: [{ key, voice, text }].
// Reads the Listening tests (practice/listen-*.js), the two mocks (material/mock-*.js) and the Speaking sets (practice/speak-sets.js).
const fs = require('fs'), vm = require('vm'), path = require('path');
const ext = path.join(__dirname, '../../chrome-extension');
const { ListenAudio } = (require(path.join(ext, 'practice/listen-audio.js')), globalThis);

const parts = [];   // [id, script]
const c = { window: {} }; c.window = c; vm.createContext(c);
vm.runInContext(['a', 'b', 'c', 'd'].map((x) => fs.readFileSync(path.join(ext, `practice/listen-${x}.js`), 'utf8')).join('\n;\n'), c);
c.LTESTS.forEach((T, t) => T.forEach((p, k) => parts.push([`L${t + 1}-${k}`, p.script])));
for (const m of [1, 2]) {
  const src = fs.readFileSync(path.join(ext, `material/mock-${m}.js`), 'utf8');
  const d = {}; vm.createContext(d);
  vm.runInContext(src.slice(0, src.indexOf('const KEY')) + '\n;globalThis.__L = LISTENING;', d);   // data only, not the page code
  d.__L.forEach((p, k) => parts.push([`M${m}-${k}`, p.script]));
}
// Speaking: everything the examiner says (speaking.js), with role X
const sp = { window: {} }; sp.window = sp; vm.createContext(sp);
vm.runInContext(fs.readFileSync(path.join(ext, 'practice/speak-sets.js'), 'utf8'), sp);
sp.SPEAK_SETS.forEach((set, i) => parts.push([`S${i + 1}`, [...set.p1, ...set.p3,
  'Here is your topic. You have one minute to prepare. You can make some notes.',   // the same strings as speaking.js
  'Please start speaking now. Talk for up to two minutes.', 'Thank you. ' + set.follow].map((t) => ['X', t])]));
const jobs = new Map();
for (const [id, script] of parts) {
  const cast = ListenAudio.cast(id);
  for (const [who, text] of script) {
    if (who === 'P') continue;
    const voice = cast[who], key = ListenAudio.key(voice, text);
    jobs.set(key, { key, voice, text });
  }
}
process.stdout.write(JSON.stringify([...jobs.values()]));
