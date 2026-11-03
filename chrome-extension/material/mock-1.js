
/* ---------- content ---------- */
const TF = ['TRUE', 'FALSE', 'NOT GIVEN'], YN = ['YES', 'NO', 'NOT GIVEN'];

const LISTENING = [
  { title: 'Part 1', script: [
    ['N', 'Part 1. You will hear a telephone conversation between a man who wants to hire some bikes and an employee at a bike hire company. First, you have some time to look at questions 1 to 5.'],
    ['P', 30, 'Look at questions 1 to 5'],
    ['N', 'Now listen carefully and answer questions 1 to 5.'],
    ['W', 'Good morning, Riverside Bike Hire, Megan speaking. How can I help you?'],
    ['M', "Oh, hello. I'm hoping to hire some bikes for a family weekend away next month."],
    ['W', 'Lovely. Let me open a booking form. Could I have your name, please?'],
    ['M', "Yes, it's Daniel Hartley."],
    ['W', 'Is that H. A. R. T. L. E. Y.?'],
    ['M', "That's right."],
    ['W', 'And a contact number?'],
    ['M', "It's oh seven nine four five, three eight one, two six oh."],
    ['W', 'Thank you. So how many bikes will you need?'],
    ['M', "Well, there are four of us, but my son is only two, so he'll go in a child seat on my bike. So three bikes: one for me, one for my wife, and one for our daughter."],
    ['W', 'Three bikes. And which dates were you thinking of?'],
    ['M', "We arrive on Friday the fifteenth of May, but we'd like to collect the bikes on the Saturday, the sixteenth, and return them on, well, I was going to say Monday, but actually we have to leave on Sunday evening. So the seventeenth."],
    ['W', 'So that is two days. Now, for you and your wife, would you like standard mountain bikes, or have you thought about our electric bikes?'],
    ['M', 'How much more are the electric ones?'],
    ['W', "They're thirty-five pounds a day, compared with twenty-two for a mountain bike. But the route along the valley is quite hilly."],
    ['M', "Hmm. My wife hasn't cycled for years, so let's go for electric for both of us."],
    ['W', 'Good choice. And your daughter?'],
    ['M', "She's nine. She's quite tall for her age, though."],
    ['W', "Then a twenty-four-inch bike should fit her. That's fifteen pounds a day. And the child seat for your son is free of charge."],
    ['M', 'Great. Are helmets included?'],
    ['W', 'Yes, helmets are included for everyone. The only extra that people usually pay for is a lock. Those are three pounds a day each.'],
    ['M', "We'd better have two of those, then."],
    ['N', 'Before you hear the rest of the conversation, you have some time to look at questions 6 to 10.'],
    ['P', 30, 'Look at questions 6 to 10'],
    ['N', 'Now listen and answer questions 6 to 10.'],
    ['W', 'So, let me work out the total. Two electric bikes at thirty-five, one bike at fifteen, and two locks at three each. That comes to ninety-one pounds a day.'],
    ['M', "OK, that's fine."],
    ['W', "Now, where would you like to collect them? We have a kiosk at the railway station, but it's quite small, and the electric bikes are only available from our main shop."],
    ['M', 'Then the main shop, please. Where is that exactly?'],
    ['W', "It's on Fenwick Street, near the bridge. That's F. E. N. W. I. C. K."],
    ['M', 'And what time do you open?'],
    ['W', 'We open at nine, but bikes for booked customers are ready from half past nine, after our mechanic has checked them.'],
    ['M', 'Half past nine is perfect.'],
    ['W', "We'll need a deposit to hold the booking. We don't take cash for deposits, I'm afraid, and we've stopped accepting cheques. Is a credit card OK?"],
    ['M', "Yes, I'll give you the details at the end."],
    ['W', 'And when you collect the bikes, please bring some photo ID. A passport or a driving licence is fine.'],
    ['M', "My driving licence is easier to carry around than my passport, so I'll bring that."],
    ['W', 'Lovely. Is there anything else I can help you with?'],
    ['M', 'Actually, yes. Is there anywhere along the route to stop for lunch?'],
    ['W', 'The Old Mill café, about halfway. Their soup is famous.'],
    ['M', 'Brilliant, thanks very much.'],
    ['N', 'That is the end of Part 1.'],
  ], groups: [
    { t: 'Questions 1–10', i: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.', head: 'Riverside Bike Hire · Booking form', items: [
      [1, 'Name: Daniel ___', ['hartley']],
      [2, 'Number of bikes: ___', ['3', 'three']],
      [3, 'Dates: 16 May to ___ May', ['17', '17th', 'seventeenth', 'the 17th']],
      [4, 'Bikes for the two adults: ___ bikes', ['electric']],
      [5, 'Extras: 2 × ___ (£3 a day each)', ['locks', 'lock', 'bike locks']],
      [6, 'Total cost per day: £___', ['91', 'ninety-one']],
      [7, 'Collect from the main shop on ___ Street', ['fenwick']],
      [8, 'Bikes ready from ___ a.m.', ['9.30', '9:30', 'half past nine', '9.30am', '9:30am', '9.30 am', '9:30 am']],
      [9, 'Deposit paid by: ___', ['credit card', 'card']],
      [10, 'Photo ID to bring: ___', ['driving licence', 'driving license', 'licence', 'license', "driver's licence", "driver's license"]],
    ] },
  ] },
  { title: 'Part 2', script: [
    ['N', 'Part 2. You will hear a ranger giving information to visitors at Hollins Valley Nature Reserve. First, you have some time to look at questions 11 to 15.'],
    ['P', 30, 'Look at questions 11 to 15'],
    ['N', 'Now listen carefully and answer questions 11 to 15.'],
    ['M', "Good morning, everyone, and welcome to Hollins Valley Nature Reserve. My name's Tom, and I'm one of the rangers here. Before you set off, I'd like to tell you a little about the reserve and what's on today."],
    ['M', "The reserve was created in 1998 on land that had been used for gravel extraction. When the quarrying company left, the pits filled with water, and that's how our lakes were formed. A lot of people assume the lakes are natural, or that they were dug for fishing, but in fact they're the result of industry."],
    ['M', "Today the reserve covers about a hundred and forty hectares. It's managed by a charity, and although we get some money from the local council, most of our funding now comes from our members. We have over six thousand of them, and their subscriptions pay for most of the work you'll see. Parking is free, by the way, so that isn't a source of income for us."],
    ['M', "We've had a busy year. The big news is that otters have returned to the river. We'd been hoping to see them for years, and in March one of our volunteers finally photographed one. We're also pleased that the number of nesting lapwings has doubled. Unfortunately, the kingfishers we used to see by the bridge haven't been back since the floods two winters ago."],
    ['M', "Now, a few rules. Dogs are welcome on the main paths, but they must be kept on a lead between March and July, when birds are nesting. Please don't feed bread to the ducks. It's bad for them and it pollutes the water. We sell proper duck food at the visitor centre. And cycling is allowed only on the outer track, not on the paths around the lakes."],
    ['M', "If you'd like to help, we're always looking for volunteers. You don't need any experience, as we provide training, but we do ask volunteers to commit to at least one day a month. Most of the work is outdoors: things like repairing fences and clearing paths."],
    ['N', 'Now look at questions 16 to 20.'],
    ['P', 20, 'Look at questions 16 to 20'],
    ['N', 'Now listen and answer questions 16 to 20.'],
    ['M', "Let me tell you what's happening around the reserve today. If you look at the map on your leaflet, we'll start at Heron Lake, on the west side. We used to run pond dipping for children there, but the banks are too steep, so that's moved. What Heron Lake has now is our new hide, with big windows and benches, so it's the best place on the reserve for watching birds. Bring binoculars if you have them."],
    ['M', "The Old Mill, on the river, used to house our café, but the café has moved. The mill is now the base for our photography workshop, which starts at eleven o'clock today."],
    ['M', "Beech Wood is lovely at this time of year. There are tables under the trees, so it's a good place to stop and eat your sandwiches. There's nowhere to buy food there, though, so bring everything with you."],
    ['M', "The visitor centre, where we are now, has the shop and our new café, which serves hot lunches until three. If you want to hire bikes, that's done from the car park by the main gate, not here."],
    ['M', "And finally, North Meadow. It's an open area of grassland with a small pond at the far end, and that's where children can now do pond dipping. Nets are free, just ask at the visitor centre. We also run bat walks in the evenings, but those start from the car park."],
    ['N', 'That is the end of Part 2.'],
  ], groups: [
    { t: 'Questions 11–15', i: 'Choose the correct letter, A, B or C.', items: [
      [11, 'The lakes in the reserve were originally created by', 'B', ['natural flooding.', 'gravel extraction.', 'a fishing club.']],
      [12, 'Most of the reserve’s funding comes from', 'C', ['the local council.', 'car parking fees.', 'membership subscriptions.']],
      [13, 'According to the speaker, the biggest news this year is', 'A', ['the return of otters.', 'an increase in nesting lapwings.', 'kingfishers nesting by the bridge.']],
      [14, 'Visitors are asked to', 'B', ['keep dogs on a lead all year.', 'avoid feeding bread to the ducks.', 'cycle only on the paths around the lakes.']],
      [15, 'Volunteers must', 'B', ['have previous experience.', 'work at least one day a month.', 'work mainly in the visitor centre.']],
    ] },
    { t: 'Questions 16–20', i: 'What can visitors do at each of the following places? Choose FIVE answers from the box and write the correct letter, A–G, next to questions 16–20.',
      box: 'A&nbsp; watch birds from a hide<br>B&nbsp; join a bat walk<br>C&nbsp; go pond dipping<br>D&nbsp; have a picnic<br>E&nbsp; buy a hot lunch<br>F&nbsp; hire bikes<br>G&nbsp; join a photography workshop',
      sel: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], items: [
      [16, 'Heron Lake', 'A'], [17, 'The Old Mill', 'G'], [18, 'Beech Wood', 'D'], [19, 'Visitor centre', 'E'], [20, 'North Meadow', 'C'],
    ] },
  ] },
  { title: 'Part 3', script: [
    ['N', 'Part 3. You will hear two students, Leah and Sam, discussing a presentation they are preparing on rooftop gardens. First, you have some time to look at questions 21 to 25.'],
    ['P', 30, 'Look at questions 21 to 25'],
    ['N', 'Now listen carefully and answer questions 21 to 25.'],
    ['W', 'Hi Sam. Have you had a chance to look at the draft of our presentation?'],
    ['M', "Yes, I went through it last night. I think it's coming together, but I'm worried it's too long. We've got fifteen minutes and I think we're at about twenty."],
    ['W', 'I thought so too. Before we cut anything, though, can we talk about the survey? I was surprised by the results.'],
    ['M', "Me too. I expected most people to say they'd want a rooftop garden to grow food, but actually the most common reason was just having somewhere quiet to sit."],
    ['W', 'Yes. Growing food came quite low, even below improving the look of the building.'],
    ['M', 'The other thing I noticed was the response rate. We sent the questionnaire to two hundred residents and only forty-three replied.'],
    ['W', "That's not bad for a postal survey, though. My cousin did one for her dissertation and got about fifteen percent."],
    ['M', 'True. I suppose what bothers me more is that nearly all our replies came from the two newer buildings. We hardly heard from the older blocks at all.'],
    ['W', "So the sample isn't really representative. We should mention that as a limitation."],
    ['W', 'Now, the structural engineer we interviewed, Mr Okafor. What did you think was the most useful thing he told us?'],
    ['M', "For me, it was the point about weight. I hadn't realised that wet soil can weigh almost twice as much as dry soil, so a roof that's fine in summer might be overloaded after heavy rain."],
    ['W', 'I found that interesting too, but I thought his point about waterproofing was more important. He said most problems with roof gardens are leaks, not collapse.'],
    ['M', "OK, but we agreed to focus on the structural side, didn't we? Let's keep the weight point."],
    ['W', 'Fine. Then there is the case study. I wanted to use the hospital in Leeds, but Doctor Fry said in the seminar that case studies should ideally be local, and the library here in town has that new roof garden.'],
    ['M', 'The library one is much smaller, though.'],
    ['W', 'It is, but we can actually go and visit it, and take our own photos rather than using ones from the internet.'],
    ['M', "Good point. Let's switch to the library."],
    ['M', 'What about the cost figures? I found a report saying a basic rooftop garden costs about a hundred pounds per square metre.'],
    ['W', 'Is that recent?'],
    ['M', "It's from 2015."],
    ['W', 'Then prices will have gone up a lot since then. We should either find something newer or leave the figure out.'],
    ['M', "Fair enough. I'll look for a newer source this week."],
    ['N', 'Now look at questions 26 to 30.'],
    ['P', 20, 'Look at questions 26 to 30'],
    ['N', 'Now listen and answer questions 26 to 30.'],
    ['W', "Right, so how do we get it down to fifteen minutes? Let's go section by section. The introduction?"],
    ['M', "I think the content's fine as it is, but it's quite dry. A couple of photos of different roof gardens would make it much more engaging."],
    ['W', 'Agreed. Then the history section. It runs to nearly four minutes at the moment.'],
    ['M', "It's interesting, but it's not really what the assignment asked for. I'd cut it down to one slide, maybe a minute. I wouldn't get rid of it altogether, because it gives some context."],
    ['W', 'Yes, OK. The case study. We need to redo it anyway for the library. Could we film a short clip when we visit, walking round the garden?'],
    ['M', "If the library lets us. Let's plan on that."],
    ['W', 'And the costs section?'],
    ['M', "If I can't find newer figures, there won't be much left of it. Honestly, I'd take it out completely and just mention cost briefly in the conclusion."],
    ['W', "OK, let's drop it. And the conclusion? I'm not sure whether we should end with recommendations or with questions for the audience."],
    ['M', "Neither am I. Doctor Fry has strong opinions about that. Let's email her and ask what she prefers."],
    ['N', 'That is the end of Part 3.'],
  ], groups: [
    { t: 'Questions 21–25', i: 'Choose the correct letter, A, B or C.', items: [
      [21, 'What surprised the students about the survey results?', 'B', ['Most people wanted to grow food.', 'The most common reason was having a quiet place to sit.', 'Few people cared about the appearance of buildings.']],
      [22, 'What is Sam’s main concern about the survey?', 'B', ['The number of replies was too low.', 'Most replies came from the same buildings.', 'Some questions were unclear.']],
      [23, 'Which point from the engineer do they decide to include?', 'A', ['the extra weight of wet soil', 'the risk of leaks', 'the cost of inspections']],
      [24, 'Why do they choose the library as their case study?', 'B', ['It is larger than the hospital.', 'They can visit it themselves.', 'Their tutor recommended it by name.']],
      [25, 'What problem do they find with the cost figure?', 'B', ['It comes from an unreliable source.', 'It is out of date.', 'It only applies to large buildings.']],
    ] },
    { t: 'Questions 26–30', i: 'What do the students decide to do with each section of their presentation? Choose FIVE answers from the box and write the correct letter, A–F.',
      box: 'A&nbsp; make it shorter<br>B&nbsp; add more images<br>C&nbsp; include a video<br>D&nbsp; remove it completely<br>E&nbsp; move it to the beginning<br>F&nbsp; ask the tutor for advice',
      sel: ['A', 'B', 'C', 'D', 'E', 'F'], items: [
      [26, 'Introduction', 'B'], [27, 'History', 'A'], [28, 'Case study', 'C'], [29, 'Costs', 'D'], [30, 'Conclusion', 'F'],
    ] },
  ] },
  { title: 'Part 4', script: [
    ['N', 'Part 4. You will hear a lecture about bioluminescence. First, you have some time to look at questions 31 to 40.'],
    ['P', 45, 'Look at questions 31 to 40'],
    ['N', 'Now listen carefully and answer questions 31 to 40.'],
    ['W', "Today I'm going to talk about bioluminescence: the production of light by living things. Unlike the light from an ordinary bulb, this light produces almost no heat, which is why it's sometimes called cold light."],
    ['W', 'It is the result of a chemical reaction inside the organism, in which a molecule called luciferin reacts with oxygen. The reaction is controlled by an enzyme, generally known as luciferase.'],
    ['W', 'On land, the best-known examples are fireflies, and some fungi glow too. But bioluminescence is far more common in the sea. Researchers who used cameras on deep-sea vehicles found that around three-quarters of the animals they recorded could produce light.'],
    ['W', 'So why produce light at all? There are several functions. The first is defence. Some squid, when they are attacked, release a cloud of glowing liquid, which confuses the predator while the squid escapes, rather like the ink of an ordinary octopus.'],
    ['W', "A second function is camouflage. This may sound strange. How can light hide you? But many animals that live in the middle depths have light-producing organs on their bellies. A predator below, looking up, sees the animal's dark shape against the faint light from the surface. By producing light that matches it, the animal makes its silhouette disappear. This is known as counter-illumination."],
    ['W', 'The third function is finding food. The anglerfish is the famous example. It has a glowing lure hanging in front of its mouth, and small fish that are attracted to the light swim straight towards it.'],
    ['W', 'And finally, light is used for communication. Some species of shrimp, for instance, flash in particular patterns, which seems to help them find a mate.'],
    ['W', 'Bioluminescence also has practical uses for humans. The genes responsible have been widely used in medical research. Scientists can attach them to other genes and see, quite literally, when those genes are switched on.'],
    ['W', 'And there has been experimental work on using glowing bacteria to monitor water quality. When toxic chemicals are present, the bacteria glow less brightly, which gives an early warning of pollution.'],
    ['N', 'That is the end of the Listening test.'],
  ], groups: [
    { t: 'Questions 31–40', i: 'Complete the notes below. Write ONE WORD ONLY for each answer.', head: 'Bioluminescence', items: [
      [31, 'Light is produced by a ___ reaction inside the organism', ['chemical']],
      [32, 'Sometimes called “___ light” because it gives off almost no heat', ['cold']],
      [33, 'A molecule called luciferin reacts with ___', ['oxygen']],
      [34, 'Researchers used ___ on deep-sea vehicles; about three-quarters of the animals recorded could produce light', ['cameras', 'camera']],
      [35, 'Defence: some squid release glowing liquid to ___ predators', ['confuse']],
      [36, 'Camouflage: light organs on the animal’s ___ hide its silhouette', ['bellies', 'belly']],
      [37, 'Food: the anglerfish uses a glowing ___ to attract small fish', ['lure']],
      [38, 'Communication: some shrimp flash in patterns to find a ___', ['mate']],
      [39, 'Uses: the genes are used in ___ research', ['medical']],
      [40, 'Bacteria glow less brightly when water contains ___ chemicals', ['toxic']],
    ] },
  ] },
];

const READING = [
  { title: 'Reading Passage 1 · The return of the beaver', hint: 'Spend about 20 minutes on Questions 1–13.', text: [
    'For around four hundred years, the Eurasian beaver was absent from Britain. Hunted for its fur, its meat and a substance called castoreum, which was used in medicine and perfume, the animal had disappeared from England and Wales by the sixteenth century, and probably from Scotland not long afterwards. Today, however, beavers are once again building dams in British rivers, and their return has become one of the most closely watched experiments in British conservation.',
    'The first official reintroduction took place in 2009, when a small number of beavers brought from Norway were released in Knapdale Forest in western Scotland as part of a five-year trial. At around the same time, a separate population was discovered living wild on the River Tay in eastern Scotland. Nobody knows exactly how these animals got there, although most experts believe they escaped from private collections or were released illegally. Rather than removing them, the Scottish government eventually decided to allow both populations to remain, and in 2019 the beaver was given legal protection in Scotland.',
    'In England, a similar story unfolded on the River Otter in Devon. In 2013, a family of beavers was filmed on the river, again of unknown origin. Government officials initially planned to capture them, but after protests from local people, a five-year study was set up instead. When the study ended in 2020, the beavers were allowed to stay, the first wild breeding population in England to be officially permitted for centuries.',
    'What makes beavers so interesting to scientists is the scale of their effect on the landscape. Beavers are often described as "ecosystem engineers". By cutting down trees and building dams, they turn fast-flowing streams into a series of ponds and wetlands. These new habitats are quickly colonised by insects, amphibians and birds, and studies in Scotland have recorded clear increases in the number of species found near beaver sites.',
    'Beaver dams also affect how water moves through a river system. Because the ponds behind the dams hold back water, they reduce the peak flow after heavy rain, which can lower the risk of flooding in towns downstream. The dams also trap soil and pollutants washed off farmland, so that the water leaving a beaver site is often cleaner than the water entering it. In dry periods, the opposite effect is seen: the ponds release water slowly, helping to keep rivers flowing.',
    'Not everyone welcomes the beaver’s return, however. Farmers whose fields lie next to rivers complain that dams can cause land to flood, and that beavers damage valuable trees. In Scotland, a licensing system allows landowners to remove dams, or in some cases to have beavers killed, if they cause serious damage. Conservation groups argue that moving problem animals to new areas is a better solution, and the Scottish government has since agreed to support this approach.',
    'Supporters of the beaver point out that many conflicts can be managed with relatively simple measures. A pipe can be fitted through a dam to control the level of the water behind it, and wire mesh wrapped around the trunks of important trees will stop beavers from cutting them down. They also argue that the economic benefits of beavers, through reduced flooding, cleaner water and wildlife tourism, should be weighed against the costs to individual landowners. Whether these arguments will persuade the people who live and work alongside the animals remains to be seen.',
  ], groups: [
    { t: 'Questions 1–7', i: 'Do the following statements agree with the information given in Reading Passage 1? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.', sel: TF, items: [
      [1, 'Beavers were hunted in Britain partly for a substance used in perfume.', 'TRUE'],
      [2, 'Beavers disappeared from Scotland before they disappeared from England.', 'FALSE'],
      [3, 'The beavers released at Knapdale were brought from another country.', 'TRUE'],
      [4, 'Scientists have established exactly how beavers reached the River Tay.', 'FALSE'],
      [5, 'Local people opposed the plan to remove the beavers from the River Otter.', 'TRUE'],
      [6, 'The River Otter beavers have since spread to several other rivers in England.', 'NOT GIVEN'],
      [7, 'Beaver ponds attract more fish than other types of pond.', 'NOT GIVEN'],
    ] },
    { t: 'Questions 8–13', i: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.', head: 'The effects of beavers', items: [
      [8, 'Dams reduce peak flow after heavy rain, which can lower the risk of ___ downstream', ['flooding']],
      [9, 'Dams trap soil and ___ from farmland', ['pollutants']],
      [10, 'In dry periods, ponds release water ___', ['slowly']],
      [11, 'Farmers complain that beavers damage valuable ___', ['trees']],
      [12, 'A ___ fitted through a dam can control the water level', ['pipe']],
      [13, 'Wire ___ around tree trunks stops beavers cutting them down', ['mesh']],
    ] },
  ] },
  { title: 'Reading Passage 2 · The box that changed the world', hint: 'Spend about 20 minutes on Questions 14–26. Reading Passage 2 has seven paragraphs, A–G.', letters: true, text: [
    'Before the 1950s, loading a cargo ship was slow, labour-intensive work. Goods arrived at the docks in sacks, barrels, crates and bales of every shape and size, and each item had to be lifted individually into the ship’s hold by teams of dockworkers. A typical cargo ship could spend almost as long in port being loaded and unloaded as it did at sea. Theft was common, and damage to goods even more so. For many products, the cost of moving them from a factory to a ship was greater than the cost of carrying them across the ocean.',
    'The man most often credited with changing this was not a sailor but a trucking businessman. Malcolm McLean had built up one of the largest trucking companies in the United States, and he was frustrated by the hours his drivers spent waiting at ports while their loads were transferred to ships. His idea was simple: instead of unloading the goods from a truck, why not lift the entire trailer body onto the ship? In 1956, a converted oil tanker, the Ideal-X, sailed from Newark, New Jersey, to Houston, Texas, carrying fifty-eight such containers.',
    'The financial results were striking. McLean calculated that loading loose cargo onto a medium-sized ship cost $5.83 per ton. For the Ideal-X, the cost was less than 16 cents per ton. Ships also spent far less time in port, which meant they could make more voyages each year. Even so, the idea spread slowly at first. Shipping lines had invested heavily in conventional vessels, and most ports lacked the cranes needed to lift containers.',
    'One major obstacle was the lack of agreement on size. Different companies built containers of different lengths, and a container designed for one company’s ships could not easily be carried on another’s. During the 1960s, after long negotiations, international standards were agreed for container dimensions and for the corner fittings used to lift containers and lock them together. The 20-foot container became the industry’s basic unit of measurement, and the capacity of ships and ports is still described in "twenty-foot equivalent units", or TEU.',
    'Military demand also played a part. During the Vietnam War, the US armed forces struggled to supply their troops through congested ports. McLean’s company won a contract to carry supplies in containers, and the system proved so efficient that its reputation grew rapidly. Ships returning empty from Vietnam stopped in Japan to collect goods for the American market, establishing one of the first major container routes across the Pacific.',
    'The impact on dockworkers was severe. Ports that had employed tens of thousands of workers needed only a fraction of that number once containers arrived. In cities such as New York and London, traditional docks closed and activity moved to new container terminals, often some distance away, where there was room for vast storage areas and cranes. Trade unions resisted the change, but could do little to stop it.',
    'Today, the great majority of manufactured goods travel by sea in containers, and the largest ships can carry more than 20,000 TEU. Economists have argued that containerisation did more to encourage world trade than many trade agreements, by making it cheap enough to manufacture goods in one country and sell them on the other side of the world. In this sense, the humble metal box helped to create the global supply chains on which modern economies depend.',
  ], groups: [
    { t: 'Questions 14–20', i: 'Reading Passage 2 has seven paragraphs, A–G. Choose the correct heading for each paragraph from the list of headings below.',
      box: 'i&nbsp;&nbsp; Agreeing on a common design<br>ii&nbsp; Government support for new ports<br>iii The inefficiency of traditional cargo handling<br>iv&nbsp; War as an unexpected opportunity<br>v&nbsp;&nbsp; Why ships became larger and faster<br>vi&nbsp; An outsider with a simple solution<br>vii The human cost of change<br>viii Dramatic savings but a slow start<br>ix&nbsp; Early experiments with wooden boxes<br>x&nbsp;&nbsp; A transformation of global trade',
      sel: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'], items: [
      [14, 'Paragraph A', 'iii'], [15, 'Paragraph B', 'vi'], [16, 'Paragraph C', 'viii'], [17, 'Paragraph D', 'i'], [18, 'Paragraph E', 'iv'], [19, 'Paragraph F', 'vii'], [20, 'Paragraph G', 'x'],
    ] },
    { t: 'Questions 21–23', i: 'Choose the correct letter, A, B, C or D.', items: [
      [21, 'Why was McLean interested in improving cargo handling?', 'B', ['He had previously worked at a port.', 'His trucks were delayed at ports.', 'A shipping line asked him for help.', 'He wanted to reduce theft.']],
      [22, 'According to paragraph C, why did containerisation spread slowly at first?', 'A', ['Shipping lines had already spent money on traditional ships.', 'The cost savings were smaller than expected.', 'Dockworkers refused to handle containers.', 'Containers were often damaged at sea.']],
      [23, 'What does the writer say about the Vietnam War?', 'B', ['It delayed the growth of containerisation.', 'It led to a new trade route across the Pacific.', 'It caused several American ports to close.', 'It forced companies to agree on standard sizes.']],
    ] },
    { t: 'Questions 24–26', i: 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', items: [
      [24, 'Containers are lifted and locked together using standard ___.', ['corner fittings', 'fittings']],
      [25, 'New container terminals were often built away from city centres because they needed space for storage areas and ___.', ['cranes']],
      [26, 'Some economists believe containerisation did more to encourage world trade than many ___.', ['trade agreements', 'agreements']],
    ] },
  ] },
  { title: 'Reading Passage 3 · Too much choice?', hint: 'Spend about 20 minutes on Questions 27–40.', text: [
    'In 2000, the psychologists Sheena Iyengar and Mark Lepper published a study that would become one of the most frequently cited in research on consumer behaviour. In a supermarket in California, they set up a tasting stand offering samples of jam. On some days, the stand displayed 24 different flavours; on others, only six. The larger display attracted more attention: around 60 per cent of passing shoppers stopped to taste, compared with 40 per cent when the selection was small. But when it came to buying, the pattern reversed. Of those who stopped at the large display, only 3 per cent went on to buy a jar, whereas 30 per cent of those who saw the smaller selection did so.',
    'The study seemed to confirm something many people already suspected: that having too many options can be paralysing. The idea was popularised by the psychologist Barry Schwartz in his 2004 book The Paradox of Choice, which argued that the explosion of consumer choice in wealthy societies was making people not freer but more anxious. Faced with dozens of options, Schwartz suggested, people worry about making the wrong decision, and even when they do choose, they are more likely to regret it, imagining that one of the alternatives might have been better.',
    'Schwartz drew an important distinction between two types of decision-maker. "Maximisers" feel they must examine every option in order to find the best one, while "satisficers" are content to stop searching once they find something that meets their requirements. According to Schwartz, maximisers often make objectively better choices (they may, for instance, find jobs with higher salaries) but they tend to feel worse about them. Satisficers, by contrast, are generally happier with what they choose, even if it is not the best available.',
    'The concept of "choice overload" quickly spread beyond academic psychology. Businesses reduced the number of products on their shelves, and policy-makers discussed whether pension schemes and health insurance plans offered too many options for ordinary people to compare. It seemed to be one of those rare psychological findings with obvious practical value.',
    'However, as researchers tried to repeat the original experiments, a more complicated picture emerged. In 2010, a team led by Benjamin Scheibehenne combined the results of 50 experiments on choice overload in a single analysis. They found that, on average, the effect was close to zero. Some studies found that more options reduced people’s willingness to choose; others found that more options increased it; and many found no difference at all.',
    'This does not necessarily mean that choice overload is a myth. A later review, published in 2015, suggested that the effect is real but appears only under certain conditions. Large sets of options seem to be most harmful when the options are difficult to compare, when people do not know in advance what they prefer, and when they feel under pressure to decide quickly. Choosing between 24 jams, most of which taste broadly similar and none of which matter very much, is likely to be a very different experience from choosing between 24 pension plans with complex conditions.',
    'In my view, the story of choice overload offers a lesson that goes beyond shopping. It is tempting, when a single study produces a striking and memorable result, to treat it as a universal law. The jam study was well designed and genuinely interesting, but it was a single experiment conducted in one supermarket on a handful of days. The enthusiasm with which it was adopted by authors, businesses and governments arguably ran well ahead of the evidence.',
    'None of this means that we should ignore the problem entirely. For people making important and complicated decisions, there is good reason to think that sensible default options, simple comparisons and expert advice can help. But the solution is unlikely to be as simple as offering fewer options. Rather, it lies in helping people to understand the options they have.',
  ], groups: [
    { t: 'Questions 27–31', i: 'Choose the correct letter, A, B, C or D.', items: [
      [27, 'In the jam study, the larger display', 'B', ['attracted fewer shoppers but more buyers.', 'attracted more shoppers but led to fewer purchases.', 'led to more purchases among regular customers.', 'was preferred by most of the shoppers who tasted the jam.']],
      [28, 'According to Schwartz, people faced with many options are more likely to', 'C', ['choose the cheapest option.', 'ask other people for advice.', 'regret the choice they make.', 'buy more than one product.']],
      [29, 'What does Schwartz say about maximisers?', 'C', ['They usually earn less than satisficers.', 'They make worse decisions than satisficers.', 'They may choose well but feel less satisfied.', 'They find decisions easier than satisficers do.']],
      [30, 'The 2010 analysis led by Scheibehenne found that', 'B', ['choice overload occurs in most situations.', 'the average effect of choice overload was very small.', 'the jam study had been badly designed.', 'more options always increase willingness to choose.']],
      [31, 'According to the 2015 review, choice overload is most likely when people', 'C', ['are choosing between options that are easy to compare.', 'already know what they want.', 'feel they must decide quickly.', 'are buying inexpensive products.']],
    ] },
    { t: 'Questions 32–36', i: 'Do the following statements agree with the views of the writer in Reading Passage 3? Choose YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.', sel: YN, items: [
      [32, 'Research has shown that choice overload does not exist.', 'NO'],
      [33, 'Choosing a pension plan is likely to be harder than choosing a jam.', 'YES'],
      [34, 'The jam study was poorly designed.', 'NO'],
      [35, 'Businesses that reduced their product ranges lost money as a result.', 'NOT GIVEN'],
      [36, 'The jam study was adopted with more enthusiasm than the evidence justified.', 'YES'],
    ] },
    { t: 'Questions 37–40', i: 'Complete each sentence with the correct ending, A–F, below.',
      box: 'A&nbsp; offered too many options for ordinary people to compare.<br>B&nbsp; were more likely to choose an expensive option.<br>C&nbsp; are generally happier with what they choose.<br>D&nbsp; should be required by law.<br>E&nbsp; do not know in advance what they prefer.<br>F&nbsp; is a better solution than simply offering fewer options.',
      sel: ['A', 'B', 'C', 'D', 'E', 'F'], items: [
      [37, 'Satisficers', 'C'], [38, 'Policy-makers discussed whether pension schemes', 'A'],
      [39, 'Large sets of options are most harmful when people', 'E'], [40, 'The writer believes that helping people understand their options', 'F'],
    ] },
  ] },
];

const CHART = { labels: ['Car', 'Bus', 'Train', 'Bicycle', 'Walking'], a: [52, 18, 10, 5, 15], b: [38, 21, 16, 14, 11] };

const MODEL1 = `<p>The bar chart compares the proportion of commuters in Greenford who travelled to work by car, bus, train, bicycle and on foot in 2005 and 2025.</p>
<p>Overall, although the car remained the most common way of commuting in both years, its share fell considerably, while public transport and especially cycling became more popular. Walking was the only other mode to decline.</p>
<p>In 2005, more than half of all commuters (52%) drove to work, far more than used any other form of transport. By 2025, this figure had dropped by 14 percentage points to 38%. Walking also lost ground, falling from 15% to 11%.</p>
<p>By contrast, the remaining three modes all grew. The most dramatic change was in cycling, which almost tripled from just 5% to 14%. Train use rose from 10% to 16%, while the bus saw a smaller increase, from 18% to 21%, making it the second most popular choice in 2025.</p>
<p>As a result, the gap between the car and other forms of transport narrowed significantly over the twenty-year period.</p>`;

const MODEL2 = `<p>Over the past few decades, studying abroad has changed from a privilege of the wealthy few into a common ambition for young people in many countries. While this trend has some drawbacks, both for students and for their home countries, I believe the benefits are considerably greater.</p>
<p>The most obvious disadvantage is cost. Tuition fees for international students are often several times higher than those paid by local students, and living expenses in cities such as London or Sydney can be enormous. Many families take on serious debt, and if a graduate struggles to find well-paid work, this burden can last for years. A second concern is the so-called "brain drain": when talented young people stay in the country where they studied, their home country loses the doctors, engineers and researchers it has spent years educating.</p>
<p>However, these problems need to be weighed against substantial advantages. Studying abroad gives students access to universities, laboratories and teaching methods that may not exist at home, and a degree from an internationally respected institution can open doors throughout a career. Equally important is the personal development that comes from living independently in a foreign culture. Students learn to manage money, solve problems without family support and work with people from very different backgrounds, skills that employers increasingly value.</p>
<p>Furthermore, the brain drain argument is weaker than it first appears. Many graduates eventually return home with new skills, international contacts and sometimes money to invest, and even those who remain abroad often send money back to their families or collaborate with institutions in their home country.</p>
<p>In conclusion, although studying overseas can be expensive and may cause some countries to lose talented individuals in the short term, the academic, professional and personal benefits it brings, both to individuals and ultimately to their home societies, clearly outweigh these disadvantages.</p>`;

const SPEAK1 = [
  ['Your home town', ['Where is your home town?', 'What do you like most about it?', 'Has it changed much since you were a child?', 'Would you like to live there in the future? Why / why not?']],
  ['Mornings', ['Are you a morning person?', 'What do you usually do in the morning?', 'Do you do the same things every morning?', 'Has your morning routine changed recently?']],
  ['Photos', ['Do you like taking photos?', 'What do you usually take photos of?', 'Do you prefer to keep photos on your phone or to print them?', 'Is there a photo you remember particularly well?']],
];
const SPEAK3 = [
  ['Learning skills', ['What skills do you think young people should learn at school that they don’t learn now?', 'Is it better to learn a skill from a teacher or by yourself, using the internet?', 'Why do some people stop learning new skills as they get older?']],
  ['Technology and skills', ['Some people say technology is making skills like handwriting or map reading unnecessary. Do you agree?', 'Which skills do you think will be most valuable in the workplace of the future?', 'Should employers pay for their staff to learn new skills? Why / why not?']],
];

/* ---------- storage ---------- */
const KEY = 'ielts-mock-1';
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
const norm = (s) => String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/^£/, '').replace(/\s+/g, ' ').trim().replace(/[.,]$/, '');
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
  const pref = (list) => list.find((v) => /en-GB/i.test(v.lang)) || list[0];
  const fem = en.filter((v) => FEMALE.test(v.name)), mal = en.filter((v) => !FEMALE.test(v.name));
  const W = pref(fem) || pref(en), M = pref(mal) || pref(en);
  const N = en.find((v) => v !== W && v !== M) || M || W;
  return { W, M, N };
}
const voicesReady = new Promise((res) => {
  if (!synth) return res();
  if (synth.getVoices().length) return res();
  synth.onvoiceschanged = () => res();
  setTimeout(res, 2000);
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
$('rStart').onclick = () => { $('rStart').disabled = true; countdown(60 * 60, 'Reading', submitReading); };
$('rSubmit').onclick = () => { if (S.Rdone || confirm('Submit the Reading section? You can’t change answers afterwards.')) submitReading(); };

/* ---------- writing ---------- */
function drawChart() {
  const W = 560, H = 300, L = 40, B = 250, max = 60, bw = 26, gap = (W - L - 20) / CHART.labels.length;
  const y = (v) => B - (v / max) * (B - 20);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" role="img" aria-label="Bar chart of commuting modes in Greenford, 2005 and 2025">`;
  for (let v = 0; v <= max; v += 10) s += `<line x1="${L}" x2="${W - 10}" y1="${y(v)}" y2="${y(v)}" stroke="currentColor" opacity=".15"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}%</text>`;
  CHART.labels.forEach((lab, i) => {
    const x = L + 14 + i * gap;
    [['a', 'var(--bar1)'], ['b', 'var(--bar2)']].forEach(([k, c], j) => {
      const v = CHART[k][i], xx = x + j * (bw + 3);
      s += `<rect x="${xx}" y="${y(v)}" width="${bw}" height="${B - y(v)}" fill="${c}"/><text x="${xx + bw / 2}" y="${y(v) - 4}" text-anchor="middle" font-size="11">${v}</text>`;
    });
    s += `<text x="${x + bw + 1}" y="${B + 18}" text-anchor="middle">${lab}</text>`;
  });
  s += `<rect x="${L}" y="${H - 22}" width="12" height="12" fill="var(--bar1)"/><text x="${L + 18}" y="${H - 12}">2005</text>`;
  s += `<rect x="${L + 70}" y="${H - 22}" width="12" height="12" fill="var(--bar2)"/><text x="${L + 88}" y="${H - 12}">2025</text>`;
  s += `<text x="${W - 10}" y="${H - 12}" text-anchor="end" opacity=".7">% of commuters, Greenford</text></svg>`;
  $('chart').innerHTML = s;
}
drawChart();
const words = (t) => (t.trim().match(/\S+/g) || []).length;
function wc(n, min) { const c = words($('w' + n).value); $('w' + n + 'c').textContent = `${c} words${c < min ? ` · under ${min}, which costs marks` : ''}`; $('w' + n + 'c').className = 'wc' + (c < min ? ' low' : ''); }
['1', '2'].forEach((n) => {
  $('w' + n).value = S['w' + n] || '';
  $('w' + n).addEventListener('input', () => { S['w' + n] = $('w' + n).value; save(); wc(n, n === '1' ? 150 : 250); });
  wc(n, n === '1' ? 150 : 250);
});
const showModels = () => { clearInterval(tick); $('clock').textContent = ''; $('wAfter').hidden = false; $('m1').innerHTML = MODEL1; $('m2').innerHTML = MODEL2; S.wdone = true; save(); };
$('wStart').onclick = () => { $('wStart').disabled = true; countdown(60 * 60, 'Writing', showModels); };
$('wDone').onclick = showModels;
$('wCopy').onclick = async () => {
  const txt = `Please mark my IELTS Academic Writing using the official band descriptors (Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Give a band for each criterion and each task, then the 3 changes that would raise my score most.\n\nTASK 1 (bar chart: % of commuters in Greenford by mode, 2005 → 2025: car 52→38, bus 18→21, train 10→16, bicycle 5→14, walking 15→11):\n${$('w1').value}\n\nTASK 2 (In many countries, a growing number of young people are choosing to study at universities abroad. Do the advantages of this trend outweigh the disadvantages?):\n${$('w2').value}`;
  try { await navigator.clipboard.writeText(txt); $('wCopied').textContent = 'Copied. Paste it into a chat with Claude.'; }
  catch (e) { $('wCopied').textContent = 'Copy failed. Select the text yourself and copy it.'; }
};
if (S.wdone) showModels();

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
if (S.Rdone) { mark('R', READING); showScore('R', 'rScore'); }
renderResults();
$('reset').onclick = () => { if (confirm('Clear every answer, essay and score for this mock?')) { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); } };
