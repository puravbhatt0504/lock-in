// Original Speaking sets: p1 = Part 1 questions, card = [task, points…, final line], follow = Part 2 follow-up, p3 = Part 3 questions.
const SETS = [
  { p1: ['Do you work or are you a student?', 'Why did you choose that subject?', 'What do you like most about it?',
    'What is the weather usually like where you live?', 'Do you prefer hot or cold weather? Why?', 'Does the weather ever affect your mood?',
    'How often do you listen to music?', 'Did you learn a musical instrument as a child?', 'Is there any kind of music you dislike?'],
    card: ['Describe a place you visited that was very crowded.', 'where it was', 'when you went there', 'why it was so crowded', 'and explain how you felt about being there.'],
    follow: 'Would you go there again?',
    p3: ['Why do people enjoy crowded events such as festivals and concerts?', 'What problems does overcrowding cause in big cities?', 'How could governments reduce crowding on public transport?',
      'Do you think cities will become more or less crowded in the future? Why?', 'Is it better to grow up in a city or in the countryside?'] },
  { p1: ['Where is your hometown?', 'What do you like about living there?', 'Has your hometown changed much in recent years?',
    'Do you enjoy reading?', 'What kind of things do you read?', 'Do you prefer printed books or reading on a screen?',
    'Are you a morning person?', 'What do you usually do in the morning?', 'Has your morning routine changed since you were a child?'],
    card: ['Describe a person who helped you achieve something important.', 'who this person is', 'what you achieved', 'how they helped you', 'and explain why their help mattered to you.'],
    follow: 'Have you thanked this person?',
    p3: ['Who do young people look up to most in your country?', 'Are teachers or parents more important in shaping a child’s success?', 'Do famous people have a responsibility to set a good example?',
      'Why are some people more willing than others to help strangers?', 'Has it become harder for people to get help from their community?'] },
  { p1: ['Do you live in a house or a flat?', 'Which room do you spend the most time in?', 'Would you like to move somewhere else in the future?',
    'Do you like cooking?', 'What did you eat as a child that you still enjoy?', 'Do people in your country often eat out?',
    'How much time do you spend on your phone each day?', 'What do you use your phone for most?', 'Could you live without a smartphone for a week?'],
    card: ['Describe a time when you changed your mind about something.', 'what you changed your mind about', 'what you thought before', 'what made you change your mind', 'and explain how you felt about the change.'],
    follow: 'Do you often change your mind?',
    p3: ['What kinds of decisions do young people find most difficult?', 'How much does advertising influence the choices people make?', 'Do older people change their opinions less easily than younger people? Why?',
      'Has social media made people’s opinions more extreme?', 'Is changing your mind a sign of weakness or of strength?'] },
  { p1: ['What subject are you studying, or what work do you do?', 'What is the most difficult part of it?', 'What would you like to do in five years’ time?',
    'Do you play any sports?', 'Which sports are popular in your country?', 'Did you do much sport at school?',
    'Where did you go on your last holiday?', 'Do you prefer relaxing holidays or active ones?', 'Do you like to plan holidays in detail?'],
    card: ['Describe a piece of technology that you find difficult to use.', 'what it is', 'how often you use it', 'what makes it difficult', 'and explain how you think it could be made easier to use.'],
    follow: 'Do your friends find it difficult too?',
    p3: ['Why do some older people find new technology difficult?', 'Should schools spend more time teaching children to use technology?', 'Are people too dependent on technology today?',
      'Which jobs do you think will be done by machines in the future?', 'Does technology bring families closer together or push them apart?'] },
];
const N = Math.min(Math.max(+new URLSearchParams(location.search).get('n') || 1, 1), SETS.length);
const S = SETS[N - 1];
const $ = (id) => document.getElementById(id);
document.title = `Speaking set ${N} · IELTS practice`;
$('title').textContent = `Speaking set ${N}`;
$('pick').innerHTML = SETS.map((_, i) => `<button data-n="${i + 1}" aria-selected="${i + 1 === N}">${i + 1}</button>`).join(' ');
$('pick').onclick = (e) => { if (e.target.dataset.n) location.search = '?n=' + e.target.dataset.n; };
const [task, ...rest] = S.card;
$('card').innerHTML = `<p><b>${task}</b></p><p>You should say:</p><ul>${rest.slice(0, -1).map((p) => `<li>${p}</li>`).join('')}</ul><p>${rest[rest.length - 1]}</p>`;

// The examiner's voice: an English (preferably British) speech voice, as in the Listening tests.
const synth = window.speechSynthesis;
const say = (text) => new Promise((res) => {
  if (!synth) return res();
  synth.cancel();
  const en = synth.getVoices().filter((v) => /^en/i.test(v.lang)), v = en.find((x) => /en-GB/i.test(x.lang)) || en[0];
  const u = new SpeechSynthesisUtterance(text);
  if (v) { u.voice = v; u.lang = v.lang; }
  u.rate = 0.95; u.onend = u.onerror = () => res();
  synth.speak(u);
});

// Questions stay hidden until asked, as in the real test.
function asker(list, ol, btn) {
  let i = 0;
  $(btn).onclick = () => {
    const items = $(ol).children;
    if (i) items[i - 1].className = 'done';
    if (i === list.length) { $(btn).disabled = true; $(btn).textContent = 'Part finished'; return; }
    const li = document.createElement('li');
    li.textContent = list[i]; li.className = 'now';
    $(ol).append(li);
    say(list[i++]);
  };
}
asker(S.p1, 'p1', 'ask1');
asker(S.p3, 'p3', 'ask3');

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
  $('prep').disabled = true;
  await say('Here is your topic. You have one minute to prepare. You can make some notes.');
  $('status').textContent = 'Make notes: one or two words per point.';
  await countdown(60, 'Prepare');
  await say('Please start speaking now. Talk for up to two minutes.');
  $('status').textContent = 'Keep talking until the beep. Cover every point on the card.';
  await countdown(120, 'Talk');
  $('clock').textContent = '';
  $('status').textContent = 'Time.';
  $('follow').innerHTML = `Examiner’s follow-up: <i>${S.follow}</i>`;
  await say('Thank you. ' + S.follow);
};
