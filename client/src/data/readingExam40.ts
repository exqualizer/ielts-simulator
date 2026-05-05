import { pickOne } from '../lib/random'
import type { ReadingExam, ReadingQuestion } from '../types'

const p1Body = `Cities around the world are experimenting with ways to integrate vegetation into dense neighbourhoods. Beyond aesthetics, urban green space can reduce heat island effects, improve air quality, and support mental health. However, maintenance costs and unequal access remain persistent challenges. Some municipalities have introduced “green corridors” that connect parks, while others focus on rooftop gardens on public buildings. Research suggests that small, well-distributed patches of greenery may benefit residents more than a single large park on the edge of a city, particularly for daily walking and social contact. Critics argue that greening initiatives can accelerate gentrification if they are not paired with housing policies that protect long-term residents.`

const p2Body = `Organisations that adopted remote or hybrid schedules during the 2020s often reported stable productivity for routine tasks. Creative collaboration, however, appears more sensitive to medium: spontaneous brainstorming sessions are harder to replicate when calendars are tightly packed with video calls. Some firms have introduced quarterly in-person “design weeks” while keeping day-to-day work flexible. Surveys of employees in technology and media sectors suggest that junior staff benefit disproportionately from occasional face-to-face mentoring, though senior specialists sometimes prefer uninterrupted blocks of solitary work at home. No single policy fits every industry; the most successful programmes tend to combine explicit norms for availability with trust-based performance metrics rather than keystroke monitoring.`

const p3Body = `Microplastics enter rivers and lakes through wastewater, tyre dust, and degraded packaging. Once in the water column, particles may be ingested by invertebrates and move up food webs. Laboratory experiments show that concentrations above certain thresholds can reduce feeding rates in some species, though field studies sometimes produce mixed results because background pollution varies seasonally. Filtration technologies exist for drinking water plants, but they are costly to scale for entire catchments. Policy debates often centre on producer responsibility versus consumer behaviour change, with several European jurisdictions testing extended producer fees for synthetic textiles.`

const p4Body = `In many countries, public libraries have expanded far beyond book lending. Some run “makerspaces” with 3D printers, sewing machines, and basic electronics kits, aiming to reduce barriers to learning technical skills. Others host legal clinics, language exchanges, and job-search workshops. Supporters argue that these services increase the library’s relevance in a digital economy, particularly for people who lack home internet or quiet study space. Critics worry that expanding responsibilities can dilute core services if funding does not rise accordingly. Librarians also report that staff training must adapt: facilitating community programs requires different skills than cataloguing and circulation. Evidence from pilot programs suggests that when new services are co-designed with local residents, participation is higher and resources are used more efficiently.`


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

function gap(prompt: string, accepted: string[]): ReadingQuestion {
  return { id: '_', kind: 'gap', prompt, blanks: [accepted] }
}

/** Passage 1: 10 questions */
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
  gap('One challenge mentioned is maintenance _____.', ['costs', 'maintenance costs']),
  mcq(
    'Unequal access to green space is described as:',
    ['Solved everywhere', 'A persistent challenge', 'A myth'],
    1,
  ),
]

/** Passage 2: 10 questions */
const SEC2: ReadingQuestion[] = [
  mcq(
    'What kind of tasks are said to keep stable productivity under remote or hybrid schedules?',
    [
      'Routine tasks',
      'Only creative brainstorming',
      'Manual factory work',
    ],
    0,
  ),
  mcq(
    'Creative collaboration is described as more sensitive to:',
    [
      'The medium used to communicate',
      'The colour of office walls',
      'The length of lunch breaks',
    ],
    0,
  ),
  mcq(
    'Packed calendars with video calls are linked to difficulty replicating:',
    ['Payroll tasks', 'Spontaneous brainstorming', 'Email'], 1,
  ),
  mcq(
    'Some firms organise quarterly in-person events called:',
    ['Design weeks', 'Hiring days', 'Budget weeks'],
    0,
  ),
  gap('Some firms keep day-to-day work _____.', ['flexible']),
  mcq(
    'Which group is said to benefit most from occasional face-to-face mentoring?',
    ['Junior staff', 'Retired workers', 'Only managers'],
    0,
  ),
  mcq(
    'Which sectors are explicitly referenced in the surveys mentioned?',
    ['Technology and media', 'Agriculture and mining', 'Tourism only'],
    0,
  ),
  mcq(
    'The most successful programmes tend to use:',
    ['Trust-based performance metrics', 'Keystroke monitoring', 'No performance measures'],
    0,
  ),
  mcq(
    'The passage suggests there is:',
    ['No single policy that fits every industry', 'One policy that fits everyone', 'A legal ban on hybrid work'],
    0,
  ),
  gap('The passage mentions explicit norms for _____.', ['availability']),
]

/** Passage 3: 10 questions */
const SEC3: ReadingQuestion[] = [
  gap('One source of microplastics mentioned is tyre _____.', ['dust']),
  mcq(
    'Microplastics can enter rivers and lakes through:',
    ['Wastewater, tyre dust, and degraded packaging', 'Only volcanic eruptions', 'Only fishing boats'],
    0,
  ),
  mcq(
    'Once in the water column, particles may be ingested by:',
    [
      'Invertebrates',
      'Birds only',
      'Plants only',
    ],
    0,
  ),
  mcq(
    'Laboratory experiments suggest that high concentrations can reduce:',
    ['Feeding rates in some species', 'Wind speed', 'Library memberships'],
    0,
  ),
  mcq(
    'Field studies sometimes produce mixed results because:',
    ['Background pollution varies seasonally', 'Laboratory equipment is unavailable', 'Microplastics dissolve instantly'],
    0,
  ),
  gap('Filtration technologies exist, but they are _____ to scale.', ['costly']),
  mcq(
    'Policy debates often centre on:',
    ['Producer responsibility versus consumer behaviour change', 'Space travel funding', 'Sports advertising'],
    0,
  ),
  mcq(
    'Several European jurisdictions are testing:',
    ['Extended producer fees for synthetic textiles', 'A ban on rivers', 'Free bottled water'],
    0,
  ),
  mcq(
    'Microplastics can move up:',
    ['Food webs', 'Mountains', 'Telephone networks'],
    0,
  ),
  gap('One entry route mentioned is degraded _____.', ['packaging']),
]

/** Passage 4 questions */
const SEC4: ReadingQuestion[] = [
  gap('Some libraries host job-search _____.', ['workshops', 'workshop']),
  mcq('Public libraries are described as expanding beyond:', ['Book lending', 'Road repairs', 'Air travel'], 0),
  mcq('A “makerspace” may include:', ['3D printers and electronics kits', 'Only swimming pools', 'Medical scanners'], 0),
  mcq('Supporters argue expanded services increase the library’s relevance in:', ['A digital economy', 'A farming economy', 'A space economy'], 0),
  mcq('Expanded services help especially people who lack:', ['Home internet or quiet study space', 'A driving licence', 'A passport'], 0),
  mcq('One criticism is that expansion can dilute core services if:', ['Funding does not rise', 'Books become heavier', 'Staff stop reading'], 0),
  mcq('Staff training must adapt because facilitating programs requires:', ['Different skills than cataloguing', 'No skills at all', 'Only accounting skills'], 0),
  mcq('Evidence from pilot programs suggests participation is higher when services are:', ['Co-designed with residents', 'Hidden online', 'Limited to staff only'], 0),
  gap('Libraries may run community programs such as language _____.', ['exchanges', 'exchange']),
  mcq('Besides makerspaces, libraries may host:', ['Legal clinics', 'Car races', 'Airports'], 0),
]

function flattenWithGlobalIds(exam: ReadingExam): ReadingExam {
  let n = 0
  return {
    sections: exam.sections.map((s) => ({
      ...s,
      questions: s.questions.map((q) => {
        const id = `R-${n + 1}`
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
    {
      passage: { title: 'Libraries as community hubs', body: p4Body },
      questions: SEC4,
    },
  ],
})

const EXAM_B: ReadingExam = flattenWithGlobalIds({
  sections: [
    {
      passage: { title: 'The growth of urban green space', body: p1Body },
      questions: SEC1,
    },
    {
      passage: { title: 'Microplastics in freshwater systems', body: p3Body },
      questions: SEC3,
    },
    {
      passage: { title: 'Libraries as community hubs', body: p4Body },
      questions: SEC4,
    },
    {
      passage: { title: 'Remote work and team creativity', body: p2Body },
      questions: SEC2,
    },
  ],
})

const ALL_READING_EXAMS: ReadingExam[] = [EXAM_A, EXAM_B]

export function buildRandomReadingExam(): ReadingExam {
  return pickOne(ALL_READING_EXAMS)
}
