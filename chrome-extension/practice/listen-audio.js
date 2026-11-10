// Recorded audio: natural voices generated once by tools/listening-audio (Kokoro TTS), one MP3 per line.
// Used by listening.html, the mocks and speaking.html (the examiner); the browser's own voices are the fallback for any line without a recording.
// Also loaded by tools/listening-audio/lines.js under Node, so the cast and file names here are the single source.
(function (root) {
  const NARRATOR = 'bf_emma';
  const WOMEN = ['bf_isabella', 'af_heart', 'af_bella'];
  const MEN = ['bm_george', 'am_michael', 'bm_fable', 'am_fenrir'];
  const EXAMINERS = ['bm_george', 'bf_emma', 'bm_fable', 'bf_isabella'];   // British, one per Speaking set in turn
  // id: 'L<test>-<part>' (practice tests 1–8) or 'M<mock>-<part>', parts 0–3: each test and part gets its own pair of voices.
  // 'S<set>': the Speaking examiner (role X) for that set.
  function cast(id) {
    const s = /^S(\d+)$/.exec(id);
    if (s) return { X: EXAMINERS[(+s[1] - 1) % EXAMINERS.length] };
    const [, kind, n, p] = /^([LM])(\d+)-(\d)$/.exec(id);
    const t = +n + (kind === 'M' ? 8 : 0), part = +p;
    return { N: NARRATOR, W: WOMEN[(t + part) % WOMEN.length], M: MEN[(3 * t + part) % MEN.length] };
  }
  // File name: FNV-1a (32-bit) of "voice|text" in UTF-8, so editing a line or recasting makes a new file.
  function key(voice, text) {
    let h = 0x811c9dc5;
    for (const b of new TextEncoder().encode(voice + '|' + text)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16).padStart(8, '0');
  }
  const api = { cast, key };

  if (typeof document !== 'undefined') {
    const base = new URL('audio/', document.currentScript.src).href;
    const have = new Set(String(root.LISTEN_AUDIO_HAVE || '').split(' ').filter(Boolean));   // from audio/have.js
    const SETTING = 'ielts-recorded-voices';
    let cur = null, done = null;
    const cache = new Map();
    const url = (id, who, text) => { const v = cast(id)[who]; const k = v && key(v, text); return k && have.has(k) ? base + k + '.mp3' : null; };
    const clip = (u) => { let a = cache.get(u); if (!a) { a = new Audio(u); a.preload = 'auto'; cache.set(u, a); if (cache.size > 12) cache.delete(cache.keys().next().value); } return a; };
    api.available = () => have.size > 0;
    api.enabled = () => { try { return localStorage.getItem(SETTING) !== '0'; } catch (e) { return true; } };
    api.setEnabled = (on) => { try { localStorage.setItem(SETTING, on ? '1' : '0'); } catch (e) {} };
    api.has = (id, who, text) => api.enabled() && !!url(id, who, text);
    // Start downloading upcoming lines so there is no gap between speakers on a phone connection.
    api.preload = (id, lines) => lines.forEach(([who, text]) => { const u = url(id, who, text); if (u) clip(u); });
    // Resolves true once the line has played (or was stopped), false if there is no recording or it failed before starting.
    api.play = (id, who, text, rate) => new Promise((res) => {
      const u = api.enabled() && url(id, who, text);
      if (!u) return res(false);
      const a = cur = clip(u);
      let started = false;
      done = (v) => { a.onended = a.onerror = a.onplaying = null; done = null; res(v); };
      a.onplaying = () => { started = true; };
      a.onended = () => done && done(true);
      a.onerror = () => done && done(started);
      a.currentTime = 0; a.playbackRate = rate || 1; a.preservesPitch = true;
      a.play().catch(() => done && done(started));
    });
    api.stop = () => { if (cur) cur.pause(); if (done) done(true); };
  }
  root.ListenAudio = api;
})(typeof window !== 'undefined' ? window : globalThis);
