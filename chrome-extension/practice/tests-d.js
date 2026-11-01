// Original practice Reading tests 7–8 (formats: see tests-a.js).
TESTS.push([
  { title: 'Power from the desert', hint: 'Spend about 20 minutes on Questions 1–13.', text: [
    'Deserts receive more sunshine than any other environment on earth, and for decades engineers have dreamed of turning that sunshine into electricity on a massive scale. It has been calculated that solar panels covering a small fraction of the world\'s deserts could, in theory, generate more electricity than the whole world currently uses. In recent years, as the cost of solar panels has fallen dramatically, some of the largest solar power plants ever built have appeared in desert regions of North Africa, the Middle East, India and China.',
    'There are two main ways of producing electricity from sunlight. Photovoltaic panels convert light directly into electricity and are now the cheapest and most widely used technology. Concentrated solar power, by contrast, uses large fields of mirrors to focus sunlight onto a receiver, heating a fluid that is then used to drive a turbine. Although more expensive, concentrated solar power has one important advantage: the heat can be stored, usually in tanks of molten salt, allowing the plant to keep producing electricity after the sun has set.',
    'Deserts, however, are not ideal places for every kind of equipment. Dust and sand settle on panels and mirrors, reducing the amount of light they receive, so they must be cleaned regularly. Because water is scarce, some plants now use robots that clean panels with soft brushes rather than water. High temperatures also reduce the efficiency of photovoltaic panels, which work best when they are cool.',
    'Another difficulty is distance. The best desert sites are often far from the cities and industries that need electricity, and building long transmission lines is costly. Some energy is also lost along the way, although modern high-voltage lines have reduced these losses considerably. Plans to export large amounts of desert electricity from North Africa to Europe were widely discussed in the 2000s, but most were abandoned because of their cost and the political complexity of cross-border projects.',
    'Large solar plants can also affect the local environment. Clearing land for panels may disturb rare plants and animals that are adapted to desert conditions. On the other hand, some studies suggest that the shade beneath panels can create cooler, damper conditions in which certain plants grow more easily, and in a few places sheep are grazed beneath the panels, keeping vegetation under control.',
    'Despite these challenges, desert solar power is likely to play a growing role in the world\'s energy supply. Its greatest value may lie not in exporting power over long distances but in supplying nearby countries, many of which have rapidly growing populations and increasing demand for electricity, particularly for air-conditioning and the desalination of seawater.',
  ], groups: [
    { t: 'Questions 1–7', i: TFNG_I, sel: TF, items: [
      [1, 'In theory, panels on a small part of the world\'s deserts could meet global electricity demand.', 'TRUE'],
      [2, 'Photovoltaic panels are more expensive than concentrated solar power.', 'FALSE'],
      [3, 'Concentrated solar power plants can produce electricity after dark.', 'TRUE'],
      [4, 'Robot cleaners cost less than cleaning panels by hand.', 'NOT GIVEN'],
      [5, 'Photovoltaic panels work better in very hot conditions.', 'FALSE'],
      [6, 'Plans to export electricity from North Africa to Europe were carried out successfully.', 'FALSE'],
      [7, 'Sheep grazed under solar panels produce better wool.', 'NOT GIVEN'],
    ] },
    { t: 'Questions 8–13', i: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.', head: 'Desert solar power', items: [
      [8, 'Concentrated solar power stores heat in tanks of molten ___', ['salt']],
      [9, '___ and sand reduce the light reaching panels', ['dust']],
      [10, 'Some robots clean panels with soft ___', ['brushes']],
      [11, 'Some energy is lost along long transmission ___', ['lines']],
      [12, 'Shade under panels can create cooler, ___ conditions', ['damper']],
      [13, 'Nearby demand includes air-conditioning and the ___ of seawater', ['desalination']],
    ] },
  ] },
  { title: 'Reading the ice', hint: 'Spend about 20 minutes on Questions 14–26. Reading Passage 2 has six paragraphs, A–F.', letters: true, text: [
    'Buried in the ice sheets of Antarctica and Greenland is a record of the earth\'s climate stretching back hundreds of thousands of years. Each year, snow falls on the ice sheet and is gradually compressed beneath the snow of later years until it turns into solid ice. Because the layers build up in order, drilling down through them is like travelling back in time, and scientists have recovered cores of ice more than three kilometres long.',
    'The ice preserves several kinds of information. Tiny bubbles of air trapped as the snow is compressed contain samples of the ancient atmosphere, allowing scientists to measure how much carbon dioxide and methane it contained. The chemical make-up of the ice itself, in particular the ratio between different forms of oxygen, reveals the temperature at the time the snow fell.',
    'The results have been remarkable. Cores from Antarctica show that over the past 800,000 years, the earth has passed through a regular cycle of ice ages separated by shorter warm periods, and that levels of carbon dioxide rose and fell closely in step with temperature. They also show that today\'s level of carbon dioxide is far higher than at any point in that entire period.',
    'The ice also records sudden events. Layers containing ash and sulphur mark large volcanic eruptions, some of which can be matched to eruptions described in historical documents. Dust layers indicate periods when the climate was drier and windier, and traces of lead in Greenland ice have even revealed the rise and fall of metal production in ancient Rome, whose mines released pollution that was carried by the wind across Europe and beyond.',
    'Drilling an ice core is a slow and demanding process. Teams work for several seasons in some of the coldest places on earth, and the cores must be kept frozen from the moment they are extracted until they reach the laboratory. Each section is cut into many samples, which are shared among research groups around the world. Some ice is deliberately kept in storage, untouched, so that future scientists can analyse it with techniques that have not yet been invented.',
    'There is now a sense of urgency about this work. As the climate warms, glaciers in mountain regions such as the Alps and the Andes are melting, and with them the climate records they contain. An international project has begun collecting cores from threatened glaciers and storing them in a specially built facility in Antarctica, where they will remain frozen naturally for the benefit of future generations of researchers.',
  ], groups: [
    { t: 'Questions 14–19', i: 'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.',
      box: 'i&nbsp; How layers of snow become a timeline<br>ii&nbsp; What the ice can tell us<br>iii&nbsp; A long pattern of climate change<br>iv&nbsp; Evidence of particular events<br>v&nbsp; The practical work of collecting ice<br>vi&nbsp; Saving records before they disappear<br>vii&nbsp; The dangers of drilling in Antarctica<br>viii&nbsp; Why scientists disagree about ice cores',
      sel: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], items: [
      [14, 'Paragraph A', 'i'], [15, 'Paragraph B', 'ii'], [16, 'Paragraph C', 'iii'],
      [17, 'Paragraph D', 'iv'], [18, 'Paragraph E', 'v'], [19, 'Paragraph F', 'vi'],
    ] },
    { t: 'Questions 20–23', i: 'Choose the correct letter, A, B, C or D.', items: [
      [20, 'What do air bubbles in the ice allow scientists to measure?', 'B', ['past wind speeds', 'gases in the ancient atmosphere', 'yearly snowfall', 'volcanic ash']],
      [21, 'What do Antarctic cores show about today\'s carbon dioxide level?', 'B', ['It is similar to past warm periods.', 'It is higher than at any time in 800,000 years.', 'It is falling.', 'It cannot be compared with the past.']],
      [22, 'Lead in Greenland ice gives information about', 'A', ['metal production in ancient Rome.', 'modern road traffic.', 'volcanic eruptions.', 'dust storms.']],
      [23, 'Why is some ice stored without being analysed?', 'B', ['It was damaged during drilling.', 'Future techniques may reveal more from it.', 'It is too old to be useful.', 'International law forbids analysing it.']],
    ] },
    { t: 'Questions 24–26', i: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', items: [
      [24, 'The temperature when the snow fell is shown by the ratio between different forms of ___.', ['oxygen']],
      [25, 'Layers containing ash and ___ mark large volcanic eruptions.', ['sulphur']],
      [26, 'Cores from threatened glaciers are kept in a specially built ___ in Antarctica.', ['facility']],
    ] },
  ] },
  { title: 'When are crowds wise?', hint: 'Spend about 20 minutes on Questions 27–40.', text: [
    'In 1906, the scientist Francis Galton visited a country fair in England where visitors were invited to guess the weight of an ox. Around eight hundred people took part, most of them with no special knowledge of cattle. Galton expected their guesses to be wildly inaccurate. Instead, when he examined the entries, he found that the middle value of all the guesses was within one per cent of the animal\'s true weight, closer than most of the individual estimates, including those of the experts present.',
    'Galton\'s observation has since become the foundation of the idea known as the wisdom of crowds: the claim that, under the right conditions, the combined judgement of a large group can be more accurate than that of even its best individual members. The explanation is statistical. Each person\'s estimate contains some information and some error, and if the errors are random, those that are too high tend to cancel out those that are too low.',
    'The key phrase, however, is "under the right conditions". For a crowd to be wise, its members must have some relevant knowledge, and, crucially, their judgements must be independent. If people can see or hear each other\'s estimates before making their own, their errors stop being random. Experiments have shown that when participants are told the average of earlier guesses, the range of their answers narrows, and the group as a whole can become more confident while becoming less accurate.',
    'This finding has troubling implications in an age of social media, where opinions spread quickly and people are constantly exposed to the views of others. In my opinion, it helps to explain why online crowds sometimes appear foolish rather than wise: a confident early claim, repeated and shared thousands of times, can easily drown out the scattered and independent judgements that would have produced a better answer.',
    'Diversity matters too. A group of people who all share the same background, training and sources of information are likely to make the same mistakes, so their errors reinforce rather than cancel each other. Some research suggests that a diverse group of reasonably well-informed people can outperform a smaller group of experts who all think alike, although experts remain valuable for problems that require specialised knowledge.',
    'Organisations have tried to put these ideas into practice in various ways. Some companies run internal prediction markets, in which employees bet on outcomes such as whether a product will be launched on time, and these have sometimes produced more accurate forecasts than official plans. I believe that the most useful lesson, though, is a simpler one: before a group discusses a decision, its members should write down their own views independently. Discussion can then improve those views, rather than replacing them with the opinion of whoever speaks first or loudest.',
  ], groups: [
    { t: 'Questions 27–31', i: YNNG_I, sel: YN, items: [
      [27, 'Most visitors at the fair had expert knowledge of cattle.', 'NO'],
      [28, 'The middle value of the guesses was more accurate than most individual guesses.', 'YES'],
      [29, 'Social media helps crowds to make wiser judgements.', 'NO'],
      [30, 'Galton later repeated his experiment at other fairs.', 'NOT GIVEN'],
      [31, 'Group members should record their own views before a discussion.', 'YES'],
    ] },
    { t: 'Questions 32–36', i: 'Complete each sentence with the correct ending, A–G, below.',
      box: 'A&nbsp; tend to cancel each other out.<br>B&nbsp; give a narrower range of answers.<br>C&nbsp; can drown out independent judgements.<br>D&nbsp; are likely to make the same mistakes.<br>E&nbsp; have sometimes beaten official forecasts.<br>F&nbsp; always produce the correct answer.<br>G&nbsp; should be led by the most senior person.',
      sel: LET('ABCDEFG'), items: [
      [32, 'If people\'s errors are random, guesses that are too high and too low', 'A'],
      [33, 'Participants who are told the average of earlier guesses', 'B'],
      [34, 'A confident early claim shared many times online', 'C'],
      [35, 'People with the same background and sources of information', 'D'],
      [36, 'Internal prediction markets', 'E'],
    ] },
    { t: 'Questions 37–40', i: 'Choose the correct letter, A, B, C or D.', items: [
      [37, 'What surprised Galton?', 'B', ['how many people took part', 'how accurate the combined guess was', 'the weight of the ox', 'how accurate the experts were']],
      [38, 'According to the third paragraph, what is crucial for a wise crowd?', 'B', ['a large prize', 'independent judgements', 'a strong leader', 'a strict time limit']],
      [39, 'What happened when participants were told the average of earlier guesses?', 'B', ['They became more accurate.', 'They became more confident but less accurate.', 'They refused to guess.', 'Their answers became more varied.']],
      [40, 'What is the writer\'s main practical advice?', 'B', ['Use prediction markets for every decision.', 'Write down views independently before discussing them.', 'Always rely on experts.', 'Avoid making decisions in groups.']],
    ] },
  ] },
]);

TESTS.push([
  { title: 'The journey of paper', hint: 'Spend about 20 minutes on Questions 1–13.', text: [
    'Paper is so common that it is easy to overlook how much it has shaped human history. Before its invention, people wrote on a wide range of materials, including clay tablets, animal skins, silk and strips of bamboo. Each had disadvantages: clay was heavy, bamboo was bulky, and silk and parchment, which was made from animal skin, were expensive.',
    'According to Chinese tradition, paper was invented in AD 105 by Cai Lun, an official at the imperial court, who made it from tree bark, old fishing nets, rags and hemp. Archaeologists have since found fragments of paper that are older than this, so it seems that Cai Lun improved and promoted an existing technique rather than inventing it. Nevertheless, his methods made paper cheaper and more practical, and its use spread steadily across China.',
    'For several centuries, the secret of papermaking remained in East Asia. It reached the Islamic world in the eighth century, and a well-known story claims that Chinese papermakers captured after a battle in Central Asia in 751 taught their skills in the city of Samarkand. Whatever the truth of this story, papermaking flourished in cities such as Baghdad and Damascus, where large quantities of paper supported a remarkable growth in scholarship, government record-keeping and the copying of books.',
    'Europe was slow to adopt paper. It arrived through Spain and Italy in the eleventh and twelfth centuries, but many Europeans regarded it as less durable than parchment, and some official documents were required to be written on parchment for that reason. Italian papermakers made important improvements, including the use of water-powered mills to beat rags into pulp and the introduction of watermarks, designs pressed into the paper that identified the mill where it was made.',
    'The invention of the printing press in the fifteenth century greatly increased demand for paper, and for the next four hundred years it was made mainly from cotton and linen rags. As literacy spread, rags became scarce, and papermakers searched for alternatives. In the nineteenth century, methods were developed for making paper from wood pulp, which was cheap and plentiful. This made newspapers and books affordable for ordinary people, although early wood-pulp paper contained acids that caused it to turn yellow and crumble over time.',
    'Today, the world produces more than four hundred million tonnes of paper and cardboard each year. Predictions that computers would create a paperless office have not come true, though demand for printing paper has fallen in many countries. Instead, the growth of online shopping has caused a sharp rise in the use of cardboard for packaging.',
  ], groups: [
    { t: 'Questions 1–7', i: TFNG_I, sel: TF, items: [
      [1, 'Silk was an inexpensive material for writing.', 'FALSE'],
      [2, 'Cai Lun was the first person ever to make paper.', 'FALSE'],
      [3, 'Cai Lun used old fishing nets to make paper.', 'TRUE'],
      [4, 'Chinese officials preferred paper to silk.', 'NOT GIVEN'],
      [5, 'Some official documents in Europe had to be written on parchment.', 'TRUE'],
      [6, 'Watermarks showed who had bought the paper.', 'FALSE'],
      [7, 'More cardboard than printing paper is now produced worldwide.', 'NOT GIVEN'],
    ] },
    { t: 'Questions 8–13', i: 'Answer the questions below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', items: [
      [8, 'What writing material was made from animal skin? ___', ['parchment']],
      [9, 'In which city are captured Chinese papermakers said to have taught their skills? ___', ['samarkand']],
      [10, 'What powered the mills used by Italian papermakers? ___', ['water']],
      [11, 'What were the designs that identified a paper mill called? ___', ['watermarks']],
      [12, 'What in early wood-pulp paper made it turn yellow? ___', ['acids']],
      [13, 'What has online shopping increased the use of? ___', ['cardboard']],
    ] },
  ] },
  { title: 'Treasure on the seabed', hint: 'Spend about 20 minutes on Questions 14–26. Reading Passage 2 has seven paragraphs, A–G.', letters: true, text: [
    'Thousands of metres beneath the surface of the Pacific Ocean, the seabed is scattered with dark, rounded lumps about the size of potatoes. These polymetallic nodules, which form extremely slowly over millions of years, are rich in metals such as nickel, cobalt, copper and manganese. As demand for these metals has grown, largely because of their use in batteries for electric vehicles, mining companies have become increasingly interested in collecting them.',
    'The most promising area lies in the Clarion-Clipperton Zone, a vast stretch of seabed between Hawaii and Mexico. Because it lies in international waters, mining there is regulated by the International Seabed Authority, an organisation set up under the United Nations. The authority has issued contracts allowing companies to explore the area, but rules governing commercial mining have taken many years to negotiate.',
    'Supporters of deep-sea mining argue that it could provide metals with less damage than mining on land. Land-based mines for nickel and cobalt have been linked to deforestation, water pollution and, in some cases, serious abuses of workers\' rights. Collecting nodules from the seabed, they say, would require no forest clearing, produce little waste rock and avoid the social problems associated with some mines on land.',
    'Many scientists, however, are deeply concerned. The deep sea is one of the least explored environments on earth, and each research expedition to the Clarion-Clipperton Zone discovers species that are new to science. Many of these animals live on or around the nodules themselves, which provide one of the few hard surfaces in an otherwise muddy seabed. Because the nodules take millions of years to form, removing them could destroy these habitats permanently.',
    'There are also concerns about sediment. Mining machines that collect nodules would stir up clouds of fine mud, which could spread over large distances and smother animals far from the mining site. Waste water and sediment released from ships at the surface could also affect fish and other marine life in the upper layers of the ocean. Experiments conducted decades ago have shown that tracks left on the seabed by test equipment are still clearly visible, with little sign of recovery.',
    'These uncertainties have led a number of countries, along with several major companies that make cars and electronics, to call for a pause in deep-sea mining until its effects are better understood. Some companies have pledged not to use metals from the seabed in their products. Others argue that delays will only increase dependence on damaging land-based mines.',
    'The debate is complicated by changes in battery technology. New types of battery that use little or no cobalt or nickel are already being developed, and if they become widespread, demand for seabed metals could be much lower than expected. Greater recycling of metals from old batteries could also reduce the need for new sources. The decision about whether to mine the deep sea may therefore depend as much on future technology as on present-day science.',
  ], groups: [
    { t: 'Questions 14–19', i: 'Reading Passage 2 has seven paragraphs, A–G. Which paragraph contains the following information?', sel: LET('ABCDEFG'), items: [
      [14, 'evidence that damage to the seabed lasts a long time', 'E'],
      [15, 'the main reason for growing demand for certain metals', 'A'],
      [16, 'who controls mining in international waters', 'B'],
      [17, 'possible ways of reducing the need for seabed metals', 'G'],
      [18, 'problems linked to mining on land', 'C'],
      [19, 'the role nodules play as a habitat', 'D'],
    ] },
    { t: 'Questions 20–23', i: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.', head: 'Nodules and mining', items: [
      [20, 'Nodules form extremely ___ over millions of years.', ['slowly']],
      [21, 'They contain metals such as nickel and ___.', ['cobalt', 'copper', 'manganese']],
      [22, 'Mining machines would stir up clouds of fine ___.', ['mud']],
      [23, 'This sediment could ___ animals far from the mining site.', ['smother']],
    ] },
    { t: 'Questions 24–26', i: 'Choose the correct letter, A, B, C or D.', items: [
      [24, 'Where is the Clarion-Clipperton Zone?', 'B', ['near Antarctica', 'between Hawaii and Mexico', 'off the coast of Australia', 'in the Atlantic Ocean']],
      [25, 'What have some companies pledged?', 'B', ['to mine only on land', 'not to use metals from the seabed', 'to pay for deep-sea research', 'to stop making batteries']],
      [26, 'According to paragraph G, demand for seabed metals may be lower than expected because of', 'A', ['new battery types and recycling.', 'falling car sales.', 'new mining laws.', 'falling metal prices.']],
    ] },
  ] },
  { title: 'Why we put things off', hint: 'Spend about 20 minutes on Questions 27–40.', text: [
    'Almost everyone procrastinates at times, putting off tasks they know they should do, even when they expect to be worse off as a result. Surveys suggest that around one in five adults regard themselves as chronic procrastinators, and among students the proportion is considerably higher. For a long time, procrastination was treated as a problem of time management: people delayed, it was assumed, because they were disorganised or lazy, and the solution was better planning.',
    'More recent research has challenged this view. The psychologist Tim Pychyl argues that procrastination is better understood as a problem of managing emotions rather than time. When a task makes us feel anxious, bored, frustrated or insecure, putting it off provides immediate relief from those feelings. The relief is real but short-lived, and the task, along with the negative feelings attached to it, is still waiting when we return.',
    'This emotional explanation is supported by research by Fuschia Sirois, who has found that chronic procrastinators tend to report higher levels of stress and are more likely to suffer from health problems, partly because they also delay activities such as visiting the doctor or taking exercise. Sirois has also studied self-compassion, the ability to treat oneself kindly after a failure, and found that people who are harsh with themselves about past procrastination are more likely to procrastinate again.',
    'The researcher Piers Steel has approached the problem from a different angle. Drawing on many studies, he proposed that procrastination is strongly influenced by how far away the rewards of a task are. People value immediate rewards much more highly than distant ones, so a task whose benefits arrive only weeks or months later, such as studying for an examination, struggles to compete with activities that are pleasant now. Steel also found that tasks people find unpleasant, and those for which they have low confidence of success, are the ones most often delayed.',
    'These insights suggest practical strategies. In my view, the most effective of them is also the simplest: make the first step so small that it is hard to refuse. Committing to work on a task for just five minutes often reduces the anxiety that causes avoidance, and once started, many people find it easier to continue. Breaking long-term goals into short-term targets with visible progress can also help to bring distant rewards closer.',
    'Reducing distractions matters too. Since procrastination often involves turning to something more pleasant, making those alternatives harder to reach, for example by leaving a phone in another room, can tip the balance in favour of the task. Finally, it may help to remember that occasional procrastination is normal. Treating oneself with understanding rather than criticism is not an excuse for avoiding work; according to the evidence, it is one of the best ways of getting it done.',
  ], groups: [
    { t: 'Questions 27–31', i: 'Match each statement with the correct researcher, A, B or C. You may use any letter more than once.', box: 'A&nbsp; Tim Pychyl<br>B&nbsp; Fuschia Sirois<br>C&nbsp; Piers Steel', sel: LET('ABC'), items: [
      [27, 'linked procrastination with poorer health', 'B'],
      [28, 'described procrastination as a way of escaping unpleasant feelings', 'A'],
      [29, 'found that distant rewards make tasks easier to put off', 'C'],
      [30, 'studied the effect of being kind to oneself', 'B'],
      [31, 'found that low confidence makes delay more likely', 'C'],
    ] },
    { t: 'Questions 32–36', i: YNNG_I, sel: YN, items: [
      [32, 'Procrastination is mainly a result of poor planning.', 'NO'],
      [33, 'The relief gained from putting off a task does not last long.', 'YES'],
      [34, 'Students procrastinate less than other adults.', 'NO'],
      [35, 'Committing to five minutes of work is the most effective strategy.', 'YES'],
      [36, 'Most procrastinators use their phones to avoid work.', 'NOT GIVEN'],
    ] },
    { t: 'Questions 37–40', i: 'Choose the correct letter, A, B, C or D.', items: [
      [37, 'In the past, procrastination was mainly regarded as', 'B', ['an emotional problem.', 'a problem of time management.', 'a health condition.', 'normal behaviour.']],
      [38, 'According to Sirois, people who are harsh with themselves', 'B', ['procrastinate less.', 'are more likely to procrastinate again.', 'take more exercise.', 'have fewer health problems.']],
      [39, 'Why does studying for an examination compete poorly with other activities?', 'A', ['Its rewards arrive far in the future.', 'It is too easy.', 'It takes very little time.', 'It is usually done in groups.']],
      [40, 'What does the writer say about treating oneself with understanding?', 'B', ['It is an excuse for avoiding work.', 'It helps people get their work done.', 'It increases distractions.', 'It is unnecessary for most people.']],
    ] },
  ] },
]);
