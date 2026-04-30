import { pickOne } from '../lib/random'
import type { ReadingExam, ReadingQuestion } from '../types'

const p1Body = `Cities around the world are experimenting with ways to integrate vegetation into dense neighbourhoods. Beyond aesthetics, urban green space can reduce heat island effects, improve air quality, and support mental health. However, maintenance costs and unequal access remain persistent challenges. Some municipalities have introduced “green corridors” that connect parks, while others focus on rooftop gardens on public buildings. Research suggests that small, well-distributed patches of greenery may benefit residents more than a single large park on the edge of a city, particularly for daily walking and social contact. Critics argue that greening initiatives can accelerate gentrification if they are not paired with housing policies that protect long-term residents.`

const p2Body = `Organisations that adopted remote or hybrid schedules during the 2020s often reported stable productivity for routine tasks. Creative collaboration, however, appears more sensitive to medium: spontaneous brainstorming sessions are harder to replicate when calendars are tightly packed with video calls. Some firms have introduced quarterly in-person “design weeks” while keeping day-to-day work flexible. Surveys of employees in technology and media sectors suggest that junior staff benefit disproportionately from occasional face-to-face mentoring, though senior specialists sometimes prefer uninterrupted blocks of solitary work at home. No single policy fits every industry; the most successful programmes tend to combine explicit norms for availability with trust-based performance metrics rather than keystroke monitoring.`

const p3Body = `Microplastics enter rivers and lakes through wastewater, tyre dust, and degraded packaging. Once in the water column, particles may be ingested by invertebrates and move up food webs. Laboratory experiments show that concentrations above certain thresholds can reduce feeding rates in some species, though field studies sometimes produce mixed results because background pollution varies seasonally. Filtration technologies exist for drinking water plants, but they are costly to scale for entire catchments. Policy debates often centre on producer responsibility versus consumer behaviour change, with several European jurisdictions testing extended producer fees for synthetic textiles.`

const p4Body = `In many countries, public libraries have expanded far beyond book lending. Some run “makerspaces” with 3D printers, sewing machines, and basic electronics kits, aiming to reduce barriers to learning technical skills. Others host legal clinics, language exchanges, and job-search workshops. Supporters argue that these services increase the library’s relevance in a digital economy, particularly for people who lack home internet or quiet study space. Critics worry that expanding responsibilities can dilute core services if funding does not rise accordingly. Librarians also report that staff training must adapt: facilitating community programs requires different skills than cataloguing and circulation. Evidence from pilot programs suggests that when new services are co-designed with local residents, participation is higher and resources are used more efficiently.`

const p5Body = `Renewable electricity from wind and solar has become cheaper in many regions, yet matching supply with demand remains a challenge. Energy storage can help, but the most cost-effective approach depends on context. Short-duration batteries are well suited to smoothing hourly fluctuations, whereas pumped hydro can store energy for longer periods but requires specific geography. Another strategy is demand response: instead of generating more power, utilities encourage consumers to shift usage to times when electricity is abundant, for example by running industrial processes overnight or charging electric vehicles at midday. While demand response can reduce peak load, it raises questions about fairness, since not all households can easily change their routines. Policymakers therefore debate whether incentives should target large commercial users first or include broader subsidies for smart appliances.`

const p6Body = `Archaeologists increasingly use remote sensing to locate sites without excavation. Techniques include aerial photography, ground-penetrating radar, and LiDAR, which can reveal subtle changes in vegetation or terrain that indicate buried structures. LiDAR is particularly useful in forested regions because it can penetrate gaps in the canopy and produce detailed elevation models. However, data processing is complex and requires careful interpretation: natural features can mimic human-built patterns. Moreover, remote sensing does not replace excavation entirely, because artefacts and stratigraphy are needed to date a site and understand how it was used. Many projects therefore follow a staged approach, using remote sensing to narrow down promising areas before targeted digs. This can reduce costs and limit damage to fragile locations.`

function tfng(
  statement: string,
  answer: 'TRUE' | 'FALSE' | 'NOT GIVEN',
): ReadingQuestion {
  return { id: '_', kind: 'tfng', statement, answer }
}

function mcq(
  prompt: string,
  options: string[],
  answer: number,
): ReadingQuestion {
  return { id: '_', kind: 'mcq', prompt, options, answer }
}

/** Passage 1: 13 questions */
const SEC1: ReadingQuestion[] = [
  tfng(
    'Urban green space has no measurable effect on air quality in cities.',
    'FALSE',
  ),
  tfng(
    'Some cities prefer connecting existing parks rather than building new ones.',
    'TRUE',
  ),
  tfng(
    'The passage states that rooftop gardens are more popular than green corridors.',
    'NOT GIVEN',
  ),
  mcq(
    'According to the passage, what may matter most for residents’ daily experience?',
    [
      'One very large park on the outskirts',
      'Small green areas spread through the city',
      'Private gardens only',
    ],
    1,
  ),
  tfng(
    'Critics worry that greening alone might speed up gentrification without housing protections.',
    'TRUE',
  ),
  tfng(
    'Heat island effects are mentioned as something vegetation may reduce.',
    'TRUE',
  ),
  tfng(
    'All cities have identical policies for rooftop gardens.',
    'FALSE',
  ),
  tfng(
    'Mental health is listed as a possible benefit of urban greenery.',
    'TRUE',
  ),
  tfng(
    'The passage claims maintenance costs are irrelevant.',
    'FALSE',
  ),
  tfng(
    'Green corridors always replace buses in cities.',
    'NOT GIVEN',
  ),
  mcq(
    'Unequal access to green space is described as:',
    ['Solved everywhere', 'A persistent challenge', 'A myth'],
    1,
  ),
  tfng(
    'Research compares small distributed patches with one large peripheral park.',
    'TRUE',
  ),
  mcq(
    '“Gentrification” in the passage is linked to greening when:',
    [
      'Housing policies protect residents',
      'Housing protections are absent',
      'Parks are closed',
    ],
    1,
  ),
]

/** Passage 2: 14 questions */
const SEC2: ReadingQuestion[] = [
  tfng(
    'The passage claims that all employees strongly prefer working from home.',
    'FALSE',
  ),
  tfng(
    'Some companies hold periodic in-person sessions for intensive collaboration.',
    'TRUE',
  ),
  tfng(
    'The text states that keystroke monitoring is the most successful performance measure.',
    'FALSE',
  ),
  mcq(
    'According to the passage, which group may gain most from occasional in-person contact?',
    [
      'Senior specialists who prefer solitary work',
      'Junior staff needing mentoring',
      'Only customers outside the organisation',
    ],
    1,
  ),
  tfng(
    'Creative collaboration is described as unaffected by remote communication tools.',
    'FALSE',
  ),
  tfng(
    'Routine tasks are said to show stable productivity under remote or hybrid schedules.',
    'TRUE',
  ),
  tfng(
    'Video calls are credited with making spontaneous brainstorming easier.',
    'FALSE',
  ),
  mcq(
    'Successful programmes are said to favour:',
    [
      'Keystroke monitoring only',
      'Trust-based metrics and availability norms',
      'Removing all meetings',
    ],
    1,
  ),
  tfng(
    'Senior specialists never work from home.',
    'FALSE',
  ),
  tfng(
    '“Design weeks” are mentioned as quarterly in-person events.',
    'TRUE',
  ),
  tfng(
    'Technology and media sectors are explicitly referenced in surveys.',
    'TRUE',
  ),
  mcq(
    'Packed calendars with video calls are linked to difficulty replicating:',
    ['Payroll tasks', 'Spontaneous brainstorming', 'Email'], 1,
  ),
  tfng(
    'The author argues one hybrid policy suits every industry.',
    'FALSE',
  ),
  mcq(
    'Day-to-day work is described for some firms as:',
    ['Fully office-based', 'Flexible', 'Illegal'], 1,
  ),
]

/** Passage 3: 13 questions */
const SEC3: ReadingQuestion[] = [
  tfng(
    'Microplastics can only enter freshwater through direct littering by tourists.',
    'FALSE',
  ),
  tfng(
    'Field studies always show clearer effects than laboratory experiments.',
    'FALSE',
  ),
  tfng(
    'The passage mentions extended producer fees related to synthetic textiles.',
    'TRUE',
  ),
  mcq(
    'Scaling filtration for whole catchments is described as:',
    ['Trivial', 'Costly', 'Unnecessary'],
    1,
  ),
  tfng(
    'Invertebrates may ingest particles in the water column.',
    'TRUE',
  ),
  tfng(
    'Tyre dust is listed as a source of microplastics.',
    'TRUE',
  ),
  tfng(
    'Field studies never vary with the season.',
    'FALSE',
  ),
  mcq(
    'Policy debates are said to centre on:',
    [
      'Only tourism tax',
      'Producer responsibility versus consumer behaviour',
      'Space travel',
    ],
    1,
  ),
  tfng(
    'Laboratory experiments never show effects on feeding rates.',
    'FALSE',
  ),
  tfng(
    'European jurisdictions are testing extended producer fees.',
    'TRUE',
  ),
  mcq(
    'Degraded packaging is presented as:',
    ['A source of microplastics', 'A solution', 'Unrelated'],
    0,
  ),
  tfng(
    'Food webs are mentioned in connection with ingestion.',
    'TRUE',
  ),
]

/** New exam passages/questions (40 total: 13 + 14 + 13) */
const SEC4: ReadingQuestion[] = [
  tfng('Public libraries in the passage are described as providing only book lending.', 'FALSE'),
  tfng('Some libraries run makerspaces with tools like 3D printers.', 'TRUE'),
  tfng('The passage claims expanded services always reduce costs for libraries.', 'NOT GIVEN'),
  mcq('Supporters believe expanded library services help especially:', ['People without home internet', 'Only professional authors', 'Tourists'], 0),
  tfng('Critics worry core services may suffer if funding does not increase.', 'TRUE'),
  tfng('Library staff training is said to require new skills for community programs.', 'TRUE'),
  mcq('Participation tends to be higher when services are:', ['Co-designed with residents', 'Copied from other cities without changes', 'Limited to weekends'], 0),
  tfng('The passage states that cataloguing skills are identical to program facilitation skills.', 'FALSE'),
  tfng('Job-search workshops are mentioned as one example of new services.', 'TRUE'),
  mcq('The word “relevance” in the passage is linked to:', ['Digital economy changes', 'Sports events', 'Weather'], 0),
  tfng('The passage says libraries should stop offering quiet study space.', 'FALSE'),
  mcq('A “makerspace” is most closely associated with:', ['Hands-on learning tools', 'Medical surgery', 'Road construction'], 0),
  tfng('Pilot programs suggest co-design can improve efficiency of resource use.', 'TRUE'),
]

const SEC5: ReadingQuestion[] = [
  tfng('The passage claims wind and solar are always expensive everywhere.', 'FALSE'),
  tfng('Short-duration batteries can help smooth hourly fluctuations.', 'TRUE'),
  tfng('Pumped hydro works in any location regardless of geography.', 'FALSE'),
  mcq('Demand response focuses on:', ['Generating more power', 'Shifting electricity use timing', 'Stopping renewable energy'], 1),
  tfng('Charging electric vehicles at midday is given as an example of shifting demand.', 'TRUE'),
  mcq('A fairness concern is that:', ['All households can easily shift routines', 'Not all households can shift routines', 'Demand response is illegal'], 1),
  tfng('The passage states demand response always increases peak load.', 'FALSE'),
  mcq('Policymakers debate whether incentives should target:', ['Only tourists', 'Large commercial users first or broader subsidies', 'Only children'], 1),
  tfng('Energy storage is described as the only possible solution.', 'FALSE'),
  tfng('Batteries are described as suited to long seasonal storage.', 'FALSE'),
  mcq('The most cost-effective approach depends on:', ['Context', 'Luck', 'A single global rule'], 0),
  tfng('Smart appliances are mentioned in connection with subsidies.', 'TRUE'),
  tfng('Demand response can reduce peak load.', 'TRUE'),
  mcq('Pumped hydro is associated with:', ['Longer-duration storage', 'No storage at all', 'Only coal plants'], 0),
]

const SEC6: ReadingQuestion[] = [
  tfng('Remote sensing can help locate sites without excavation.', 'TRUE'),
  tfng('LiDAR is said to be useful in forested regions.', 'TRUE'),
  tfng('Remote sensing completely replaces excavation, according to the passage.', 'FALSE'),
  mcq('One challenge of remote sensing is that:', ['Data processing is simple', 'Natural features can mimic patterns', 'It cannot be used from the air'], 1),
  tfng('Artefacts and stratigraphy are needed to date a site.', 'TRUE'),
  mcq('Projects often use a staged approach to:', ['Increase damage to sites', 'Narrow down promising areas first', 'Avoid all interpretation'], 1),
  tfng('Ground-penetrating radar is listed as one remote sensing technique.', 'TRUE'),
  tfng('LiDAR cannot penetrate gaps in a forest canopy.', 'FALSE'),
  mcq('Remote sensing helps reduce:', ['Costs and damage', 'Rainfall', 'Language barriers'], 0),
  tfng('The passage warns that interpretation must be careful.', 'TRUE'),
  mcq('Aerial photography may reveal:', ['Vegetation or terrain changes', 'Only underwater fish', 'Bank interest rates'], 0),
  tfng('Remote sensing provides detailed elevation models in some cases.', 'TRUE'),
  mcq('Targeted digs happen:', ['Before any sensing', 'After narrowing areas', 'Never'], 1),
]

function flattenWithGlobalIds(exam: ReadingExam): ReadingExam {
  let n = 0
  return {
    sections: exam.sections.map((s) => ({
      ...s,
      questions: s.questions.map((q) => {
        const id = `R-${n}`
        n += 1
        return { ...q, id }
      }),
    })),
  }
}

const EXAM_A: ReadingExam = flattenWithGlobalIds({
  sections: [
    {
      passage: { title: 'The growth of urban green space', body: p1Body },
      questions: SEC1,
    },
    {
      passage: { title: 'Remote work and team creativity', body: p2Body },
      questions: SEC2,
    },
    {
      passage: { title: 'Microplastics in freshwater systems', body: p3Body },
      questions: SEC3,
    },
  ],
})

/** Second exam: same passages, reordered (still 40 questions, authentic practice). */
const EXAM_B: ReadingExam = flattenWithGlobalIds({
  sections: [
    {
      passage: { title: 'Microplastics in freshwater systems', body: p3Body },
      questions: SEC3,
    },
    {
      passage: { title: 'The growth of urban green space', body: p1Body },
      questions: SEC1,
    },
    {
      passage: { title: 'Remote work and team creativity', body: p2Body },
      questions: SEC2,
    },
  ],
})

const EXAM_C: ReadingExam = flattenWithGlobalIds({
  sections: [
    { passage: { title: 'Libraries as community hubs', body: p4Body }, questions: SEC4 },
    { passage: { title: 'Balancing the electricity grid', body: p5Body }, questions: SEC5 },
    { passage: { title: 'Remote sensing in archaeology', body: p6Body }, questions: SEC6 },
  ],
})

const EXAM_D: ReadingExam = flattenWithGlobalIds({
  sections: [
    { passage: { title: 'Remote sensing in archaeology', body: p6Body }, questions: SEC6 },
    { passage: { title: 'Libraries as community hubs', body: p4Body }, questions: SEC4 },
    { passage: { title: 'Balancing the electricity grid', body: p5Body }, questions: SEC5 },
  ],
})

const ALL_READING_EXAMS: ReadingExam[] = [EXAM_A, EXAM_B, EXAM_C, EXAM_D]

export function buildRandomReadingExam(): ReadingExam {
  return pickOne(ALL_READING_EXAMS)
}
