
/* ---------- content ---------- */
const TF = ['TRUE', 'FALSE', 'NOT GIVEN'], YN = ['YES', 'NO', 'NOT GIVEN'];

const LISTENING = [
  { title: 'Part 1', script: [
    ['N', 'Part 1. You will hear a telephone conversation between a man and a receptionist at an adult education centre. First, you have some time to look at questions 1 to 5.'],
    ['P', 30, 'Look at questions 1 to 5'],
    ['N', 'Now listen carefully and answer questions 1 to 5.'],
    ['W', 'Good afternoon, Westbrook Adult Education Centre, Anita speaking.'],
    ['M', "Hello. I'd like to enrol on one of your evening courses, please."],
    ['W', 'Certainly. Can I start with your name?'],
    ['M', 'James Whitlock.'],
    ['W', 'Could you spell your surname for me?'],
    ['M', "Yes, it's W. H. I. T. L. O. C. K."],
    ['W', 'Thank you. And which course are you interested in?'],
    ['M', "Well, I was hoping to do Spanish for beginners, but I saw on your website that it's already full."],
    ['W', "I'm afraid so. There's a waiting list, but it's quite long."],
    ['M', "In that case I'll go for beginners' photography. I've just bought a new camera and I don't really know how to use it."],
    ['W', 'Good idea. The photography course runs on two evenings. The Tuesday group is full, but there are still places on Thursdays.'],
    ['M', "Thursday's fine."],
    ['W', 'The course starts on the fourteenth of January and runs for ten weeks.'],
    ['M', 'The fourteenth. OK.'],
    ['W', "And the classes are held in room B12. That's in the main building, on the ground floor."],
    ['N', 'Before you hear the rest of the conversation, you have some time to look at questions 6 to 10.'],
    ['P', 30, 'Look at questions 6 to 10'],
    ['N', 'Now listen and answer questions 6 to 10.'],
    ['W', 'Now, the fee. The full price is a hundred and fifty pounds. Do you qualify for any discounts? We offer them to students and to council employees.'],
    ['M', 'Actually, I work for the council, in the planning department.'],
    ['W', "Then you get twenty percent off, so that's a hundred and twenty pounds."],
    ['M', "That's great."],
    ['W', "You'll need to bring your own digital camera, of course. You don't need an expensive lens, but the tutor does ask everyone to bring a tripod, because there's a night photography session in week six."],
    ['M', "I don't have one of those, but I can borrow my brother's."],
    ['W', "How would you like to pay? We can't take cards over the phone, so it's either a cheque or a bank transfer."],
    ['M', "A bank transfer, please. I don't have a cheque book any more."],
    ['W', "I'll email you our bank details. And can I ask how you heard about the course? We like to know which advertising works."],
    ['M', 'I looked at your website afterwards, but I first saw the advert in the local newspaper.'],
    ['W', "Thanks, that's useful. Oh, and one more thing: parking. The car park in front of the centre is for staff only, but you can park free after six in the car park behind the library."],
    ['M', 'Behind the library. Great. Thanks for your help.'],
    ['W', "You're welcome. See you in January."],
    ['N', 'That is the end of Part 1.'],
  ], groups: [
    { t: 'Questions 1–10', i: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', head: 'Westbrook Adult Education Centre · Enrolment form', items: [
      [1, 'Name: James ___', ['whitlock']],
      [2, 'Course: beginners’ ___', ['photography']],
      [3, 'Day: ___ evenings', ['thursday', 'thursdays']],
      [4, 'First class: ___ January', ['14', '14th', 'fourteenth', 'the 14th']],
      [5, 'Room: ___', ['b12', 'b 12', 'room b12']],
      [6, 'Fee after discount: £___', ['120', 'a hundred and twenty', 'one hundred and twenty']],
      [7, 'Must bring: a digital camera and a ___', ['tripod']],
      [8, 'Payment by: ___', ['bank transfer', 'transfer']],
      [9, 'Heard about the course from: the local ___', ['newspaper', 'paper']],
      [10, 'Free parking after 6 p.m. in the car park behind the ___', ['library']],
    ] },
  ] },
  { title: 'Part 2', script: [
    ['N', 'Part 2. You will hear a talk by the education officer at Harbourside Museum, which has recently reopened. First, you have some time to look at questions 11 to 14.'],
    ['P', 30, 'Look at questions 11 to 14'],
    ['N', 'Now listen carefully and answer questions 11 to 14.'],
    ['W', "Good morning, and thank you for coming to the reopening of Harbourside Museum. I'm Claire Benson, the museum's education officer."],
    ['W', "As many of you know, we've been closed for eighteen months. A lot of people assumed this was because of the storm that damaged our roof two winters ago, but in fact that was repaired within a few weeks. The real reason for the closure was the building of our new east wing, which has almost doubled the space we have for displays."],
    ['W', "I'm pleased to say that entry is still free for children. Adults are normally charged eight pounds, but if you live in the borough, entry is completely free. You just need to bring something showing your address the first time you visit."],
    ['W', 'The gold coins from the shipwreck have had a lot of attention in the press, but we actually expect the reconstructed Viking boat to draw the biggest crowds, because for the first time visitors will be able to climb aboard it.'],
    ['W', "We've also replaced our old audio guide. Instead of borrowing a handset at the desk, you can now download the guide as an app onto your own phone. It's free, and it's available in English and French at the moment, with Spanish and German coming next year."],
    ['N', 'Now look at questions 15 to 20.'],
    ['P', 20, 'Look at questions 15 to 20'],
    ['N', 'Now listen and answer questions 15 to 20.'],
    ['W', "Let me explain where everything is now, because the layout has changed quite a lot. The gift shop has stayed where it was, on the ground floor, just inside the main entrance. The ground floor is also where you'll find the children's activity room, which used to be upstairs. We moved it down so that families with pushchairs don't need to use the lift."],
    ['W', "The café used to be on the ground floor too, but it's moved up to the second floor, where there are wonderful views over the harbour."],
    ['W', "On the first floor, you'll find the shipwreck gallery, with the gold coins I mentioned. The map room is also on the first floor, next to the shipwreck gallery, so you can see the routes the ships took."],
    ['W', "Finally, the second floor, as well as the café, has a space for temporary exhibitions. At the moment, it's showing a collection of paintings of ships by local artists."],
    ['N', 'That is the end of Part 2.'],
  ], groups: [
    { t: 'Questions 11–14', i: 'Choose the correct letter, A, B or C.', items: [
      [11, 'Why was the museum closed for eighteen months?', 'C', ['to repair damage caused by a storm', 'to install a new heating system', 'to build an extension']],
      [12, 'Adults can enter the museum free of charge if they', 'B', ['visit on a weekday.', 'live in the borough.', 'are members of the museum.']],
      [13, 'Which exhibit does the speaker expect to be most popular?', 'A', ['the Viking boat', 'the gold coins', 'the ship paintings']],
      [14, 'The new audio guide', 'C', ['must be collected from the desk.', 'is available in four languages.', 'can be used on visitors’ own phones.']],
    ] },
    { t: 'Questions 15–20', i: 'Which floor of the museum is each of the following on? Write the correct letter, A, B or C. You may use any letter more than once.',
      box: 'A&nbsp; ground floor<br>B&nbsp; first floor<br>C&nbsp; second floor',
      sel: ['A', 'B', 'C'], items: [
      [15, 'gift shop', 'A'], [16, 'children’s activity room', 'A'], [17, 'café', 'C'], [18, 'gold coins', 'B'], [19, 'map room', 'B'], [20, 'paintings of ships', 'C'],
    ] },
  ] },
  { title: 'Part 3', script: [
    ['N', 'Part 3. You will hear a student called Arjun talking to his tutor, Doctor Hall, about his dissertation. First, you have some time to look at questions 21 to 24.'],
    ['P', 30, 'Look at questions 21 to 24'],
    ['N', 'Now listen carefully and answer questions 21 to 24.'],
    ['W', 'Come in, Arjun. So, how is the dissertation going?'],
    ['M', "Mostly well, thanks. I've finally settled on a topic: food waste in the university canteens."],
    ['W', 'What made you choose that in the end?'],
    ['M', "I did think about household food waste, because there's much more research on it. But getting into people's homes would be really difficult, whereas the canteen manager has already agreed to let me collect data. So that made the decision for me."],
    ['W', "Sensible. How's the literature review coming along?"],
    ['M', "I've found quite a lot on the causes of food waste, but almost all of it is about hospitals and schools. There's hardly anything on universities."],
    ['W', "Don't see that as a problem. That's exactly the gap your study fills, so make it clear in your introduction."],
    ['M', "Oh, OK. That's encouraging."],
    ['W', 'And how are you planning to collect your data?'],
    ['M', 'My plan was to weigh the waste from every meal for a whole term.'],
    ['W', "That's very ambitious, on top of your other courses. I'd suggest two separate weeks, one in October and one in February, perhaps. You'd still have plenty of data, and you could compare the two periods."],
    ['M', "That makes sense. I'm also planning a questionnaire about why students leave food. I thought I'd hand out paper forms in the canteen, so people fill them in while they're eating."],
    ['W', "The trouble with that is that people sitting together will influence each other's answers. An online questionnaire that people complete on their own would give you more reliable data."],
    ['M', "Right, I'll do it online, then."],
    ['N', 'Now look at questions 25 to 30.'],
    ['P', 20, 'Look at questions 25 to 30'],
    ['N', 'Now listen and answer questions 25 to 30.'],
    ['W', "Let's go through the steps in order. Before you collect any data at all, you need approval from the university's ethics committee, because you're surveying people."],
    ['M', 'Even for an anonymous questionnaire?'],
    ['W', "Yes, even then. It usually takes about three weeks. After that, pilot your questionnaire before you use it properly. I'd try it out on the canteen staff first. They know the menu, so they'll spot any questions that are confusing."],
    ['M', 'Good idea. Then the weighing. I was going to use the kitchen scales.'],
    ['W', "They're not accurate enough for research. The biology department has digital scales that they lend to students. Ask the technician."],
    ['M', 'OK. And when I weigh it, should I just record the total?'],
    ['W', 'No, sort it into categories first. Plate waste, which is what students leave; preparation waste, like peelings; and unsold food, meaning meals that were cooked but never served. They have very different causes.'],
    ['M', "Right. Then I'll need some statistics software for the analysis."],
    ['W', "Honestly, for this kind of data, a spreadsheet will be fine. Don't spend weeks learning a new program."],
    ['M', "That's a relief. And at the end?"],
    ['W', "I'd strongly recommend presenting your findings to the canteen manager. They've helped you, and they might actually make changes based on what you find."],
    ['N', 'That is the end of Part 3.'],
  ], groups: [
    { t: 'Questions 21–24', i: 'Choose the correct letter, A, B or C.', items: [
      [21, 'Why did Arjun choose to study canteens rather than households?', 'A', ['He could get access to data more easily.', 'There is more research on canteens.', 'He used to work in catering.']],
      [22, 'What does the tutor say about the lack of research on universities?', 'C', ['He should include schools in his study.', 'He should search for more sources.', 'It shows why his study is needed.']],
      [23, 'What does the tutor recommend about collecting data?', 'B', ['weighing waste after every meal for a term', 'collecting data in two separate weeks', 'asking students to weigh their own waste']],
      [24, 'What problem does the tutor see with paper questionnaires?', 'A', ['Students might influence each other.', 'Few students would complete them.', 'They would be expensive to print.']],
    ] },
    { t: 'Questions 25–30', i: 'Complete the flow-chart below. Write ONE WORD ONLY for each answer.', head: 'Arjun’s research plan', items: [
      [25, 'Get approval from the university’s ___ committee', ['ethics']],
      [26, '↓ Pilot the questionnaire with the canteen ___', ['staff']],
      [27, '↓ Borrow digital scales from the ___ department', ['biology']],
      [28, '↓ Sort waste into plate waste, preparation waste and ___ food', ['unsold']],
      [29, '↓ Analyse the data using a ___', ['spreadsheet']],
      [30, '↓ Present the findings to the canteen ___', ['manager']],
    ] },
  ] },
  { title: 'Part 4', script: [
    ['N', 'Part 4. You will hear a lecture about urban heat islands. First, you have some time to look at questions 31 to 40.'],
    ['P', 45, 'Look at questions 31 to 40'],
    ['N', 'Now listen carefully and answer questions 31 to 40.'],
    ['M', "In today's lecture, I'm going to look at what are known as urban heat islands. The term describes the way that cities are often noticeably warmer than the countryside around them. The difference can be several degrees, and interestingly, it's usually greatest at night rather than during the day."],
    ['M', 'So what causes it? The first factor is the materials cities are built from. Asphalt and concrete absorb a great deal of heat from the sun during the day, and then release it slowly at night, which is why city nights stay so warm.'],
    ['M', 'The second factor is the lack of vegetation. Plants cool the air around them through evaporation, as water passes from their leaves into the atmosphere. Replace fields and trees with buildings and roads, and you lose that natural cooling.'],
    ['M', 'Third, the shape of the city matters. Tall buildings close together trap heat between them and reduce the wind that would otherwise carry it away.'],
    ['M', "And finally, there's the heat we produce ourselves: from vehicles, from industry, and, increasingly, from air conditioning units, which pump hot air out of buildings and into the street."],
    ['M', 'What are the effects? Higher temperatures increase the demand for energy in summer, as people use more air conditioning, which of course produces even more heat. More seriously, there are effects on health. During heatwaves, death rates in cities rise sharply, and elderly people are particularly at risk. Heat also worsens air quality, because it speeds up the formation of ozone at ground level, which can cause breathing problems.'],
    ['M', 'Fortunately, there are a number of solutions. One of the simplest is the so-called cool roof. Roofs painted white reflect much more sunlight than dark ones, and can reduce the temperature inside the building as well. Planting trees along streets is also very effective, because trees provide shade as well as cooling the air.'],
    ['M', "A well-known example is the city of Medellín in Colombia, which created a network of green corridors: planted streets and waterways connecting the city's parks. These have been reported to reduce local temperatures by around two degrees."],
    ['M', 'Finally, some cities are experimenting with permeable pavements, which allow rainwater to soak through rather than running off. The water then evaporates on hot days and cools the surface.'],
    ['N', 'That is the end of the Listening test.'],
  ], groups: [
    { t: 'Questions 31–40', i: 'Complete the notes below. Write ONE WORD ONLY for each answer.', head: 'Urban heat islands', items: [
      [31, 'The temperature difference is usually greatest at ___', ['night']],
      [32, 'Causes: asphalt and ___ absorb heat during the day', ['concrete']],
      [33, 'Plants cool the air through ___', ['evaporation']],
      [34, 'Tall buildings trap heat and reduce the ___', ['wind']],
      [35, 'Heat comes from vehicles, industry and air ___ units', ['conditioning']],
      [36, 'Effects: in heatwaves, ___ people are particularly at risk', ['elderly', 'old', 'older']],
      [37, 'Heat speeds up the formation of ground-level ___', ['ozone']],
      [38, 'Solutions: roofs painted ___ reflect sunlight', ['white']],
      [39, 'Medellín created green ___ that reduced local temperatures', ['corridors']],
      [40, '___ pavements let rainwater soak through', ['permeable']],
    ] },
  ] },
];

const READING = [
  { title: 'Reading Passage 1 · The humble pencil', hint: 'Spend about 20 minutes on Questions 1–13.', text: [
    'For a tool so ordinary, the pencil has a surprisingly dramatic history. Its story begins in the 1500s in Borrowdale, a valley in the north-west of England, where a large deposit of an unusually pure, solid form of graphite was discovered. Local shepherds soon found that the soft, black material was ideal for marking their sheep, and it was not long before people began cutting it into sticks for writing and drawing.',
    'At the time, nobody understood what the substance was. Because it left a grey mark similar to that made by lead, it was widely believed to be a kind of lead, and it was known as "plumbago", from the Latin word for lead ore. Only in the late eighteenth century did chemists show that it was in fact a form of carbon. By then, however, the name had stuck, and even today the core of a pencil is commonly called its "lead", although pencils have never contained any.',
    'The Borrowdale graphite quickly became extremely valuable, not least because it was used to line the moulds in which cannonballs were made. The mine was guarded, and supply was deliberately restricted to keep prices high; in the eighteenth century, stealing graphite was made a serious criminal offence. For about two centuries, England had a near-monopoly on high-quality pencils, as no other known deposit was pure enough to be cut directly into sticks.',
    'That monopoly was broken by war. In the 1790s, France was at war with Britain and could no longer import English graphite. The French government asked Nicolas-Jacques Conté, an engineer and inventor, to find an alternative. Conté’s solution, patented in 1795, was to grind lower-quality graphite into a powder, mix it with clay and water, form the mixture into thin rods and heat them in a kiln. The method had an important advantage beyond simply using poorer graphite: by changing the proportion of clay, manufacturers could make pencils harder or softer. This is the origin of the grading system still printed on pencils today, in which H stands for hard and B for black.',
    'During the nineteenth century, pencil making became a major industry, particularly in Germany, where companies such as Faber built large factories, and later in the United States. Early pencils were often made by placing a graphite stick in a groove cut into a piece of wood and gluing a second piece on top, and this basic method is still used. Cedar became the preferred wood because it was soft enough to sharpen easily and did not split.',
    'Many pencils in North America are painted yellow, and the reason is often said to be a marketing decision. In the 1890s, the Austro-Hungarian company Koh-i-Noor painted its top-quality pencils yellow, a colour associated with China, which was believed at the time to produce the finest graphite. Other manufacturers copied the colour to suggest that their pencils were of similar quality, and yellow became the standard.',
    'Despite the arrival of computers and tablets, the pencil has survived remarkably well. Billions are still produced every year, and they remain popular with artists, engineers and carpenters. One reason is reliability: a pencil does not run out of ink, works in almost any temperature, and its marks can be erased. In this sense, the pencil is a rare example of a technology that reached its final form more than two hundred years ago.',
  ], groups: [
    { t: 'Questions 1–6', i: 'Do the following statements agree with the information given in Reading Passage 1? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.', sel: TF, items: [
      [1, 'The Borrowdale graphite was used for marking animals before it was used for writing.', 'TRUE'],
      [2, 'In the late eighteenth century, chemists proved that graphite contained lead.', 'FALSE'],
      [3, 'Graphite had a military use.', 'TRUE'],
      [4, 'Anyone was allowed to take graphite from the Borrowdale mine.', 'FALSE'],
      [5, 'Conté’s pencils were more expensive than English pencils.', 'NOT GIVEN'],
      [6, 'Most yellow pencils today are made in China.', 'NOT GIVEN'],
    ] },
    { t: 'Questions 7–10', i: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer.', items: [
      [7, 'Conté mixed powdered graphite with ___ and water.', ['clay']],
      [8, 'The rods were then heated in a ___.', ['kiln']],
      [9, 'In the pencil grading system, the letter B stands for ___.', ['black']],
      [10, '___ became the preferred wood for pencils because it was easy to sharpen.', ['cedar']],
    ] },
    { t: 'Questions 11–13', i: 'Answer the questions below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', items: [
      [11, 'Apart from the United States, which country developed a major pencil industry in the nineteenth century? ___', ['germany']],
      [12, 'Which company first painted its best pencils yellow? ___', ['koh-i-noor', 'kohinoor', 'koh i noor']],
      [13, 'Which country was the colour yellow associated with? ___', ['china']],
    ] },
  ] },
  { title: 'Reading Passage 2 · Sleep and memory', hint: 'Spend about 20 minutes on Questions 14–26. Reading Passage 2 has six paragraphs, A–F.', letters: true, text: [
    'Every exam season, libraries stay open late and many students choose to study through the night, sacrificing sleep in the belief that extra hours of revision will improve their results. Yet a large body of research suggests that this strategy may backfire. Far from being wasted time, sleep appears to play a central role in turning new information into lasting memories.',
    'One of the earliest studies of sleep and memory was carried out in 1924 by two American psychologists, John Jenkins and Karl Dallenbach. They asked two students to learn lists of nonsense syllables and then tested them after intervals of one, two, four or eight hours, during which the students had either slept or stayed awake. The students remembered considerably more after sleeping. Jenkins and Dallenbach concluded that sleep simply protected memories from interference: while we are awake, new experiences constantly compete with what we have just learned, whereas during sleep nothing disturbs it. For decades, this passive view of sleep was widely accepted.',
    'Today, most researchers believe that sleep does something more active. According to the theory of memory consolidation, new memories are first stored temporarily in a small region of the brain called the hippocampus. During sleep, and particularly during the deep phase known as slow-wave sleep, these memories are gradually transferred to the cortex, where they are stored for the long term and linked with existing knowledge. In this view, sleep is less like a protective shelter than a busy filing office.',
    'Some of the strongest evidence for this idea comes from studies of animals. In 1994, Matthew Wilson and Bruce McNaughton recorded the activity of individual neurons in the hippocampus of rats as the animals explored a maze. Particular cells fired when a rat was in particular locations. When the researchers later recorded the same cells while the rats slept, they found that the patterns of activity seen in the maze were repeated, as though the animals were replaying their experience. Later studies showed that this replay often happens many times faster than the original experience.',
    'Researchers have also tried to influence this process in humans. In a 2007 study, Björn Rasch and his colleagues asked volunteers to learn the locations of pairs of cards on a screen while the smell of roses was released into the room. Later, while the volunteers slept, the researchers released the same smell again. When it was presented during slow-wave sleep, the volunteers remembered the card locations significantly better the next day. When it was presented during another stage of sleep, or while they were awake, it had no such effect.',
    'What does this mean for students? First, sleep after learning seems to matter as much as the learning itself; even a daytime nap can produce measurable benefits. Second, losing sleep may cause damage in both directions: studies of sleep deprivation suggest that a night without sleep not only weakens memories of what was studied the day before but also reduces the brain’s ability to take in new information the following day. Not every finding in this field has been confirmed, and researchers still disagree about exactly what happens in different stages of sleep. But the overall message is consistent: a good night’s sleep may be one of the most effective study techniques available.',
  ], groups: [
    { t: 'Questions 14–18', i: 'Reading Passage 2 has six paragraphs, A–F. Which paragraph contains the following information? You may use any letter more than once.',
      sel: ['A', 'B', 'C', 'D', 'E', 'F'], items: [
      [14, 'an experiment involving animals', 'D'],
      [15, 'a reference to a common habit among students', 'A'],
      [16, 'an explanation of where memories are kept before and after sleep', 'C'],
      [17, 'a study in which a smell was used', 'E'],
      [18, 'an early explanation that was later replaced', 'B'],
    ] },
    { t: 'Questions 19–22', i: 'Match each finding with the correct researcher or researchers, A, B or C. You may use any letter more than once.',
      box: 'A&nbsp; Jenkins and Dallenbach<br>B&nbsp; Wilson and McNaughton<br>C&nbsp; Rasch and colleagues',
      sel: ['A', 'B', 'C'], items: [
      [19, 'Patterns of brain activity seen during learning are repeated during sleep.', 'B'],
      [20, 'A cue was effective only when presented during one stage of sleep.', 'C'],
      [21, 'People who slept after learning remembered more than those who stayed awake.', 'A'],
      [22, 'Recent experiences are replayed more quickly than they originally happened.', 'B'],
    ] },
    { t: 'Questions 23–26', i: 'Complete the summary using the list of words, A–H, below.',
      box: 'A&nbsp; active&nbsp;&nbsp; B&nbsp; passive&nbsp;&nbsp; C&nbsp; transferred&nbsp;&nbsp; D&nbsp; deleted<br>E&nbsp; reduce&nbsp;&nbsp; F&nbsp; improve&nbsp;&nbsp; G&nbsp; nap&nbsp;&nbsp; H&nbsp; meal',
      sel: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], items: [
      [23, 'Researchers now generally see sleep as playing an ______ role in memory, rather than simply protecting it.', 'A'],
      [24, 'New memories are held for a short time in the hippocampus and are later ______ to the cortex.', 'C'],
      [25, 'A night without sleep may ______ the ability to take in new information,', 'E'],
      [26, 'whereas even a daytime ______ can help.', 'G'],
    ] },
  ] },
  { title: 'Reading Passage 3 · Is the four-day week the future of work?', hint: 'Spend about 20 minutes on Questions 27–40.', text: [
    'For most of the twentieth century, the length of the working week fell steadily in industrialised countries, from around sixty hours at its beginning to around forty by its middle. Then, for several decades, progress largely stopped. Recently, however, the idea of a shorter week has returned, driven by concerns about stress and burnout and by a series of high-profile experiments with a four-day working week.',
    'The best known of these took place in the United Kingdom in 2022. Over six months, 61 companies, employing around 2,900 people, reduced working hours without reducing pay. The organisers used what they called the "100-80-100" model: employees received 100 per cent of their pay for working 80 per cent of their previous hours, in return for a commitment to maintain 100 per cent of their productivity. At the end of the trial, 56 of the 61 companies said they would continue with the shorter week, at least for the time being, and 18 said they had made the change permanent. Employees reported lower levels of stress and fewer days off sick, while company revenue stayed broadly the same.',
    'Earlier trials in Iceland, which ran between 2015 and 2019 and involved more than 2,500 public sector workers, produced similar findings. Hours were reduced, typically from 40 to 35 or 36 a week, and researchers reported that productivity was maintained or improved in most workplaces, while workers’ wellbeing increased. Following the trials, unions negotiated agreements that gave a large majority of Iceland’s workforce the right to shorten their hours.',
    'Supporters argue that these results show that much of the time spent at work is not productive. Shorter weeks, they say, force organisations to cut unnecessary meetings and focus on what matters, while rested employees work more efficiently. There are also wider benefits: less commuting, more time for family and community life and, some argue, an advantage in attracting and keeping staff.',
    'Critics, however, point to several weaknesses in the evidence. Companies that volunteer for a trial are likely to be those that expect it to succeed, and whose work is well suited to flexible arrangements; their experience may not be typical. Many of the measures used, such as reported stress levels, depend on what employees say about themselves, and workers who enjoy the new arrangement have an obvious reason to describe it positively. And while office-based businesses may be able to reorganise their work, it is harder to see how a hospital, a school or a bus company could cut hours without having to hire more people.',
    'It is also worth being clear about what a "four-day week" means, since the term is used for quite different arrangements. Some companies simply compress the same forty hours into four longer days, which gives employees a three-day weekend but can leave them more tired. Others genuinely reduce total hours. Still others give staff a shorter week only in certain months of the year. Comparing the results of such different approaches is difficult.',
    'In my view, the trials so far have shown something important, if limited: that for a significant number of organisations, a shorter week is workable and popular, and that fears of collapsing productivity are often exaggerated. They have not shown that it would work everywhere, and claims that the four-day week is the future of all work go well beyond the evidence. The most realistic outcome may be a gradual spread through the sectors best suited to it, rather than a sudden change in the law. Governments could usefully support further trials in sectors such as healthcare, where the challenges are greatest, rather than simply leaving the question to employers who are already enthusiastic.',
  ], groups: [
    { t: 'Questions 27–30', i: 'Choose the correct letter, A, B, C or D.', items: [
      [27, 'In the "100-80-100" model, employees', 'B', ['accepted a 20 per cent cut in pay.', 'kept their full pay for fewer hours if productivity was maintained.', 'worked the same hours over four days.', 'were paid according to their productivity.']],
      [28, 'At the end of the UK trial,', 'A', ['most companies wanted to continue with the shorter week.', 'all the companies made the change permanent.', 'revenue fell at most of the companies.', 'employees took more days off sick.']],
      [29, 'What does the writer say about the Iceland trials?', 'D', ['Productivity fell in most workplaces.', 'They involved private companies only.', 'Hours were reduced to 30 a week.', 'They led to agreements affecting many workers.']],
      [30, 'Which criticism of the trials does the writer mention?', 'C', ['The trials lasted too short a time.', 'Workers were secretly paid less.', 'The companies taking part may not be typical.', 'Too few countries took part.']],
    ] },
    { t: 'Questions 31–35', i: 'Do the following statements agree with the views of the writer in Reading Passage 3? Choose YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.', sel: YN, items: [
      [31, 'The trials have shown that a shorter week is practical for many organisations.', 'YES'],
      [32, 'The four-day week will soon become standard in all types of work.', 'NO'],
      [33, 'Manufacturing companies are the best suited to a four-day week.', 'NOT GIVEN'],
      [34, 'Decisions about shorter weeks should be left entirely to employers.', 'NO'],
      [35, 'Fears that productivity would fall have often been overstated.', 'YES'],
    ] },
    { t: 'Questions 36–40', i: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', head: 'Problems with the evidence', items: [
      [36, 'Critics argue that companies which ___ for trials probably expect them to succeed.', ['volunteer']],
      [37, 'Measures such as reported ___ depend on employees’ descriptions of themselves.', ['stress levels', 'stress']],
      [38, 'Organisations such as hospitals might have to ___ more people.', ['hire']],
      [39, 'Squeezing forty hours into four days may leave staff more ___.', ['tired']],
      [40, 'Because arrangements differ so much, comparing the ___ of different approaches is difficult.', ['results']],
    ] },
  ] },
];

const MODEL1 = `<p>The table compares how many hours per week teenagers in one country spent on five activities in 2010 and 2024.</p>
<p>Overall, screen-based activities grew considerably over the period, with social media showing by far the largest increase, while the time spent on sport and reading declined. Homework changed very little.</p>
<p>In 2010, homework took up the most time, at 9 hours a week, followed by sport (7 hours) and social media (6 hours). Video games and reading for pleasure accounted for 5 and 4 hours respectively.</p>
<p>By 2024, the picture had changed dramatically. Time on social media had tripled to 18 hours a week, making it easily the most time-consuming activity, and the hours spent playing video games also rose, from 5 to 8. In contrast, teenagers spent 2 fewer hours a week on sport, which fell to 5 hours, and reading for pleasure halved to just 2 hours. Homework, meanwhile, rose only slightly, from 9 to 10 hours.</p>
<p>As a result, the total time spent on these five activities increased from 31 to 43 hours a week.</p>`;

const MODEL2 = `<p>Rising rates of obesity, heart disease and diabetes have made public health a priority for governments around the world. Some argue that the solution is to provide more sports facilities, while others believe that different measures would be more effective. In my view, sports facilities have a role to play, but they are far from the most important part of the answer.</p>
<p>Those who favour building more facilities make a reasonable point. In many cities, especially in poorer neighbourhoods, there are few safe, affordable places to swim, play football or exercise, and people cannot be expected to stay active without them. A well-equipped local sports centre can also bring communities together and give young people an alternative to spending their free time in front of screens.</p>
<p>However, there is a strong case that facilities alone achieve little. The people who use gyms and sports centres are often those who are already fairly fit, while those most at risk of poor health may never visit them, whether because of long working hours, a lack of confidence or simply a lack of interest. Moreover, physical activity is only one factor in health. Diet has an enormous influence on conditions such as obesity and diabetes, and measures such as taxes on sugary drinks, clearer food labelling and better school meals can reach the whole population, not just the minority who choose to exercise.</p>
<p>For these reasons, I believe that governments would achieve more by combining several approaches. Building safe walking and cycling routes, for example, encourages activity as part of daily life rather than as a separate hobby, and health education can help people make better choices about what they eat.</p>
<p>In conclusion, although sports facilities are valuable, they are unlikely on their own to transform public health. A wider strategy focusing on diet, everyday activity and education is likely to be far more effective.</p>`;

const SPEAK1 = [
  ['Work or studies', ['Do you work, or are you a student?', 'What do you enjoy most about your studies?', 'Is there anything you would like to change about your course?', 'What do you plan to do after you finish your studies?']],
  ['Music', ['How often do you listen to music?', 'What kind of music do you like?', 'Did you learn to play a musical instrument as a child?', 'Do you prefer listening to music alone or with other people?']],
  ['Weekends', ['What did you do last weekend?', 'Do you prefer busy weekends or relaxing ones?', 'Are your weekends different now from when you were younger?', 'What would your ideal weekend be like?']],
];
const SPEAK3 = [
  ['Helping others', ['Why do some people find it difficult to ask for help?', 'Do you think people help each other less than they did in the past?', 'Should schools teach children to help others? How?']],
  ['Volunteering', ['What kinds of volunteer work are common in your country?', 'Should companies give employees paid time off to do volunteer work?', 'Some people think volunteering should be compulsory for young people. What is your opinion?']],
];

/* ---------- storage ---------- */
const KEY = 'ielts-mock-2';
let S = {};
try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
S.a = S.a || {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

/* ---------- rendering ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function renderGroup(g, sec) {
  let h = `<div class="grp"><div class="t">${g.t}</div><div class="i">${g.i}</div>`;
  if (g.box) h += `<div class="box">${g.box}</div>`;
  if (g.head) h += `<div style="font-weight:700;margin:6px 0">${g.head}</div>`;
  for (const it of g.items) {
    const [n, prompt] = it, id = sec + n, v = S.a[id] || '';
    h += `<div class="q" id="q-${id}"><span class="n">${n}</span>`;
    if (Array.isArray(it[2])) {            // gap fill
      const [pre, post] = prompt.split('___');
      h += `${esc(pre)}<input type="text" data-q="${id}" value="${esc(v)}" autocomplete="off" spellcheck="false" aria-label="Answer ${n}">${esc(post || '')}`;
    } else if (g.sel) {                    // select from a list
      h += `${esc(prompt)} <select data-q="${id}" aria-label="Answer ${n}"><option value=""></option>${g.sel.map((o) => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    } else {                               // multiple choice
      h += `${esc(prompt)}<div class="opts">${it[3].map((o, k) => { const L = 'ABCD'[k]; return `<label><input type="radio" name="${id}" data-q="${id}" value="${L}"${v === L ? ' checked' : ''}> <b>${L}</b>&nbsp; ${esc(o)}</label>`; }).join('')}</div>`;
    }
    h += `<span class="key"></span></div>`;
  }
  return h + '</div>';
}

$('lQs').innerHTML = LISTENING.map((p) => `<h3>${p.title}</h3>` + p.groups.map((g) => renderGroup(g, 'L')).join('')).join('');
$('rBody').innerHTML = READING.map((p) => `<h3>${p.title}</h3><p class="muted">${p.hint}</p><div class="split"><div class="passage">${
  p.text.map((t, k) => `<p>${p.letters ? `<b class="pl">${'ABCDEFG'[k]}</b>` : ''}${esc(t)}</p>`).join('')}</div><div>${p.groups.map((g) => renderGroup(g, 'R')).join('')}</div></div>`).join('');

document.addEventListener('input', (e) => { const q = e.target.dataset && e.target.dataset.q; if (q) { S.a[q] = e.target.value; save(); } });
document.addEventListener('change', (e) => { const q = e.target.dataset && e.target.dataset.q; if (q) { S.a[q] = e.target.value; save(); } });

/* ---------- marking ---------- */
const norm = (s) => String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[-–—]/g, ' ').replace(/^£/, '').replace(/\s+/g, ' ').trim().replace(/[.,]$/, '');
const BANDS = {
  L: [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]],
  R: [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]],
};
const band = (sec, raw) => BANDS[sec].find(([min]) => raw >= min)[1];

function mark(sec, data) {
  let raw = 0;
  for (const part of data) for (const g of part.groups) for (const it of g.items) {
    const id = sec + it[0], given = S.a[id] || '';
    const keys = Array.isArray(it[2]) ? it[2] : [it[2]];
    const ok = keys.some((k) => norm(k) === norm(given));
    raw += ok;
    const row = $('q-' + id);
    row.classList.remove('ok', 'bad'); row.classList.add(ok ? 'ok' : 'bad');
    row.querySelector('.key').textContent = ok ? '✓' : `✗  answer: ${keys[0]}`;
  }
  document.querySelectorAll(`[data-q^="${sec}"]`).forEach((el) => { el.disabled = true; });
  S[sec + 'raw'] = raw; S[sec + 'done'] = true; save();
  return raw;
}
function showScore(sec, el) {
  const raw = S[sec + 'raw'];
  $(el).innerHTML = `<div class="score">${raw} / 40 correct · about Band ${band(sec, raw).toFixed(1)}</div><p class="muted">Wrong answers are shown in red with the correct answer. For gap-fills, spelling and word limits count, just as in the real test.</p>`;
  renderResults();
}

/* ---------- timers ---------- */
let tick = null;
function countdown(secs, label, onEnd, el = $('clock')) {
  clearInterval(tick);
  const end = Date.now() + secs * 1000;
  const draw = () => {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    el.textContent = `${label} ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    if (!left) { clearInterval(tick); beep(); onEnd && onEnd(); }
  };
  draw(); tick = setInterval(draw, 250);
}
function beep() {
  try { const c = new AudioContext(), o = c.createOscillator(); o.connect(c.destination); o.frequency.value = 880; o.start(); o.stop(c.currentTime + 0.4); } catch (e) {}
}

/* ---------- listening audio (built-in speech voices) ---------- */
const synth = window.speechSynthesis;
let playing = false;
const FEMALE = /female|zira|hazel|susan|libby|sonia|maisie|mia|emma|aria|jenny|natasha|clara|catherine|karen|moira|tessa|samantha|serena|kate|fiona|heera|neerja|linda|eva/i;
function pickVoices() {
  const en = synth.getVoices().filter((v) => /^en/i.test(v.lang));
  const nat = (list) => list.filter((v) => /natural/i.test(v.name) && !/maisie/i.test(v.name));
  const pref = (list) => nat(list).find((v) => /en-GB/i.test(v.lang)) || nat(list)[0] || list.find((v) => /en-GB/i.test(v.lang)) || list[0];
  const fem = en.filter((v) => FEMALE.test(v.name)), mal = en.filter((v) => !FEMALE.test(v.name));
  const W = pref(fem) || pref(en), M = pref(mal) || pref(en);
  const N = nat(en).find((v) => v !== W && v !== M) || en.find((v) => v !== W && v !== M) || M || W;
  return { W, M, N };
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
function sayOne(text, voice, rate) {
  return new Promise((res) => {
    // Kept in window: Chromium can drop an unreferenced utterance and never fire onend.
    const u = window.__utter = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    let quiet = 0, done = false, w = 0;
    const end = () => { if (done) return; done = true; clearInterval(w); res(); };
    u.rate = rate; u.onend = u.onerror = end;
    synth.speak(u);
    w = setInterval(() => { quiet = synth.speaking || synth.pending ? 0 : quiet + 1; if (quiet >= 4) end(); }, 250);   // backup if onend never fires
  });
}
async function say(text, voice, rate) {
  // Speak sentence by sentence: Chrome cuts off long utterances on some voices.
  for (const s of text.match(/[^.!?]+[.!?]*/g) || [text]) { if (!playing) return; await sayOne(s.trim(), voice, rate); }
}
const wait = (secs, msg) => new Promise((res) => {
  const end = Date.now() + secs * 1000;
  const t = setInterval(() => {
    const left = Math.ceil((end - Date.now()) / 1000);
    $('status').textContent = `${msg}: ${left}s`;
    if (left <= 0 || !playing) { clearInterval(t); res(); }
  }, 200);
});
async function playFrom(start) {
  if (!synth) { $('status').textContent = 'This browser has no built-in speech. Open the file in Chrome or Edge.'; return; }
  await voicesReady;
  const V = pickVoices(), rate = +$('lRate').value;
  playing = true; $('lPlay').disabled = true; $('lStop').disabled = false;
  for (let p = start; p < LISTENING.length && playing; p++) {
    for (const [who, a, b] of LISTENING[p].script) {
      if (!playing) break;
      if (who === 'P') { await wait(a, `${LISTENING[p].title} · ${b}`); continue; }
      $('status').textContent = `${LISTENING[p].title} · playing`;
      await say(a, V[who], rate);
    }
  }
  if (playing) $('status').textContent = 'Recording finished. Check your answers, then submit.';
  playing = false; $('lPlay').disabled = false; $('lStop').disabled = true;
}
$('lPlay').onclick = () => playFrom(+$('lFrom').value);
$('lStop').onclick = () => { playing = false; synth.cancel(); $('status').textContent = 'Stopped.'; };

function showScripts() {
  $('lScript').hidden = false;
  $('lScript').innerHTML = '<h3>Transcripts</h3>' + LISTENING.map((p) => `<details><summary>${p.title}</summary><div class="script">${
    p.script.filter((l) => l[0] !== 'P').map(([w, t]) => `<p><span class="who">${{ N: '', W: 'Woman:', M: 'Man:' }[w]}</span>${esc(t)}</p>`).join('')}</div></details>`).join('');
}
$('lSubmit').onclick = () => { if (S.Ldone || confirm('Submit the Listening section? You can’t change answers afterwards.')) { playing = false; synth && synth.cancel(); mark('L', LISTENING); showScore('L', 'lScore'); showScripts(); } };

/* ---------- reading ---------- */
const submitReading = () => { clearInterval(tick); $('clock').textContent = ''; mark('R', READING); showScore('R', 'rScore'); };
const startReading = () => { $('rStart').disabled = true; countdown((S.rEnd - Date.now()) / 1000, 'Reading', submitReading); };
$('rStart').onclick = () => { S.rEnd = Date.now() + 60 * 60000; save(); startReading(); };
$('rSubmit').onclick = () => { if (S.Rdone || confirm('Submit the Reading section? You can’t change answers afterwards.')) submitReading(); };

/* ---------- writing ---------- */
const words = (t) => (t.trim().match(/\S+/g) || []).length;
function wc(n, min) { const c = words($('w' + n).value); $('w' + n + 'c').textContent = `${c} words${c < min ? ` · under ${min}, which costs marks` : ''}`; $('w' + n + 'c').className = 'wc' + (c < min ? ' low' : ''); }
['1', '2'].forEach((n) => {
  $('w' + n).value = S['w' + n] || '';
  $('w' + n).addEventListener('input', () => { S['w' + n] = $('w' + n).value; save(); wc(n, n === '1' ? 150 : 250); });
  wc(n, n === '1' ? 150 : 250);
});
if (S.wdone) S.wdone1 = S.wdone2 = true;   // saved before models were per task
function showModels(tasks) {
  tasks.forEach((t) => { S['wdone' + t] = true; });
  save();
  if (S.wTimed && S.wTimed.every((t) => S['wdone' + t])) { clearInterval(tick); $('clock').textContent = ''; S.wTimed = null; save();
    ['wStart', 'wStart1', 'wStart2'].forEach((id) => { $(id).disabled = false; }); }
  [1, 2].forEach((t) => { if (!S['wdone' + t]) return; $('wAfter').hidden = false; $('m' + t).innerHTML = t === 1 ? MODEL1 : MODEL2; $('m' + t).parentElement.hidden = false; });
}
const startWriting = () => {
  ['wStart', 'wStart1', 'wStart2'].forEach((id) => { $(id).disabled = true; });
  countdown((S.wEnd - Date.now()) / 1000, 'Writing', () => showModels(S.wTimed));
};
[['wStart', 60, [1, 2]], ['wStart1', 20, [1]], ['wStart2', 40, [2]]].forEach(([id, mins, tasks]) => {
  $(id).onclick = () => { S.wEnd = Date.now() + mins * 60000; S.wTimed = tasks; save(); startWriting(); };
});
[1, 2].forEach((t) => { $('wDone' + t).onclick = () => { if (S['wdone' + t] || confirm(`Show the Task ${t} model answer? Only once you have finished Task ${t}.`)) showModels([t]); }; });
$('wCopy').onclick = async () => {
  const txt = `Please mark my IELTS Academic Writing using the official band descriptors (Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Give a band for each criterion and each task, then the 3 changes that would raise my score most.\n\nTASK 1 (table: teenagers' average hours per week on five activities, 2010 → 2024: social media 6→18, video games 5→8, homework 9→10, sport 7→5, reading for pleasure 4→2):\n${$('w1').value.trim() || '(not written)'}\n\nTASK 2 (Some people believe that the best way to improve public health is to increase the number of sports facilities. Others think this would have little effect and that other measures are needed. Discuss both these views and give your own opinion.):\n${$('w2').value.trim() || '(not written)'}`;
  try { await navigator.clipboard.writeText(txt); $('wCopied').textContent = 'Copied. Paste it into a chat with Claude.'; }
  catch (e) { $('wCopied').textContent = 'Copy failed. Select the text yourself and copy it.'; }
};
showModels([]);

/* ---------- speaking ---------- */
const qlist = (sets) => sets.map(([topic, qs]) => `<div class="grp"><div class="t">${topic}</div><ul>${qs.map((q) => `<li>${q}</li>`).join('')}</ul></div>`).join('');
$('s1').innerHTML = qlist(SPEAK1);
$('s3').innerHTML = qlist(SPEAK3);
$('sPrep').onclick = () => {
  $('sPrep').disabled = true;
  countdown(60, 'Prepare (make notes)', () => countdown(120, 'Talk', () => { $('sStatus').textContent = 'Time. The examiner would stop you here.'; $('sPrep').disabled = false; }, $('sStatus')), $('sStatus'));
};

/* ---------- tabs, results, restore ---------- */
$('tabs').onclick = (e) => {
  const s = e.target.dataset.s; if (!s) return;
  document.querySelectorAll('#tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.s === s));
  document.querySelectorAll('main > section').forEach((sec) => { sec.hidden = sec.id !== s; });
  window.scrollTo(0, 0);
};
function renderResults() {
  const row = (name, sec) => S[sec + 'done'] ? `<tr><td>${name}</td><td>${S[sec + 'raw']} / 40</td><td><b>Band ${band(sec, S[sec + 'raw']).toFixed(1)}</b></td></tr>` : `<tr><td>${name}</td><td colspan="2" class="muted">not submitted yet</td></tr>`;
  $('resTable').innerHTML = `<table class="res">${row('Listening', 'L')}${row('Reading', 'R')}<tr><td>Writing</td><td colspan="2" class="muted">self-assess, or paste it to Claude</td></tr><tr><td>Speaking</td><td colspan="2" class="muted">self-assess from your recording</td></tr></table>`;
}
if (S.Ldone) { mark('L', LISTENING); showScore('L', 'lScore'); showScripts(); }
if (S.Rdone) { mark('R', READING); showScore('R', 'rScore'); } else if (S.rEnd > Date.now()) startReading();
if (S.wEnd > Date.now() && S.wTimed && !S.wTimed.every((t) => S['wdone' + t])) startWriting();
renderResults();
$('reset').onclick = () => { if (confirm('Clear every answer, essay and score for this mock?')) { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); } };
