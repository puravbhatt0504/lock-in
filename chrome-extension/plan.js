/* Shared logic + the day-by-day IELTS plan. Loaded by the background worker,
   the YouTube content script, the new-tab page and the blocked page. */
(function (root) {
  const VIDEOS = {
    1: ['apOCnYpR-9g', 'Band 9 reading strategy'],
    2: ['PM3nWVXgsHo', 'True / False / Not Given'],
    3: ['SXdMpskBDmA', 'Matching Headings'],
    4: ['qywjKFDMhcM', 'Writing Task 1'],
    5: ['TvVc9oiFDQI', 'Band 9 Task 2 essay'],
    6: ['ybNEwnnIxWw', 'Speaking Band 9'],
    7: ['pBrFbXB7EAg', 'Full speaking test'],
    8: ['uadjiMxu3gI', 'Reading practice test'],
    9: ['ele9DCSFY4k', 'Cambridge 19 Listening T1'],
    10: ['BtclUFVBQ48', 'Cambridge 19 Listening T2'],
    11: ['TUXHJ2d08aM', 'Cambridge 19 Listening T3'],
    12: ['0vQw0ifMFbg', 'Cambridge 19 Listening T4'],
    13: ['4pmjABTWEtg', 'Cambridge 20 Listening T1'],
    14: ['USbMAyHeOJg', 'Cambridge 20 Listening T2'],
    15: ['i-BMGqZ2CM0', 'Cambridge 20 Listening T3'],
    16: ['di4apbKhVDY', 'Cambridge 20 Listening T4'],
    17: ['cQ-kYU3uSP0', 'Official speaking mock'],
  };

  // dMAT material. PDF page numbers are file pages (dMAT printed page + 1; TestAS printed = file).
  const DM = 'https://www.d-mat.de/wp-content/uploads/2026/09/';
  const DM_PDF = DM + '260902_dMAT_General-Academic-Module_Preparatoy-Materials_EN.pdf#page=';
  const TA_PDF = 'https://testas.de/fileadmin/bilder/4_pdf-video/1-teilnehmende/230531_digitalertestas_preparatory_materials.pdf#page=';
  // Study files ship inside the extension (chrome-extension/material/, git-ignored), so links open without file:// access.
  const MOCKS = 'material/';
  const LINKS = {
    intro: ['Video: how the dMAT works', DM + '260908_General-Introduction_dMAT.mp4'],
    fsv: ['Video: Figure Sequences', DM + '260908_FS-dMAT-Introduction-2.mp4'],
    mev: ['Video: Mathematical Equations', DM + '260908_ME-Introduction_dMAT.mp4'],
    lsv: ['Video: Latin Squares', DM + '260908_LQ-Introduction_dMAT-1.mp4'],
    smv: ['Video: Subject Module', DM + '260908_Subject-Module-Introduction_dMAT.mp4'],
    rules: ['dMAT PDF: structure + rules', DM_PDF + '5'],
    fs: ['dMAT PDF: Figure Sequences', DM_PDF + '7'],
    me: ['dMAT PDF: Mathematical Equations', DM_PDF + '17'],
    ls: ['dMAT PDF: Latin Squares', DM_PDF + '23'],
    vec: ['dMAT PDF: Vector Calculations', DM_PDF + '34'],
    hyd: ['dMAT PDF: Hydrostatics', DM_PDF + '40'],
    eoq: ['dMAT PDF: Optimal Order Quantity', DM_PDF + '48'],
    res: ['dMAT PDF: Research Strategies', DM_PDF + '53'],
    taEng: ['TestAS PDF: Engineering', TA_PDF + '52'],
    taSci: ['TestAS PDF: Maths / CS / Science', TA_PDF + '59'],
    taEco: ['TestAS PDF: Economics', TA_PDF + '70'],
    taSoc: ['TestAS PDF: Social Sciences', TA_PDF + '32'],
    mock: ['Unofficial free mocks (MS in Germany, needs account)', 'https://msingermany.com/dmat'],
    m1: ['IELTS Mock 1', MOCKS + 'mock-1.html'],
    m2: ['IELTS Mock 2', MOCKS + 'mock-2.html'],
    wbd: ['Writing band descriptors (PDF)', MOCKS + 'IELTS_writing_band_descriptors.pdf'],
    sbd: ['Speaking band descriptors (PDF)', MOCKS + 'IELTS_speaking_band_descriptors.pdf'],
    score: ['Raw score to band (ielts.org)', 'https://ielts.org/organisations/ielts-for-organisations/understanding-ielts-scoring'],
    reg: ['Register (g.a.s.t.)', 'https://www.gast.de/portal/center-search/center-search/dmat/exams/worldwide?lang=en'],
  };

  // Original practice tests in practice/: Reading and Listening Tests 1–8, Writing Task 1 sets 1–7 and Task 2 sets 1–11, Speaking sets 1–4.
  for (let n = 1; n <= 8; n++) LINKS['r' + n] = [`Reading Test ${n} (practice)`, `practice/reading.html?n=${n}`];
  for (let n = 1; n <= 7; n++) LINKS['wa' + n] = [`Writing Task 1 · set ${n}`, `practice/writing.html?task=1&n=${n}`];
  for (let n = 1; n <= 11; n++) LINKS['wb' + n] = [`Writing Task 2 · set ${n}`, `practice/writing.html?task=2&n=${n}`];

  for (let n = 1; n <= 8; n++) LINKS['l' + n] = [`Listening Test ${n} (practice)`, `practice/listening.html?n=${n}`];
  for (let n = 1; n <= 4; n++) LINKS['sp' + n] = [`Speaking set ${n} (practice)`, `practice/speaking.html?n=${n}`];

  const MORNING = 'Speaking Part 2 long turn (1 min prep, 2 min talk), record and replay + 10 min mistakes log';

  // date -> { main, v: [playlist #s], l: [LINKS keys], week, noLock, steps: [{ at, t, v, l }] }
  // steps: multi-part days split into one tickable row per part; ticking them all ticks main.
  const PLAN = {
    '2026-11-01': { week: 1, am: false, main: 'COLD DIAGNOSTIC 17:00–20:45: Speaking, then Listening Test 1 + Reading Test 1 + Writing. Real conditions, no pauses, no phone', steps: [
      { at: '17:00 · Speaking', t: 'Record Speaking Parts 1–3 (answer along with the mock video), replay once', v: [17], l: ['sbd'] },
      { at: '17:20 · Listening', t: 'Practice Listening Test 1, 30 min, play once only', l: ['l1'] },
      { at: '17:55 · Reading', t: 'Practice Reading Test 1, 60 min', l: ['r1'] },
      { at: '19:00 · Writing', t: 'Writing Task 1 (20 min) + Task 2 (40 min), then Check my writing', l: ['wa1', 'wb1'] },
      { at: '20:05 · Mark', t: 'Mark L/R, convert to bands, note the weakest section, start a mistakes log', l: ['score'] },
    ] },
    '2026-11-02': { week: 2, main: 'Passport appointment 10:00. Evening: watch #1 Band 9 reading strategy + #2 True/False/Not Given + #3 Matching Headings. Book the IELTS the day your passport arrives', steps: [
      { at: '10:00 · Passport', t: 'Passport appointment' },
      { at: 'Evening · Watch', t: '#1 Band 9 reading strategy', v: [1] },
      { at: 'Evening · Watch', t: '#2 True / False / Not Given', v: [2] },
      { at: 'Evening · Watch', t: '#3 Matching Headings', v: [3] },
    ] },
    '2026-11-03': { week: 2, main: 'Read the Writing + Speaking band descriptors (Band 7 vs 8). Watch #4 (Task 1); write Task 1, 20 min', steps: [
      { at: 'Read', t: 'Writing + Speaking band descriptors: what separates Band 7 from 8', l: ['wbd', 'sbd'] },
      { at: 'Watch', t: '#4 Writing Task 1', v: [4] },
      { at: 'Write', t: 'Task 1, 20 min', l: ['wa2'] },
    ] },
    '2026-11-04': { week: 2, main: 'Watch #5 (Task 2); Task 2 essay #1, timed 40 min', steps: [
      { at: 'Watch', t: '#5 Band 9 Task 2 essay', v: [5] },
      { at: 'Write', t: 'Task 2 essay #1, timed 40 min', l: ['wb2'] },
    ] },
    '2026-11-05': { week: 2, main: 'Practice Listening Test 2, timed + review misses with the transcript', steps: [
      { at: 'Listening', t: 'Practice Listening Test 2, play once only', l: ['l2'] },
      { at: 'Review', t: 'Go through every miss with the transcript' },
    ] },
    '2026-11-06': { week: 2, main: 'Task 2 essay #2 + Task 1 #2, timed', steps: [
      { at: 'Write', t: 'Task 2 essay #2, timed 40 min', l: ['wb3'] },
      { at: 'Write', t: 'Task 1 #2, timed 20 min', l: ['wa3'] },
    ] },
    '2026-11-07': { week: 2, main: 'Practice Reading Test 2, timed 60 min + review', steps: [
      { at: 'Reading', t: 'Practice Reading Test 2, timed 60 min', l: ['r2'] },
      { at: 'Review', t: 'Go through every wrong answer and find the line that proves it' },
    ] },
    '2026-11-08': { week: 2, main: 'Watch #6 + #7 speaking tests (note how Band 9 answers extend). Task 2 essay #3 = Mock 1 Writing Task 2 (40 min); compare all three essays with the descriptors', steps: [
      { at: 'Watch', t: '#6 Speaking Band 9: note how answers extend', v: [6] },
      { at: 'Watch', t: '#7 Full speaking test', v: [7] },
      { at: 'Write', t: 'Task 2 essay #3 = Mock 1 Writing Task 2, 40 min', l: ['m1'] },
      { at: 'Review', t: 'Compare all three essays with the descriptors', l: ['wbd'] },
    ] },
    '2026-11-09': { week: 3, main: 'Practice Listening Test 3, timed + review', steps: [
      { at: 'Listening', t: 'Practice Listening Test 3, play once only', l: ['l3'] },
      { at: 'Review', t: 'Go through every miss with the transcript' },
    ] },
    '2026-11-10': { week: 3, main: 'Practice Reading Test 3, timed + review', steps: [
      { at: 'Reading', t: 'Practice Reading Test 3, timed 60 min', l: ['r3'] },
      { at: 'Review', t: 'Go through every wrong answer' },
    ] },
    '2026-11-11': { week: 3, main: 'Full Speaking mock, recorded (Parts 1–3); replay for fillers and pauses', steps: [
      { at: 'Speaking', t: 'Full Speaking mock, recorded (Parts 1–3)', v: [17], l: ['sp1'] },
      { at: 'Review', t: 'Replay it and note fillers and pauses', l: ['sbd'] },
    ] },
    '2026-11-12': { week: 3, main: 'Task 2 essay #4 + Task 1 #3 = Mock 1 Writing Task 1 (bar chart)', steps: [
      { at: 'Write', t: 'Task 2 essay #4, timed 40 min', l: ['wb4'] },
      { at: 'Write', t: 'Task 1 #3 = Mock 1 Writing Task 1 (bar chart), 20 min', l: ['m1'] },
    ] },
    '2026-11-13': { week: 3, main: 'Practice Listening Test 4, timed + review', steps: [
      { at: 'Listening', t: 'Practice Listening Test 4, play once only', l: ['l4'] },
      { at: 'Review', t: 'Go through every miss with the transcript' },
    ] },
    '2026-11-14': { week: 3, main: 'Practice Reading Test 4, timed + review', steps: [
      { at: 'Reading', t: 'Practice Reading Test 4, timed 60 min', l: ['r4'] },
      { at: 'Review', t: 'Go through every wrong answer' },
    ] },
    '2026-11-15': { week: 3, main: 'Speaking mock #2 (recorded, Mock 1 Speaking questions) + Task 2 essay #5', steps: [
      { at: 'Speaking', t: 'Speaking mock #2, recorded, Mock 1 Speaking questions', l: ['m1'] },
      { at: 'Write', t: 'Task 2 essay #5, timed 40 min', l: ['wb5'] },
    ] },
    '2026-11-16': { week: 4, main: 'Task 2 essay #6, then get it marked against the descriptors', steps: [
      { at: 'Write', t: 'Task 2 essay #6, timed 40 min', l: ['wb6'] },
      { at: 'Review', t: 'Get it marked against the descriptors', l: ['wbd'] },
    ] },
    '2026-11-17': { week: 4, main: 'Rewrite one essay using the feedback + Mock 1 Listening (30 min, auto-marked)', steps: [
      { at: 'Write', t: 'Rewrite one essay using the feedback' },
      { at: 'Listening', t: 'Mock 1 Listening, 30 min, auto-marked', l: ['m1'] },
    ] },
    '2026-11-18': { week: 4, main: 'Task 1 #4 + Practice Listening Test 5', steps: [
      { at: 'Write', t: 'Task 1 #4, timed 20 min', l: ['wa4'] },
      { at: 'Listening', t: 'Practice Listening Test 5, play once only', l: ['l5'] },
    ] },
    '2026-11-19': { week: 4, main: 'Task 2 essay #7, timed 40 min', l: ['wb7'] },
    '2026-11-20': { week: 4, main: 'Task 1 #5 + review your mistakes log', steps: [
      { at: 'Write', t: 'Task 1 #5, timed 20 min', l: ['wa5'] },
      { at: 'Review', t: 'Read through your mistakes log' },
    ] },
    '2026-11-21': { week: 4, main: 'FULL MOCK #1 11:00 (Listening Test 6, Reading Test 5, Writing) + Speaking mock tonight', steps: [
      { at: '11:00 · Listening', t: 'Practice Listening Test 6, 30 min, play once only', l: ['l6'] },
      { at: '11:35 · Reading', t: 'Practice Reading Test 5, 60 min', l: ['r5'] },
      { at: '12:40 · Writing', t: 'Writing Task 1 (20 min) + Task 2 (40 min)', l: ['wa6', 'wb8'] },
      { at: 'Tonight · Speaking', t: 'Speaking mock, recorded (Parts 1–3)', v: [17], l: ['sp2', 'sbd'] },
    ] },
    '2026-11-22': { week: 4, main: 'Score mock #1 per section; list your top 3 weak spots. Then Mock 1 Reading, timed 60 min', steps: [
      { at: 'Mark', t: 'Score mock #1 per section and log it below', l: ['score'] },
      { at: 'Review', t: 'List your top 3 weak spots' },
      { at: 'Reading', t: 'Mock 1 Reading, timed 60 min', l: ['m1'] },
    ] },
    '2026-11-23': { week: 5, main: 'Task 2 essay #8 (weakest section first all week)', l: ['wb9'] },
    '2026-11-24': { week: 5, main: 'Practice Listening Test 7, timed + review', l: ['l7'] },
    '2026-11-25': { week: 5, main: 'Practice Reading Test 6, timed 60 min + review', l: ['r6'] },
    '2026-11-26': { week: 5, main: 'Task 2 essay #9 + Task 1 #6 = Mock 2 Writing, both tasks in 60 min; copy them to Claude for marking', steps: [
      { at: 'Writing', t: 'Mock 2 Writing, both tasks in 60 min (Task 1 #6 + Task 2 essay #9)', l: ['m2'] },
      { at: 'Mark', t: 'Copy them to Claude for marking against the descriptors', l: ['wbd'] },
    ] },
    '2026-11-27': { week: 5, main: 'Speaking mock #4, recorded (Mock 2 Speaking questions)', l: ['m2'] },
    '2026-11-28': { week: 5, main: 'Practice Reading Test 7, timed + Speaking mock #5', steps: [
      { at: 'Reading', t: 'Practice Reading Test 7, timed 60 min', l: ['r7'] },
      { at: 'Speaking', t: 'Speaking mock #5, recorded', l: ['sp3', 'sbd'] },
    ] },
    '2026-11-29': { week: 5, main: 'FULL MOCK #2 11:00 (Listening Test 8, Reading Test 8, Writing)', steps: [
      { at: '11:00 · Listening', t: 'Practice Listening Test 8, 30 min, play once only', l: ['l8'] },
      { at: '11:35 · Reading', t: 'Practice Reading Test 8, 60 min', l: ['r8'] },
      { at: '12:40 · Writing', t: 'Writing Task 1 (20 min) + Task 2 (40 min)', l: ['wa7', 'wb10'] },
      { at: 'After · Mark', t: 'Mark L/R, convert to bands, log the scores below', l: ['score'] },
    ] },
    '2026-11-30': { week: 6, main: 'Review mock #2 + final Task 2 essay #10', steps: [
      { at: 'Review', t: 'Review mock #2 section by section' },
      { at: 'Write', t: 'Final Task 2 essay #10, timed 40 min', l: ['wb11'] },
    ] },
    '2026-12-01': { week: 6, main: 'Light: Mock 2 Listening Part 4 + Mock 2 Reading Passage 1', steps: [
      { at: 'Listening', t: 'Mock 2 Listening Part 4', l: ['m2'] },
      { at: 'Reading', t: 'Mock 2 Reading Passage 1', l: ['m2'] },
    ] },
    '2026-12-02': { week: 6, main: 'Speaking warm-up only; confirm test centre, slot and passport', steps: [
      { at: 'Speaking', t: 'Speaking warm-up only: Part 1 and Part 2 of set 4', l: ['sp4'] },
      { at: 'Admin', t: 'Confirm test centre, slot and passport' },
    ] },
    '2026-12-03': { week: 6, main: 'Skim your mistakes log. Nothing new' },
    '2026-12-04': { week: 6, main: 'Rest. Early night', noLock: true },
    '2026-12-05': { week: 6, main: 'TEST DAY. You trained for this.', noLock: true },
    '2026-12-06': { week: 6, main: 'Rest. dMAT prep starts tomorrow', noLock: true, am: false },
    // dMAT (16 Jan 2027). No notes allowed in the test, so solve everything in your head.
    '2026-12-07': { week: 7, am: false, main: 'dMAT: watch the intro video, read structure + rules. Register for 16 Jan if your passport has arrived', steps: [
      { at: 'Watch', t: 'Intro video: how the dMAT works', l: ['intro'] },
      { at: 'Read', t: 'Structure + rules', l: ['rules'] },
      { at: 'Admin', t: 'Register for 16 Jan if your passport has arrived', l: ['reg'] },
    ] },
    '2026-12-08': { week: 7, am: false, main: 'Figure Sequences: video + rules, then exercises 1–2 (low), no notes', steps: [
      { at: 'Watch', t: 'Figure Sequences video', l: ['fsv'] },
      { at: 'Practice', t: 'Rules, then exercises 1–2 (low), no notes', l: ['fs'] },
    ] },
    '2026-12-09': { week: 7, am: false, main: 'Mathematical Equations: video + rules, then exercises 1–2 in your head', steps: [
      { at: 'Watch', t: 'Mathematical Equations video', l: ['mev'] },
      { at: 'Practice', t: 'Rules, then exercises 1–2 in your head', l: ['me'] },
    ] },
    '2026-12-10': { week: 7, am: false, main: 'Latin Squares: video + rules, then exercises 1–2, no notes', steps: [
      { at: 'Watch', t: 'Latin Squares video', l: ['lsv'] },
      { at: 'Practice', t: 'Rules, then exercises 1–2, no notes', l: ['ls'] },
    ] },
    '2026-12-11': { week: 7, am: false, main: 'Figure Sequences exercises 3–4 (medium); compare with the solution paths', l: ['fs'] },
    '2026-12-12': { week: 7, am: false, main: 'Maths Equations 3–6 + Latin Squares 3–6, no notes; review every solution path', steps: [
      { at: 'Practice', t: 'Maths Equations 3–6, no notes', l: ['me'] },
      { at: 'Practice', t: 'Latin Squares 3–6, no notes', l: ['ls'] },
      { at: 'Review', t: 'Go through every solution path' },
    ] },
    '2026-12-13': { week: 7, am: false, main: 'Figure Sequences 5–6 (high); list the change rules you saw (movement, colour, rotation, x+1)', steps: [
      { at: 'Practice', t: 'Figure Sequences 5–6 (high), no notes', l: ['fs'] },
      { at: 'Review', t: 'List the change rules you saw (movement, colour, rotation, x+1)' },
    ] },
    '2026-12-14': { week: 8, am: false, main: 'Subject Module: video, then Vector Calculations text + questions', steps: [
      { at: 'Watch', t: 'Subject Module video', l: ['smv'] },
      { at: 'Practice', t: 'Vector Calculations text + questions', l: ['vec'] },
    ] },
    '2026-12-15': { week: 8, am: false, main: 'Light (EPFL/USC deadline): read the Hydrostatics text only', l: ['hyd'] },
    '2026-12-16': { week: 8, am: false, main: 'Hydrostatics questions, then check the solutions', l: ['hyd'] },
    '2026-12-17': { week: 8, am: false, main: 'Optimal Order Quantity text + questions', l: ['eoq'] },
    '2026-12-18': { week: 8, am: false, main: 'Research Strategies in Social Sciences text + questions', l: ['res'] },
    '2026-12-19': { week: 8, am: false, main: 'TestAS Engineering module, timed, no notes', l: ['taEng'] },
    '2026-12-20': { week: 8, am: false, main: 'Review every wrong subject answer: why did the wrong option look right?' },
    '2026-12-21': { week: 9, am: false, main: 'TestAS Maths / CS / Science module, first half', l: ['taSci'] },
    '2026-12-22': { week: 9, am: false, main: 'TestAS Maths / CS / Science module, second half', l: ['taSci'] },
    '2026-12-23': { week: 9, am: false, main: 'TestAS Economics module, timed', l: ['taEco'] },
    '2026-12-24': { week: 9, am: false, main: 'Redo all 6 Latin Squares from scratch, under 75 s each (20 items in 25 min)', l: ['ls'] },
    '2026-12-25': { week: 9, am: false, main: 'Light: redo Figure Sequences 1–6, no notes', l: ['fs'] },
    '2026-12-26': { week: 9, am: false, main: 'dMAT MOCK #1 10:00: one full mock, 3 h, no notes', l: ['mock'] },
    '2026-12-27': { week: 9, am: false, main: 'Score mock #1 per section; pick your weakest core subtest', steps: [
      { at: 'Mark', t: 'Score mock #1 per section' },
      { at: 'Review', t: 'Pick your weakest core subtest' },
    ] },
    '2026-12-28': { week: 10, am: false, main: 'Weakest core subtest: redo its 6 official exercises, timed', l: ['fs', 'me', 'ls'] },
    '2026-12-29': { week: 10, am: false, main: 'TestAS Social Sciences module, timed', l: ['taSoc'] },
    '2026-12-30': { week: 10, am: false, main: 'Maths Equations 1–6 again, under 75 s each, in your head', l: ['me'] },
    '2026-12-31': { week: 10, am: false, main: 'Redo every subject-module question you got wrong', l: ['vec', 'hyd', 'eoq', 'res'] },
    '2027-01-01': { week: 10, am: false, main: 'Light: Latin Squares 1–6, timed', l: ['ls'] },
    '2027-01-02': { week: 10, am: false, main: 'dMAT MOCK #2 10:00: a fresh full mock, 3 h, no notes', l: ['mock'] },
    '2027-01-03': { week: 10, am: false, main: 'Score mock #2; compare with mock #1 per section' },
    '2027-01-04': { week: 11, am: false, main: 'LAST DAY to register for the 16 Jan dMAT. Confirm the booking email, then a 25-min weakest-subtest drill', steps: [
      { at: 'Admin', t: 'LAST DAY: register for the 16 Jan dMAT and confirm the booking email', l: ['reg'] },
      { at: 'Practice', t: '25-min weakest-subtest drill', l: ['mock'] },
    ] },
    '2027-01-05': { week: 11, am: false, main: 'One 25-min core subtest from a mock, timed', l: ['mock'] },
    '2027-01-06': { week: 11, am: false, main: 'TestAS Engineering module again, timed', l: ['taEng'] },
    '2027-01-07': { week: 11, am: false, main: 'Figure Sequences: a 25-min mock section', l: ['mock'] },
    '2027-01-08': { week: 11, am: false, main: 'Rewatch all five official videos (exactly what the screen looks like)', l: ['intro', 'fsv', 'mev', 'lsv', 'smv'] },
    '2027-01-09': { week: 11, am: false, main: 'dMAT MOCK #3 10:00: full mock, exam timing incl. the 30-min break', l: ['mock'] },
    '2027-01-10': { week: 11, am: false, main: 'Score mock #3; redo only the items you got wrong', steps: [
      { at: 'Mark', t: 'Score mock #3' },
      { at: 'Review', t: 'Redo only the items you got wrong' },
    ] },
    '2027-01-11': { week: 12, am: false, main: 'Light: one 25-min section of your weakest subtest', l: ['mock'] },
    '2027-01-12': { week: 12, am: false, main: 'Light: one subject-module text + questions', l: ['taSci'] },
    '2027-01-13': { week: 12, am: false, main: 'Check test centre, time and passport in the g.a.s.t. portal' },
    '2027-01-14': { week: 12, am: false, main: 'Skim the official solution paths. Nothing new' },
    '2027-01-15': { week: 12, am: false, main: 'Rest. Pack passport. Early night', noLock: true },
    '2027-01-16': { week: 12, am: false, main: 'dMAT TEST DAY', noLock: true },
  };

  // Reading and Writing parts also get the matching strategy video, unless they already use a mock.
  const RES = [[/Reading/, 8], [/Task 1/, 4], [/Task 2|essay/i, 5]];
  for (const day of Object.values(PLAN)) for (const p of day.steps || [day]) {
    if ((p.l || []).some((k) => k === 'm1' || k === 'm2')) continue;
    for (const [re, v] of RES) if (re.test(p.t || p.main)) p.v = [...new Set([...(p.v || []), v])];
  }

  const WEEK_TITLES = {
    1: 'Cold diagnostic', 2: 'Strategy + writing structure', 3: 'Speaking + timed sections',
    4: 'Writing push + full mock #1', 5: 'Targeted repair + full mock #2', 6: 'Taper + test day',
    7: 'dMAT: learn the core tasks', 8: 'dMAT: subject module', 9: 'dMAT: transfer + mock #1',
    10: 'dMAT: weak spots + mock #2', 11: 'dMAT: register + mock #3', 12: 'dMAT: taper + test day',
  };

  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const at = (day, hhmm) => { const [h, m] = hhmm.split(':').map(Number); const d = new Date(day); d.setHours(h, m, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  function blockAppliesOn(b, day) {
    const key = ymd(day);
    if (!b.days.includes(DOW[day.getDay()])) return false;
    if (b.from && key < b.from) return false;
    if (b.until && key > b.until) return false;
    return true;
  }
  // Once Google Calendar has synced, its events are the blocks (one dated block each); same rule as Get-Blocks in the PC blocker.
  function effectiveBlocks(schedule) {
    const c = schedule.calendar;
    if (!(c && c.url && c.syncedAt)) return schedule.blocks || [];
    return (c.events || []).map((e) => ({ label: e.label, days: [DOW[new Date(e.date + 'T00:00').getDay()]], start: e.start, end: e.end, from: e.date, until: e.date }));
  }
  function inRange(schedule, day) { const k = ymd(day); return k >= schedule.activeFrom && k <= schedule.activeUntil; }

  function activeBlock(schedule, now) {
    if (!inRange(schedule, now)) return null;
    for (const b of effectiveBlocks(schedule)) {
      if (!blockAppliesOn(b, now)) continue;
      const s = at(now, b.start), e = at(now, b.end);
      if (now >= s && now < e) return { ...b, startAt: s, endAt: e };
    }
    return null;
  }

  function nextBlock(schedule, now) {
    for (let i = 0; i < 8; i++) {
      const day = addDays(now, i);
      if (!inRange(schedule, day)) continue;
      const cands = effectiveBlocks(schedule).filter((b) => blockAppliesOn(b, day))
        .map((b) => ({ ...b, startAt: at(day, b.start), endAt: at(day, b.end) }))
        .filter((b) => b.startAt > now).sort((a, b) => a.startAt - b.startAt);
      if (cands.length) return cands[0];
    }
    return null;
  }

  function computeState(schedule, store, now) {
    const today = ymd(now);
    const settings = Object.assign({ earnMode: true }, store.settings || {});
    const active = inRange(schedule, now);
    const block = activeBlock(schedule, now);
    const pass = !!(store.pass && store.pass.until > now.getTime());
    const plan = PLAN[today] || null;
    const done = (store.done && store.done[today]) || {};
    const lockedFreeTime = active && !block && settings.earnMode && !!plan && !plan.noLock && !done.main;
    return {
      today, active, block, pass, plan, done, settings, lockedFreeTime,
      next: nextBlock(schedule, now),
      blocked: !pass && (!!block || lockedFreeTime),
    };
  }

  // ---- URL rules ----
  const IDS = Object.values(VIDEOS).map((v) => v[0]);
  const ID_ALT = IDS.join('|'); // '-' and '_' are literal outside a character class
  const YT_RE = '^https?://([a-z0-9-]+\\.)*(youtube\\.com|youtu\\.be)/.*';
  const YT_ALLOW_RE = `^https?://((www|m)\\.)?youtube\\.com/(watch\\?([^#]*&)?v=(${ID_ALT})([&#].*)?$|playlist\\?|feed/playlists)|^https?://youtu\\.be/(${ID_ALT})`;
  // Chrome rejects a rule regex that compiles too big, so long word lists become several rules of a few words each.
  const chunk = (a, n) => (a.length ? [a.slice(0, n), ...chunk(a.slice(n), n)] : []);
  // Anime and manga sites (official and pirate): a word anywhere in the host, or at the start of a label (kaas.to)
  const ANIME_RES = [
    ...chunk(['anime', 'aniwatch', 'aniwave', 'anitaku', 'anix', 'kaido', 'zoro', 'crunchyroll', 'miruro', 'anikai', 'anicrush', 'aniplay',
      'anidap', 'anikoto', 'aniyae', 'anitube', 'otaku', 'samehadaku', 'subsplease', 'erai-raws', 'tokyoinsider', 'hentai', 'wcofun', 'cartoon',
      'manhwa', 'manhua', 'mangadex', 'mangakakalot', 'manganato', 'manganelo', 'mangafire', 'mangapark', 'mangasee', 'mangareader', 'readmanga',
      'mangabuddy', 'mangaowl', 'mangahere', 'mangatown', 'mangago', 'manga4life', 'asurascan', 'asuracomic', 'reaperscans', 'flamescans',
      'toonily', 'comick'], 6)
      .map((w) => `^https?://[^/]*(${w.join('|')})[^/]*/.*`),
    `^https?://([^/]*\\.)?(kaas|9anime)[^/]*/.*`,
  ];
  // Movie/TV streaming and piracy sites by name: a word anywhere in the host, or at the start of a label (dulo.gd, yts.mx, not "modulo")
  const STREAM_RES = [
    ...chunk(['movie', 'flix', 'film', 'tvshow', 'watchseries', 'soap2day', 'putlocker', 'primewire', 'cineb', 'hdtoday', 'hurawatch', 'tinyzone',
      'vumoo', 'dramacool', 'kissasian', 'kisscartoon', 'wcostream', 'iptv', 'torrent', '1337x', 'piratebay', 'rarbg', 'hdhub4u', 'bolly4u',
      'tamilmv', 'tamilrockers', 'tamilblasters', 'isaimini', 'mkvcinemas', 'worldfree4u', 'khatrimaza', 'streameast', 'crackstreams', 'sportsurge'], 6)
      .map((w) => `^https?://[^/]*(${w.join('|')})[^/]*/.*`),
    `^https?://([^/]*\\.)?(dulo|yts|nyaa|gogo|vidsrc|2embed)[^/]*/.*`,
  ];
  // Video hosts that pirate sites embed their players from (label is the name, digits allowed). The sites' domains rotate; these mostly don't.
  const EMBED_RES = chunk(['vidsrc', 'vidplay', 'vidlink', 'vidcloud', 'vidmoly', 'vidhide', 'vidguard', 'vidstream', 'megacloud', 'rabbitstream',
    'dokicloud', 'streamtape', 'streamwish', 'streamsb', 'filemoon', 'mixdrop', 'upstream', 'lulustream', 'dood', 'doods', 'd0+d', 'ds2play', 'voe',
    '2embed', 'autoembed', 'multiembed', 'embedsu', 'smashystream', 'kwik', 'mcloud', 'vixcloud',
    // anime players
    'rapid-cloud', 'vidstreaming', 'gogoplay', 'gogocdn', 'playtaku', 'embtaku', 'mp4upload', 'streamlare', 'filelions', 'vidwish', 'awish',
    'dwish', 'alions', 'streamhg', 'megaplay'], 6)
    .map((w) => `^https?://([^/]*\\.)?(${w.join('|')})[0-9]*\\.[^/]*/.*`);
  // Never judged by content (study, search and reference sites that talk about films and episodes)
  const SAFE_HOST_RE = /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|wikipedia\.org|imdb\.com|reddit\.com|github\.com|stackoverflow\.com|notion\.so|chatgpt\.com|openai\.com|claude\.ai|anthropic\.com|ielts\.org|ielts\.idp\.com|idp\.com|britishcouncil\.[a-z.]+|cambridge\.org|cambridgeenglish\.org)$/i;

  const isAllowedYouTube = (url) => new RegExp(YT_ALLOW_RE, 'i').test(url);
  const isYouTube = (url) => new RegExp(YT_RE, 'i').test(url);
  const isAnime = (url) => ANIME_RES.some((re) => new RegExp(re, 'i').test(url));
  const isStream = (url) => STREAM_RES.some((re) => new RegExp(re, 'i').test(url));
  const isEmbed = (url) => EMBED_RES.some((re) => new RegExp(re, 'i').test(url));
  const isSafeHost = (host) => SAFE_HOST_RE.test(host);

  // Unknown domains: does the page itself read like a free movie/TV/anime site? Each distinct sign is a point.
  const STREAM_BRANDS = /\b(dulo|123movies|fmovies|soap2day|putlocker|solarmovie|yesmovies|gomovies|lookmovie|myflixer|flixhq|sflix|hdtoday|hurawatch|primewire|braflix|cineb|dramacool|kissasian|hianime|gogoanime|9anime|aniwatch|kissanime|animepahe|vegamovies|filmyzilla|filmywap|hdhub4u|moviesflix|tamilmv|tamilrockers|tamilblasters|isaimini|bolly4u|mkvcinemas|animekai|kickassanime|animesuge|miruro|anitaku|animeflv|jkanime|otakudesu|samehadaku|zoro\.to|mangadex|mangakakalot|manganato|mangafire|asura\s?scans)\b/i;
  const STREAM_SIGNS = [
    /\bwatch\s+(free\s+)?(movies|films|tv|series|anime|shows|cartoons|k-?dramas?)\b/i,
    /\bfree\s+(movies|films|streaming|anime|tv|series|shows)\b/i,
    /\b(movies|films)\s*(&|and|,|\/|\|)\s*(tv|series|shows)\b/i,
    /\b(stream(ing)?|watch)\b[^.|]{0,40}\b(online|in hd|hd|4k|1080p)\b/i,
    /\biptv\b/i,
    /\blive tv\b/i,
    /\b(sub|dub)(bed)?\b[^.|]{0,40}\bep(isode)?s?\b|\bepisode\s+\d+/i,
    /\b(english|eng)\s+(sub|dub)\b|\bsub\s*(&|and|\/)\s*dub\b/i,
    /\bseason\s+\d+\b|\bs\d{1,2}\s?e\d{1,3}\b/i,
    /\bno\s+(sign\s?-?up|registration|account)\b/i,
    /\b(download|watch)\b[^.|]{0,20}\b(480p|720p|1080p|2160p)\b/i,
    /\b(web-?dl|hdrip|bluray|brrip|camrip|dvdrip|dual audio|x264|x265)\b/i,
    /\banime\b[^.|]{0,20}\b(online|free|list|schedule|sub|dub|movies)\b|\b(ongoing|airing|completed)\s+anime\b/i,
    /\bread\s+(manga|manhwa|manhua|webtoons?)\b/i,
    /\b(manga|manhwa|manhua)\s+(online|free|list|updates?)\b/i,
    /\bchapter\s+\d{2,}\b/i,
  ];
  const STREAM_MIN = 3;
  // page: { title, text (meta + headings + nav, joined with ' | '), frames: [iframe src], bigVideo }
  function streamScore(page) {
    const t = `${page.title || ''} | ${page.text || ''}`;
    let n = STREAM_SIGNS.filter((re) => re.test(t)).length;
    if (STREAM_BRANDS.test(t)) n += 2;
    if ((page.frames || []).some(isEmbed)) n += 3;
    if (page.bigVideo) n += 1;
    return n;
  }

  // learned: hostnames the page check flagged before (blocked by name from then on)
  function dnrRules(blockedPageUrl, learned = []) {
    return [
      { id: 1, priority: 1, action: { type: 'redirect', redirect: { regexSubstitution: blockedPageUrl + '?site=youtube#\\0' } },
        condition: { regexFilter: YT_RE, resourceTypes: ['main_frame'] } },
      ...ANIME_RES.map((re, i) => ({ id: 300 + i, priority: 1, action: { type: 'redirect', redirect: { regexSubstitution: blockedPageUrl + '?site=anime#\\0' } },
        condition: { regexFilter: re, resourceTypes: ['main_frame'] } })),
      ...STREAM_RES.map((re, i) => ({ id: 100 + i, priority: 1, action: { type: 'redirect', redirect: { regexSubstitution: blockedPageUrl + '?site=stream#\\0' } },
        condition: { regexFilter: re, resourceTypes: ['main_frame'] } })),
      // Players embedded from known video hosts don't load, whatever site they sit on
      ...EMBED_RES.map((re, i) => ({ id: 200 + i, priority: 1, action: { type: 'block' },
        condition: { regexFilter: re, resourceTypes: ['main_frame', 'sub_frame', 'media', 'xmlhttprequest'] } })),
      ...(learned.length ? [{ id: 7, priority: 1, action: { type: 'redirect', redirect: { regexSubstitution: blockedPageUrl + '?site=stream#\\0' } },
        condition: { regexFilter: '^https?://.*', requestDomains: learned, resourceTypes: ['main_frame'] } }] : []),
      // Allow rules use plain urlFilters: one combined regex is over Chrome's 2KB regex limit.
      { id: 3, priority: 2, action: { type: 'allow' },
        condition: { urlFilter: '||youtube.com/playlist?', resourceTypes: ['main_frame'] } },
      { id: 4, priority: 2, action: { type: 'allow' },
        condition: { urlFilter: '||youtube.com/feed/playlists', resourceTypes: ['main_frame'] } },
      ...IDS.map((vid, i) => ({ id: 10 + i, priority: 2, action: { type: 'allow' },
        condition: { urlFilter: `v=${vid}`, requestDomains: ['youtube.com'], resourceTypes: ['main_frame'], isUrlFilterCaseSensitive: true } })),
      ...IDS.map((vid, i) => ({ id: 40 + i, priority: 2, action: { type: 'allow' },
        condition: { urlFilter: `||youtu.be/${vid}`, resourceTypes: ['main_frame'], isUrlFilterCaseSensitive: true } })),
    ];
  }

  // IELTS overall: mean of 4, .25 rounds up to .5, .75 rounds up to the next band
  function ieltsOverall(l, r, w, s) {
    const x = (l + r + w + s) / 4, f = Math.floor(x), frac = x - f;
    return frac < 0.25 ? f : frac < 0.75 ? f + 0.5 : f + 1;
  }

  function streak(store, now) {
    const done = store.done || {};
    let d = new Date(now), n = 0;
    if (!(done[ymd(d)] && done[ymd(d)].main)) d = addDays(d, -1);
    while (PLAN[ymd(d)] && done[ymd(d)] && done[ymd(d)].main) { n++; d = addDays(d, -1); }
    return n;
  }

  root.FOCUS = { VIDEOS, LINKS, MORNING, PLAN, WEEK_TITLES, DOW, ymd, hm, at, addDays, activeBlock, nextBlock, effectiveBlocks,
    computeState, dnrRules, isAllowedYouTube, isYouTube, isAnime, isStream, isEmbed, isSafeHost, streamScore, STREAM_MIN, ieltsOverall, streak,
    videoUrl: (n) => `https://www.youtube.com/watch?v=${VIDEOS[n][0]}` };
})(typeof self !== 'undefined' ? self : globalThis);
