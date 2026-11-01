// Original practice Reading tests 1–2. Item formats: [n, prompt, 'ANSWER'] with g.sel = pick list;
// [n, 'text ___ text', ['answer', 'alt']] = gap fill; [n, prompt, 'B', [A, B, C, D]] = multiple choice.
const TF = ['TRUE', 'FALSE', 'NOT GIVEN'], YN = ['YES', 'NO', 'NOT GIVEN'];
const LET = (s) => [...s];
const TFNG_I = 'Do the following statements agree with the information given in the passage? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.';
const YNNG_I = 'Do the following statements agree with the claims of the writer? Choose YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.';
window.TESTS = window.TESTS || [];

TESTS.push([
  { title: 'The secret life of city bees', hint: 'Spend about 20 minutes on Questions 1–13.', text: [
    'For much of the twentieth century, ecologists regarded cities as places where wildlife struggled to survive. Concrete, traffic and pollution seemed to leave little room for insects, and bees in particular were assumed to depend on the countryside. In recent years, however, a series of surveys has challenged this view. When researchers counted bees in gardens, parks and even road verges in several European cities, they found more species than in many nearby farms.',
    'The explanation lies partly in what has happened to the countryside. Modern farming tends to cover large areas with a single crop, which flowers for only a few weeks each year. Once it has finished flowering, there may be almost nothing for a bee to feed on until the following spring. Hedges, which once provided shelter and a variety of flowers, have been removed from many fields to make room for machinery, and chemical sprays used to control pests can harm bees directly.',
    'Cities, by contrast, offer a long and varied flowering season. Gardeners plant species from all over the world, many of which flower at different times, so that food is available from early spring until late autumn. Temperatures in cities are also slightly higher than in the surrounding area, an effect known as the urban heat island, and this allows some bees to become active earlier in the year.',
    'Not all bees benefit equally. The honeybee, which lives in large colonies kept by beekeepers, receives most of the public attention, but it is only one of hundreds of species. Most wild bees are solitary: each female builds her own nest, often in a small hole in dead wood or in bare ground. These bees need nesting sites as well as flowers, and tidy gardens with neatly cut lawns and paved paths may offer very few.',
    'There is also growing concern that urban beekeeping has become too popular. Keeping hives on the roofs of offices and hotels has become fashionable, and in some city centres the number of hives has risen sharply. Because honeybees live in colonies of tens of thousands, they can collect large amounts of nectar and pollen, and some scientists fear that they are leaving less food for wild species. In one European capital, researchers found that the number of wild bees visiting flowers fell in areas where hives were most concentrated.',
    'For people who want to help, the advice from ecologists is surprisingly simple. Leaving part of a lawn uncut allows wild flowers such as clover to grow. A pile of old logs or an area of bare soil gives solitary bees somewhere to nest. Perhaps most importantly, gardeners can choose plants that flower in late summer, when food is often scarce, and avoid using pesticides altogether.',
  ], groups: [
    { t: 'Questions 1–7', i: TFNG_I, sel: TF, items: [
      [1, 'Twentieth-century ecologists believed that bees depended mainly on the countryside.', 'TRUE'],
      [2, 'The surveys described counted bees only in public parks.', 'FALSE'],
      [3, 'A field planted with a single crop provides food for bees for only a short time.', 'TRUE'],
      [4, 'Hedges were removed from fields mainly because they spread plant diseases.', 'FALSE'],
      [5, 'Temperatures in cities are lower than in the surrounding countryside.', 'FALSE'],
      [6, 'The honeybee is the most common bee species found in cities.', 'NOT GIVEN'],
      [7, 'Hives on rooftops produce more honey than hives in the countryside.', 'NOT GIVEN'],
    ] },
    { t: 'Questions 8–13', i: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.', head: 'Helping wild bees in cities', items: [
      [8, 'Most wild bees are ___ and build their own nests', ['solitary']],
      [9, 'Nests are often in holes in dead ___ or in bare ground', ['wood']],
      [10, 'Large numbers of honeybees may leave less food for wild ___', ['species']],
      [11, 'An uncut lawn lets wild flowers such as ___ grow', ['clover']],
      [12, 'A pile of old ___ gives bees a place to nest', ['logs']],
      [13, 'Choose plants that flower in late ___, when food is scarce', ['summer']],
    ] },
  ] },
  { title: 'How the pencil conquered the world', hint: 'Spend about 20 minutes on Questions 14–26. Reading Passage 2 has six paragraphs, A–F.', letters: true, text: [
    'Few objects are as ordinary as the pencil, yet its history involves geology, war and some remarkable chemistry. The story begins in the sixteenth century in Borrowdale, in the north-west of England, where an unusually pure deposit of graphite was discovered. Local shepherds are said to have used the soft black material to mark their sheep, and before long it was being cut into sticks and sold for writing and drawing.',
    'At first nobody understood what graphite was. Because it left a dark mark like lead, it was called plumbago, from the Latin word for lead, and the name "lead pencil" survives to this day, even though pencils have never contained any lead at all. The Borrowdale mine became so valuable that it was guarded, and for a time it was flooded when not in use to prevent theft.',
    'The pure graphite of Borrowdale was rare, and other countries struggled to make pencils of the same quality. The problem became urgent for France at the end of the eighteenth century, when war with Britain cut off supplies. In 1795, an engineer named Nicolas-Jacques Conté found a solution: he mixed powdered graphite with clay, shaped the mixture into thin rods and baked them in a kiln. By changing the proportion of clay, he could make the pencil harder or softer, a principle that is still used to grade pencils today.',
    'The wooden case also took time to develop. Early sticks of graphite were wrapped in string or sheepskin. Later, makers began placing the graphite between two strips of wood glued together, and cedar became the preferred material because it is soft enough to sharpen easily and does not split. The six-sided shape that is common today was introduced partly for a practical reason: unlike a round pencil, it does not roll off a sloping desk.',
    'Mass production in the nineteenth century turned the pencil from a craftsman\'s tool into an everyday object. Factories in Germany and the United States produced millions each year, and the arrival of compulsory schooling created an enormous new market. The rubber eraser was attached to the end of the pencil in 1858, although some teachers objected, arguing that it would make children careless about their mistakes.',
    'Today, digital devices might seem to have made the pencil unnecessary, but billions are still made every year. Architects and designers value the way a pencil line can be made lighter or darker by changing the pressure, and engineers have relied on pencils because they work at any angle and in extreme temperatures. Some researchers also argue that writing by hand helps people remember information better than typing, although the evidence on this point is still debated.',
  ], groups: [
    { t: 'Questions 14–19', i: 'Reading Passage 2 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.',
      box: 'i&nbsp; A material named after the wrong metal<br>ii&nbsp; A wartime shortage leads to a new method<br>iii&nbsp; The local origins of a writing material<br>iv&nbsp; Why the pencil survives in a digital age<br>v&nbsp; The design of the outer casing<br>vi&nbsp; From specialist tool to everyday item<br>vii&nbsp; Doubts about pencils in classrooms<br>viii&nbsp; The environmental cost of pencil making',
      sel: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'], items: [
      [14, 'Paragraph A', 'iii'], [15, 'Paragraph B', 'i'], [16, 'Paragraph C', 'ii'],
      [17, 'Paragraph D', 'v'], [18, 'Paragraph E', 'vi'], [19, 'Paragraph F', 'iv'],
    ] },
    { t: 'Questions 20–23', i: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', items: [
      [20, 'To prevent theft, the Borrowdale mine was ___ when it was not being used.', ['flooded']],
      [21, 'Conté baked his rods of graphite and clay in a ___.', ['kiln']],
      [22, 'Cedar is used because it is easy to sharpen and does not ___.', ['split']],
      [23, 'Some teachers feared erasers would make children ___ about their mistakes.', ['careless']],
    ] },
    { t: 'Questions 24–26', i: 'Choose the correct letter, A, B, C or D.', items: [
      [24, 'What did Conté\'s method make possible?', 'B', ['pencils without a wooden case', 'pencils of different hardness', 'cheaper graphite mining', 'pencils that never needed sharpening']],
      [25, 'Why did the six-sided pencil become common?', 'C', ['It was easier to hold.', 'It was cheaper to make.', 'It did not roll off sloping desks.', 'It was easier to sharpen.']],
      [26, 'According to paragraph F, which point is still uncertain?', 'B', ['whether pencils work in extreme temperatures', 'whether handwriting improves memory more than typing', 'how many pencils are made each year', 'whether designers prefer pencils to pens']],
    ] },
  ] },
  { title: 'In defence of boredom', hint: 'Spend about 20 minutes on Questions 27–40.', text: [
    'Boredom has a poor reputation. It is usually treated as an unpleasant state to be escaped as quickly as possible, and modern technology has made escape easier than ever: a smartphone offers an endless supply of distraction to fill every queue, journey and quiet moment. Yet a growing number of psychologists believe that this habit of avoiding boredom may come at a cost, and that the feeling itself serves a useful purpose.',
    'One influential view describes boredom as a signal, much like hunger or pain. Just as hunger tells us that we need food, boredom tells us that our current activity is not meeting our needs, whether because it is too easy, too difficult or simply meaningless. On this account, boredom is not a failure of character but a prompt to change what we are doing. The difficulty is that the signal can be answered well or badly. Someone who responds to boredom by seeking a new challenge is using it as intended; someone who reaches automatically for a phone may silence the signal without dealing with its cause.',
    'Some of the best-known research in this area has examined the link between boredom and creativity. In a frequently cited experiment, one group of participants spent fifteen minutes copying numbers from a telephone directory, a deliberately dull task, while a second group went straight to the main test. Both groups were then asked to think of as many uses as possible for a pair of plastic cups. Those who had completed the boring task produced more ideas, and the researchers suggested that boredom had encouraged their minds to wander, a state in which unusual connections are more likely to be made.',
    'I find these results interesting, but I think they have sometimes been exaggerated. The experiments were small, and later attempts to repeat them have produced mixed results. More importantly, there is a difference between a short period of mild boredom and the chronic boredom that some people experience at work or at school for months at a time. The latter is associated not with creativity but with poor concentration, risk-taking and low mood, and it would be wrong to suggest that it should be welcomed.',
    'What the research does seem to show is that constant stimulation has a price. When every empty moment is filled, the mind has fewer opportunities to drift, to reflect on past events or to plan for the future. Several studies have found that people who check their phones most often report feeling more bored, not less, perhaps because the brief rewards of each check make ordinary activities seem duller by comparison.',
    'The practical lesson, in my view, is not that we should seek out boredom, but that we should be less afraid of it. Allowing children some unstructured time, rather than filling every hour with organised activities, may help them learn to generate their own interests. For adults, leaving the phone in a pocket during a short wait is a small experiment worth trying. The aim is not to suffer but to notice what the mind does when it is given a little space.',
  ], groups: [
    { t: 'Questions 27–31', i: YNNG_I, sel: YN, items: [
      [27, 'Technology has made it easier for people to avoid boredom.', 'YES'],
      [28, 'Boredom is a sign of a weak character.', 'NO'],
      [29, 'The results of the creativity experiment have sometimes been exaggerated.', 'YES'],
      [30, 'Long periods of boredom at work should be welcomed.', 'NO'],
      [31, 'Most schools give children too much homework.', 'NOT GIVEN'],
    ] },
    { t: 'Questions 32–35', i: 'Complete the summary using the list of words, A–H, below.',
      box: 'A&nbsp; signal &nbsp; B&nbsp; wander &nbsp; C&nbsp; dull &nbsp; D&nbsp; low &nbsp; E&nbsp; creative &nbsp; F&nbsp; punishment &nbsp; G&nbsp; rest &nbsp; H&nbsp; high',
      head: 'Boredom and the mind', sel: LET('ABCDEFGH'), items: [
      [32, 'Like hunger, boredom is a ___ that an activity is not meeting our needs.', 'A'],
      [33, 'Participants who first did a ___ task thought of more uses for plastic cups.', 'C'],
      [34, 'The researchers believed boredom allowed their minds to ___.', 'B'],
      [35, 'Chronic boredom is linked with poor concentration and ___ mood.', 'D'],
    ] },
    { t: 'Questions 36–38', i: 'Complete each sentence with the correct ending, A–F, below.',
      box: 'A&nbsp; are using the signal as it was meant to be used.<br>B&nbsp; say that they feel more bored.<br>C&nbsp; may help them develop their own interests.<br>D&nbsp; are more creative than other people.<br>E&nbsp; should avoid organised activities completely.<br>F&nbsp; find ordinary tasks more meaningful.',
      sel: LET('ABCDEF'), items: [
      [36, 'People who respond to boredom by looking for a new challenge', 'A'],
      [37, 'People who check their phones most often', 'B'],
      [38, 'Giving children unstructured time', 'C'],
    ] },
    { t: 'Questions 39–40', i: 'Choose the correct letter, A, B, C or D.', items: [
      [39, 'What does the writer say about later attempts to repeat the creativity experiment?', 'B', ['They confirmed the original findings.', 'They produced mixed results.', 'They used larger groups of children.', 'They were never published.']],
      [40, 'What is the writer\'s main recommendation?', 'C', ['Deliberately look for boring activities.', 'Stop using smartphones altogether.', 'Be less afraid of being bored.', 'Give children more organised activities.']],
    ] },
  ] },
]);

TESTS.push([
  { title: 'Farming on the roof', hint: 'Spend about 20 minutes on Questions 1–13.', text: [
    'As cities grow, planners are looking for new ways to produce food close to the people who eat it. One idea that has moved from the margins to the mainstream is the rooftop farm. Flat roofs on warehouses, schools and supermarkets are among the largest unused spaces in any city, and a number of businesses now grow vegetables, herbs and even fruit trees on them.',
    'Rooftop farms take two main forms. The first is the open-air farm, in which a layer of lightweight soil, usually no more than thirty centimetres deep, is spread across the roof and planted in much the same way as a field. The second is the rooftop greenhouse, where crops are grown under glass, often without soil at all. In these hydroponic systems, plant roots sit in water to which nutrients have been added, and the temperature, light and humidity can be closely controlled.',
    'Supporters point to several benefits. Food grown on a roof can reach shops within hours of being picked, so it is fresher and less is wasted during transport. A layer of soil and plants also insulates the building below, keeping it cooler in summer and warmer in winter, and it absorbs rainwater that would otherwise run straight into overloaded drains. Some rooftop greenhouses go further and capture waste heat from the building beneath to warm the plants.',
    'The challenges, however, are considerable. Not every roof is strong enough to carry the weight of wet soil, and strengthening an existing building can be extremely expensive. Wind is a constant problem on high roofs, damaging plants and drying out the soil, while getting workers, tools and harvested crops up and down several floors adds to costs. As a result, most commercial rooftop farms concentrate on high-value crops such as salad leaves and herbs rather than staple foods like wheat or potatoes.',
    'Critics also question how much food rooftops can realistically produce. Even if every suitable roof in a large city were farmed, the total area would supply only a small fraction of the city\'s vegetables. Supporters respond that rooftop farms were never meant to feed a whole city. Their value, they argue, lies as much in education and community as in production: many projects run workshops for schoolchildren and offer volunteers the chance to learn how food is grown.',
  ], groups: [
    { t: 'Questions 1–6', i: TFNG_I, sel: TF, items: [
      [1, 'Flat roofs are among the largest unused spaces in cities.', 'TRUE'],
      [2, 'Open-air rooftop farms usually have soil more than a metre deep.', 'FALSE'],
      [3, 'In hydroponic systems, plants are grown without soil.', 'TRUE'],
      [4, 'Vegetables from rooftop farms are cheaper than those from ordinary farms.', 'NOT GIVEN'],
      [5, 'Most commercial rooftop farms grow staple foods such as wheat.', 'FALSE'],
      [6, 'Farming every suitable roof would supply all of a large city\'s vegetables.', 'FALSE'],
    ] },
    { t: 'Questions 7–13', i: 'Complete the table below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', head: 'Rooftop farms: benefits and problems', items: [
      [7, 'Benefit: food is fresher and less is ___ during transport', ['wasted']],
      [8, 'Benefit: a layer of soil and plants ___ the building below', ['insulates']],
      [9, 'Benefit: the roof absorbs ___ that would flood drains', ['rainwater']],
      [10, 'Benefit: some greenhouses use ___ from the building', ['waste heat']],
      [11, 'Problem: some roofs cannot carry the weight of ___', ['wet soil']],
      [12, 'Problem: ___ damages plants and dries out the soil', ['wind']],
      [13, 'Result: farms grow high-value crops such as ___ and herbs', ['salad leaves']],
    ] },
  ] },
  { title: 'The psychology of waiting', hint: 'Spend about 20 minutes on Questions 14–26. Reading Passage 2 has six paragraphs, A–F.', letters: true, text: [
    'Everyone spends time waiting: in queues at supermarkets, on the phone to call centres, at airports and in doctors\' surgeries. Because waiting is so common, it might be expected that people would simply accept it. In fact, the way a wait is experienced often matters more than its actual length, and businesses have spent considerable sums trying to understand why some waits feel unbearable while others pass almost unnoticed.',
    'One of the best-known stories in this field concerns an office building in which tenants complained about slow lifts. Engineers proposed expensive improvements, but the building\'s managers chose a different solution: they installed mirrors next to the lifts. The complaints almost stopped. People waiting could now look at themselves and others, and the wait seemed shorter, even though the lifts were no faster than before. Whether or not the story is entirely true, it illustrates a principle that researchers have since confirmed: occupied time feels shorter than unoccupied time.',
    'The management researcher David Maister argued that uncertainty is one of the most important factors. A wait of unknown length feels longer than one whose end can be predicted, which is why many call centres now tell callers their position in the queue, and why underground stations display the minutes until the next train. Maister also noted that unexplained waits are more irritating than explained ones: passengers told that a delay is caused by a signal failure tend to be more patient than those given no reason at all.',
    'Fairness is another key factor. Research by Richard Larson found that people are often more upset by a queue that seems unfair than by a long one. Customers in a supermarket with several separate lines frequently feel that the line next to them is moving faster, and this sense of injustice adds to their frustration. A single line serving several checkouts, as used in many banks and post offices, may not reduce the average wait, but because everyone is served in order, customers report greater satisfaction.',
    'Expectations also play a part. Research by the marketing professor Ziv Carmon suggests that how people feel about a wait depends heavily on how it ends. A queue that moves slowly at first but speeds up towards the end tends to be remembered more positively than one that moves quickly and then stalls. Some theme parks deliberately overestimate waiting times on their signs, so that visitors who reach the front sooner than expected feel pleasantly surprised.',
    'Technology is now changing the nature of waiting itself. Many restaurants and clinics send a text message when a table or appointment is ready, allowing people to wait elsewhere. Yet some researchers warn that this may simply move the frustration rather than remove it, since people who are free to do other things may become anxious about missing their turn. The psychology of waiting, it seems, cannot be designed away entirely.',
  ], groups: [
    { t: 'Questions 14–19', i: 'Reading Passage 2 has six paragraphs, A–F. Which paragraph contains the following information? You may use any letter more than once.', sel: LET('ABCDEF'), items: [
      [14, 'an example of businesses giving inaccurate information on purpose', 'E'],
      [15, 'a reason why a single queue can leave customers more satisfied', 'D'],
      [16, 'a story that may not be completely accurate', 'B'],
      [17, 'a possible drawback of letting people wait somewhere else', 'F'],
      [18, 'the claim that the experience of a wait matters more than its length', 'A'],
      [19, 'the benefit of telling people why they are being delayed', 'C'],
    ] },
    { t: 'Questions 20–22', i: 'Match each finding with the correct researcher, A, B or C.', box: 'A&nbsp; David Maister<br>B&nbsp; Richard Larson<br>C&nbsp; Ziv Carmon', sel: LET('ABC'), items: [
      [20, 'The way a wait ends affects how it is remembered.', 'C'],
      [21, 'A wait feels longer when people cannot tell when it will end.', 'A'],
      [22, 'A queue that seems unjust causes more frustration than a long one.', 'B'],
    ] },
    { t: 'Questions 23–26', i: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.', head: 'Making waits feel shorter', items: [
      [23, 'Managers of one building answered complaints about slow lifts by installing ___.', ['mirrors']],
      [24, 'Call centres reduce ___ by telling callers their position in the queue.', ['uncertainty']],
      [25, 'Separate supermarket lines create a sense of ___.', ['injustice']],
      [26, 'Restaurants can send a text ___ when a table is ready.', ['message']],
    ] },
  ] },
  { title: 'Why languages disappear', hint: 'Spend about 20 minutes on Questions 27–40.', text: [
    'Of the roughly seven thousand languages spoken in the world today, around forty per cent are considered endangered, and many have only a handful of elderly speakers. Linguists estimate that, on current trends, a large proportion could disappear by the end of this century. The loss is rarely sudden. Languages usually fade over several generations, as parents stop passing them on to their children.',
    'The reasons are often economic. When a community\'s traditional way of life comes under pressure, families may move to towns in search of work, where a national or global language offers better access to jobs, education and government services. In such circumstances, parents may decide, quite rationally, that their children\'s future lies with the dominant language. In the past, some governments actively punished children for speaking minority languages at school, and the shame associated with these languages has lasted long after the policies ended.',
    'Why should the rest of the world care? One argument is scientific. Each language represents a different solution to the problem of human communication, and linguists can only understand the full range of what human languages can do by studying as many as possible. Some languages, for example, have no words for left and right and describe all directions in terms of the points of the compass, a fact that has led researchers to rethink assumptions about how people perceive space.',
    'A second argument concerns knowledge. Many small languages are spoken by communities with a deep understanding of their local environment, and this knowledge is often stored in the language itself, in names for plants, animals and weather patterns that have no equivalent elsewhere. When the language disappears, this information may be lost before anyone has recorded it. I would add a third argument, which seems to me the most important: for the speakers themselves, a language is bound up with identity, history and a sense of belonging, and its loss can be deeply painful.',
    'There are, however, reasons for cautious optimism. Recording equipment is now cheap, and communities can document their own languages without waiting for outside experts. The internet allows scattered speakers to stay in contact, and some revival projects have been remarkably successful. The most famous is Hebrew, which had not been used as an everyday spoken language for many centuries but now has millions of native speakers. Welsh and Maori have also seen significant growth after decades of decline, largely thanks to schools in which all lessons are taught in the language.',
    'Yet revival is neither easy nor guaranteed. It requires not only teaching materials and trained teachers but also, crucially, places where the language is actually needed. Children who learn a language at school but never hear it at home or in the shops tend to abandon it once their education ends. In my view, revival efforts that focus only on the classroom are unlikely to succeed; the language must have a role in everyday life.',
  ], groups: [
    { t: 'Questions 27–30', i: 'Choose the correct letter, A, B, C or D.', items: [
      [27, 'According to the writer, languages usually disappear', 'B', ['suddenly, after a disaster.', 'gradually, over several generations.', 'when governments ban them.', 'because of the internet.']],
      [28, 'Why do parents often stop passing on a minority language?', 'A', ['They believe another language will help their children more.', 'Teachers advise them to.', 'They have forgotten the language themselves.', 'Their children refuse to learn it.']],
      [29, 'The writer mentions languages with no words for left and right to show that', 'B', ['some languages are simpler than others.', 'studying many languages can challenge accepted ideas.', 'compass directions are easier to learn.', 'these languages are disappearing fastest.']],
      [30, 'What helped Welsh and Maori to grow?', 'C', ['online dictionaries', 'payments to speakers', 'schools that teach every subject in the language', 'recordings made by outside experts']],
    ] },
    { t: 'Questions 31–35', i: YNNG_I, sel: YN, items: [
      [31, 'Parents who choose a dominant language for their children are acting unreasonably.', 'NO'],
      [32, 'Knowledge about the local environment can be lost when a language dies.', 'YES'],
      [33, 'The effect on speakers\' sense of identity is the strongest reason to care about language loss.', 'YES'],
      [34, 'Hebrew is now easier to learn than Welsh.', 'NOT GIVEN'],
      [35, 'Teaching a language only in classrooms is unlikely to save it.', 'YES'],
    ] },
    { t: 'Questions 36–40', i: 'Complete the summary using the list of words, A–I, below.',
      box: 'A&nbsp; cheap &nbsp; B&nbsp; scattered &nbsp; C&nbsp; needed &nbsp; D&nbsp; abandon &nbsp; E&nbsp; expensive &nbsp; F&nbsp; everyday &nbsp; G&nbsp; elderly &nbsp; H&nbsp; improve &nbsp; I&nbsp; academic',
      head: 'Saving a language', sel: LET('ABCDEFGHI'), items: [
      [36, 'Documenting a language is easier now that recording equipment is ___.', 'A'],
      [37, 'The internet helps ___ speakers stay in touch.', 'B'],
      [38, 'Revival needs places where the language is actually ___.', 'C'],
      [39, 'Children who use a language only at school often ___ it later.', 'D'],
      [40, 'A language must have a role in ___ life.', 'F'],
    ] },
  ] },
]);
