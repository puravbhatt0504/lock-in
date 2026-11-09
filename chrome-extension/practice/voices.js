// Who reads the Listening scripts. Used by listening.html and the mocks in material/.
// Voices.apply(V) takes the voices a page picked for W (woman), M (man) and N (narrator) and returns
// { W: { voice, pitch }, M: …, N: …, mine } after two adjustments:
//  1. When the device can't tell male from female voices (Android lists one voice per accent), the page would
//     give the woman and the man the same voice. The man then gets a different accent and a lower pitch.
//  2. Voices chosen in the Voices panel replace the automatic ones. They are saved in this browser.
window.Voices = (() => {
  const synth = window.speechSynthesis;
  const KEY = 'ielts-voices';
  const ROLES = [['W', 'Woman', 'Hello, I’m the woman in this conversation. The museum opens at half past nine.'],
    ['M', 'Man', 'And I’m the man. Could you spell your surname for me, please?'],
    ['N', 'Narrator', 'Part one. You will hear a conversation between two people.']];
  const AUTO_PITCH = { W: 1.08, M: 0.72, N: 1 };   // only used when W and M would otherwise be the same voice
  let mine = {};
  try { mine = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) {} };
  const en = () => (synth ? synth.getVoices().filter((v) => /^en/i.test(v.lang)) : []);
  const id = (v) => v.voiceURI || v.name;
  const byId = (k) => en().find((v) => id(v) === k);
  const accent = (v, re) => re.test(v.lang.replace('_', '-'));

  function apply(V) {
    const out = { W: { voice: V.W, pitch: 1 }, M: { voice: V.M, pitch: 1 }, N: { voice: V.N, pitch: 1 }, mine: false };
    if (V.W && V.W === V.M) {
      const list = en(), other = (re) => list.find((v) => v !== V.W && accent(v, re));
      out.M.voice = other(/^en-AU/i) || other(/^en-US/i) || other(/^en-IN/i) || list.find((v) => v !== V.W) || V.W;
      out.W.pitch = AUTO_PITCH.W; out.M.pitch = AUTO_PITCH.M;
      if (out.N.voice === out.M.voice) out.N.voice = V.W;
    }
    for (const [r] of ROLES) {
      const c = mine[r];
      if (!c) continue;
      const v = c.voice && byId(c.voice);
      if (v) out[r].voice = v;
      if (c.pitch) out[r].pitch = c.pitch;
      if (v || c.pitch) out.mine = true;
    }
    return out;
  }

  // Test playback: one short line in the role's current voice.
  function sample(r, V) {
    if (!synth) return;
    const c = apply(V())[r], u = new SpeechSynthesisUtterance(ROLES.find((x) => x[0] === r)[2]);
    if (c.voice) { u.voice = c.voice; u.lang = c.voice.lang; }
    u.pitch = c.pitch; window.__utter = u;
    synth.cancel(); synth.speak(u);
  }

  // The Voices panel: a closed <details> after the page's Listening controls.
  // V() returns the page's automatic { W, M, N } so "Automatic" shows what will really play.
  function panel(after, V, busy) {
    if (!synth || !after) return;
    const d = document.createElement('details');
    d.className = 'voices';
    const LA = window.ListenAudio, recorded = LA && LA.available();
    d.innerHTML = `<summary>Voices</summary>${recorded ? `<label class="vrec"><input type="checkbox" data-rec${LA.enabled() ? ' checked' : ''}>
      <b>Recorded natural voices</b> <span class="muted">(recommended). Untick to use this browser's own voices, set below.</span></label>` : ''}
      <p class="muted">Browser voices: pick who reads each role. Automatic uses the best voices this browser has.
      On Android, install more voices in Settings → Text-to-speech → Google → Install voice data, then reload.</p><div class="vrows"></div>
      <div class="bar"><button class="ghost" type="button" data-reset>Back to automatic</button></div>`;
    after.insertAdjacentElement('afterend', d);
    const rows = d.querySelector('.vrows');
    const draw = () => {
      const list = en(), now = apply(V());
      rows.innerHTML = ROLES.map(([r, name]) => {
        const c = mine[r] || {}, auto = now[r].voice;
        const pitch = c.pitch || now[r].pitch;
        return `<div class="vrow" data-r="${r}"><b>${name}</b>
          <select data-k="voice" aria-label="${name} voice"><option value="">Automatic${auto ? ` (${auto.name})` : ''}</option>${
            list.map((v) => `<option value="${id(v).replace(/"/g, '&quot;')}"${c.voice === id(v) ? ' selected' : ''}>${v.name} · ${v.lang}</option>`).join('')}</select>
          <label class="muted">pitch <input type="range" data-k="pitch" min="0.5" max="1.5" step="0.05" value="${pitch}" aria-label="${name} pitch"> <span>${pitch.toFixed(2)}</span></label>
          <button class="ghost" type="button" data-test>Test</button></div>`;
      }).join('');
    };
    rows.addEventListener('input', (e) => {
      const row = e.target.closest('.vrow'), k = e.target.dataset.k;
      if (!row || !k) return;
      const r = row.dataset.r, c = mine[r] = mine[r] || {};
      if (k === 'voice') c.voice = e.target.value || undefined;
      else { c.pitch = +e.target.value; e.target.nextElementSibling.textContent = c.pitch.toFixed(2); }
      store();
      if (k === 'voice') draw();
    });
    rows.addEventListener('click', (e) => {
      if (!e.target.matches('[data-test]')) return;
      if (busy()) { e.target.textContent = 'Stop the test first'; setTimeout(() => { e.target.textContent = 'Test'; }, 1500); return; }
      sample(e.target.closest('.vrow').dataset.r, V);
    });
    d.querySelector('[data-reset]').onclick = () => { mine = {}; store(); draw(); };
    if (recorded) d.querySelector('[data-rec]').onchange = (e) => LA.setEnabled(e.target.checked);
    d.addEventListener('toggle', () => { if (d.open) draw(); });
    if (synth.addEventListener) synth.addEventListener('voiceschanged', () => { if (d.open) draw(); });
  }

  return { apply, panel };
})();
