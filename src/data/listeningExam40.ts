import type { ListeningPart, ListeningQuestion } from '../types'

export const LISTENING_DURATION_SEC = 30 * 60

const T1 = 'Part 1 — Everyday social context'
const T2 = 'Part 2 — Monologue in a social context'
const T3 = 'Part 3 — Conversation in an educational context'
const T4 = 'Part 4 — Monologue on an academic subject'

function g(prompt: string, accepted: string[]): ListeningQuestion {
  return { id: '_', kind: 'gap', prompt, blanks: [accepted] }
}

function mcq(prompt: string, options: string[], answer: number): ListeningQuestion {
  return { id: '_', kind: 'mcq', prompt, options, answer }
}

/** IELTS Listening: 40 items in 4 sections (10 per section). */
export const LISTENING_ACADEMIC_TESTS: ListeningPart[][] = [
  [
    {
      title: T1,
      script: `Library registration conversation (reference).
House forty-two Maple Street. Thursday until eight, Monday until six. Free for residents. Up to eight books. Three DVDs for two weeks. Free membership until March the first; five pounds admin fee after that for non-residents only.`,
      ttsChunks: [
        'Good morning, City Library — how can I help?',
        'I would like to join the library, please.',
        'Membership is free for local residents. Are you on Maple Street?',
        'Yes, number forty-two.',
        'We are open until eight on Thursdays, and we close at six on Mondays.',
        'You can borrow up to eight books at a time.',
        'For DVDs, you may take up to three at a time, for two weeks each.',
        'Joining is free until March the first. After that date, there is a five pound administration fee for non-residents only.',
      ],
      questions: [
        g('House number', ['forty-two', '42']),
        g('Street name (one word)', ['maple']),
        g('Thursday closing time (number or word)', ['eight', '8']),
        g('Monday closing time (number or word)', ['six', '6']),
        mcq('Membership is free for:', ['Tourists', 'Local residents', 'Students abroad'], 1),
        g('Maximum number of books borrowed at once', ['eight', '8']),
        g('Maximum DVDs at one time', ['three', '3']),
        g('DVD loan period (weeks)', ['two', '2']),
        g('Free membership ends after this date (month)', ['march']),
        mcq('The admin fee applies to:', [
          'Residents after March',
          'Non-residents after March the first',
          'Everyone immediately',
        ], 1),
      ],
    },
    {
      title: T2,
      script: `Museum announcement. Photography exhibition until end of July. Adult twelve pounds. Children under twelve free with adult. Café on second floor. No flash photography.`,
      ttsChunks: [
        'Welcome to the Riverside Museum.',
        'The photography exhibition runs until the end of July.',
        'Adult tickets are twelve pounds.',
        'Children under twelve go free when accompanied by an adult.',
        'The café is on the second floor.',
        'Please do not use flash photography in the galleries.',
      ],
      questions: [
        mcq('The exhibition ends:', ['June', 'End of July', 'September'], 1),
        g('Adult ticket price in pounds', ['twelve', '12']),
        mcq('Children under twelve:', ['Pay half price', 'Go free with an adult', 'Cannot enter'], 1),
        g('Café floor (number)', ['second', '2', 'two']),
        mcq('Flash photography is:', ['Encouraged', 'Not allowed', 'Extra cost'], 1),
        mcq('The speaker works as:', ['A security guard', 'A museum guide', 'A ticket seller'], 1),
        g('Exhibition type (one word)', ['photography']),
        mcq('July is mentioned as:', ['Opening month only', 'End month of the show', 'Holiday closure'], 1),
        g('Minimum age for free entry with adult (under …)', ['twelve', '12']),
        mcq('The café is located:', ['Ground floor', 'Second floor', 'Basement'], 1),
      ],
    },
    {
      title: T3,
      script: `Two students. Focus renewable energy in cities. Presentation max fifteen minutes including questions. Submit slides by five p.m. Friday.`,
      ttsChunks: [
        'We should focus on renewable energy in cities, not rural areas.',
        'The supervisor said to keep it under fifteen minutes including questions.',
        'Remember to submit slides by five p.m. Friday.',
      ],
      questions: [
        mcq('Main topic chosen:', ['Rural energy', 'Cities renewable energy', 'Oil prices'], 1),
        g('Maximum length including questions (minutes)', ['fifteen', '15']),
        mcq('Slides must be submitted:', [
          'Monday morning',
          'Five p.m. Friday',
          'After the talk',
        ], 1),
        mcq('They reject focusing on:', ['Cities', 'Rural areas', 'Transport'], 1),
        g('Submit slides before this weekday', ['friday']),
        g('Submission hour on Friday (phrase or number)', ['five', '5', '17']),
        mcq('The supervisor cares about:', [
          'Only slide design',
          'Time limit including questions',
          'Dress code',
        ], 1),
        mcq('Their energy focus is on:', ['Villages', 'Urban areas', 'Oceans'], 1),
        mcq('Including questions means:', [
          'Extra ten minutes',
          'Part of the fifteen-minute limit',
          'Unlimited Q and A',
        ], 1),
        mcq('Friday deadline is for:', ['Attendance', 'Slides', 'Payment'], 1),
      ],
    },
    {
      title: T4,
      script: `Sleep lecture. Adults seven to nine hours. Sleep debt harms memory and immunity. Naps cannot fully replace night sleep.`,
      ttsChunks: [
        'Most adults need between seven and nine hours of sleep per night.',
        'Chronic sleep debt can affect memory consolidation and immune function.',
        'Short naps cannot fully replace consolidated night sleep.',
      ],
      questions: [
        g('Minimum hours mentioned for most adults', ['seven', '7']),
        g('Maximum hours mentioned for most adults', ['nine', '9']),
        mcq('Sleep debt may harm:', ['Only mood', 'Memory and immunity', 'Hearing'], 1),
        mcq('Naps are presented as:', [
          'A full replacement for night sleep',
          'Unable to fully replace night sleep',
          'Harmful',
        ], 1),
        mcq('The talk is mainly about:', ['Diet', 'Sleep', 'Exercise'], 1),
        g('One effect of chronic sleep debt: memory what?', ['consolidation']),
        mcq('Immune function is:', ['Improved by debt', 'Affected negatively by debt', 'Not mentioned'], 1),
        mcq('The lower sleep range given is:', ['Five hours', 'Seven hours', 'Ten hours'], 1),
        mcq('The upper sleep range given is:', ['Eight hours', 'Nine hours', 'Twelve hours'], 1),
        mcq('Consolidated night sleep is described as:', ['Optional', 'Important', 'Illegal'], 1),
      ],
    },
  ],
  [
    {
      title: T1,
      script: `Hotel check-in. Twin room two nights. Checkout eleven. Third floor. Wi-Fi code is room number plus nine nine.`,
      ttsChunks: [
        'Good evening — you have a reservation under Park?',
        'Yes, a twin room for two nights.',
        'Checkout is at eleven in the morning, and you are on the third floor.',
        'Wi-Fi password is your room number followed by nine nine.',
      ],
      questions: [
        g('Room type (one word)', ['twin']),
        g('Number of nights', ['two', '2']),
        g('Checkout hour (number or word)', ['eleven', '11']),
        g('Floor (ordinal or number)', ['third', '3']),
        mcq('Reservation name heard:', ['Price', 'Park', 'Pear'], 1),
        mcq('Wi-Fi password ends with:', ['Zero zero', 'Nine nine', 'Room only'], 1),
        mcq('Morning checkout is:', ['Ten', 'Eleven', 'Noon'], 1),
        mcq('Length of stay:', ['One night', 'Two nights', 'A week'], 1),
        mcq('Room location:', ['Second floor', 'Third floor', 'Ground floor'], 1),
        mcq('The guest confirms:', ['A double room', 'A twin room', 'A suite'], 1),
        mcq('Wi-Fi instructions mention digits:', [
          'Zero zero only',
          'Nine nine after the room number',
          'No password',
        ], 1),
      ],
    },
    {
      title: T2,
      script: `Bus route twenty-two diverted until end of March. Temporary stop Oak Street by pharmacy. Replacement buses every fifteen minutes.`,
      ttsChunks: [
        'Bus route twenty-two will be diverted until the end of March.',
        'A temporary stop will operate on Oak Street, next to the pharmacy.',
        'Replacement buses run every fifteen minutes.',
      ],
      questions: [
        g('Bus route number', ['twenty-two', '22']),
        mcq('Diversion ends:', ['January', 'March', 'June'], 1),
        g('Temporary stop street (one word)', ['oak']),
        mcq('The stop is near the:', ['School', 'Pharmacy', 'Station'], 1),
        g('Replacement bus frequency (minutes)', ['fifteen', '15']),
        mcq('Roadworks cause:', ['Faster buses', 'A diversion', 'Free travel'], 1),
        mcq('Oak Street is for:', ['Parking only', 'A temporary stop', 'Shopping'], 1),
        mcq('March is mentioned as:', ['Start of diversion', 'End of diversion', 'Holiday'], 1),
        mcq('Replacement buses are:', ['Hourly', 'Every fifteen minutes', 'Cancelled'], 1),
        mcq('Route twenty-two is a:', ['Train', 'Bus', 'Tram'], 1),
      ],
    },
    {
      title: T3,
      script: `Poster margins two centimetres. Deadline midday Friday. Use department template. Lock file Sunday six p.m.`,
      ttsChunks: [
        'Margins must be two centimetres on all sides.',
        'The deadline is midday Friday.',
        'Use the department template.',
        'Lock the final file on Sunday at six p.m.',
      ],
      questions: [
        g('Margin width (cm)', ['two', '2']),
        mcq('Deadline day:', ['Thursday', 'Friday', 'Monday'], 1),
        mcq('Deadline time:', ['Midnight', 'Midday', 'Nine a.m.'], 1),
        mcq('Template source:', ['Internet search', 'Department template', 'None'], 1),
        g('Lock file on this weekday', ['sunday']),
        g('Lock time hour on Sunday', ['six', '6', '18']),
        mcq('Friday deadline is:', ['Midday', 'Midnight', 'Flexible'], 1),
        mcq('Margins apply:', ['Top only', 'All sides', 'Bottom only'], 1),
        mcq('Final file should be:', ['Deleted', 'Locked', 'Printed'], 1),
        mcq('Centimetres mentioned:', ['One', 'Two', 'Five'], 1),
      ],
    },
    {
      title: T4,
      script: `Coral bleaching. Two degrees Celsius rise. Corals expel algae. Process called bleaching.`,
      ttsChunks: [
        'When sea temperatures rise by about two degrees Celsius, corals may expel their symbiotic algae.',
        'This process is known as bleaching.',
      ],
      questions: [
        g('Temperature rise in degrees Celsius', ['two', '2']),
        mcq('Corals expel:', ['Fish', 'Algae', 'Sand'], 1),
        mcq('The process is called:', ['Fertilisation', 'Bleaching', 'Filtering'], 1),
        mcq('Temperature rise is about:', ['One degree', 'Two degrees', 'Five degrees'], 1),
        mcq('Symbiotic algae live:', ['Inside corals', 'Only in rivers', 'In tyres'], 1),
        mcq('Bleaching relates to:', ['Colour loss in corals', 'Bird migration', 'Wind speed'], 1),
        mcq('Sea temperature is linked to:', ['Coral stress', 'Train delays', 'Library fees'], 1),
        mcq('The lecture context is:', ['Urban planning', 'Marine ecosystems', 'Sports'], 1),
        mcq('Algae leaving corals is described as:', ['Permanent always', 'Part of bleaching', 'Impossible'], 1),
        mcq('Degrees mentioned refer to:', ['Wind chill', 'Sea temperature rise', 'Room heating'], 1),
        mcq('Symbiotic describes the relationship between corals and:', [
          'Fish only',
          'Algae',
          'Sand grains',
        ], 1),
      ],
    },
  ],
]
