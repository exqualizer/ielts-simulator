import { pickNUnique, pickOne } from '../lib/random'
import type { SpeakingPart2Cue } from '../types'

export const PART2_PREP_SEC = 60
export const PART2_SPEAK_SEC = 120

const PART1_POOL = [
  'Do you work or study at the moment?',
  'What do you like about your hometown?',
  'How do you usually spend your weekends?',
  'Do you prefer mornings or evenings? Why?',
  'How often do you use the internet for learning?',
  'What kind of music do you enjoy listening to?',
  'Do you like cooking? Why or why not?',
  'How do you usually travel to work or school?',
  'Is there a hobby you would like to try in the future?',
  'What is your favourite season of the year?',
  'Do you prefer reading books or watching films?',
  'How important is exercise in your daily routine?',
  'Describe a place you like to go to relax.',
  'Do you think you will live in your hometown in the future?',
  'What do you usually do on your birthday?',
  'Are you planning any trips soon?',
  'Do you prefer shopping online or in physical shops?',
  'What kind of weather do you dislike most?',
  'How do you keep in touch with friends and family?',
  'Would you like to learn another language? Why?',
  'Do you like taking photos? Why or why not?',
  'When was the last time you visited a library?',
  'Do you prefer to spend time alone or with other people?',
  'What do you do to relax after a stressful day?',
  'Do you enjoy watching sports? Why or why not?',
  'How often do you eat out in restaurants?',
  'What kind of apps do you use most often on your phone?',
  'Do you like to plan things carefully or be spontaneous?',
  'What is a small purchase that has improved your daily life?',
  'Do you prefer studying or working in the morning or at night?',
  'What kinds of public places do you like in your city?',
  'Do you usually remember people’s birthdays?',
  'How important is it for you to have a routine?',
  'Do you like travelling by train? Why or why not?',
  'Do you like art? What kind of art do you enjoy?',
  'Do you think it is important to save money? Why?',
  'What do you usually do on public holidays?',
  'Do you prefer to communicate by text message or phone call?',
  'Have you ever tried learning something online? How was it?',
  'Do you enjoy spending time in nature? Why or why not?',
]

const PART2_POOL: SpeakingPart2Cue[] = [
  {
    prompt:
      'Describe a skill you would like to learn in the future. You should say:',
    bullets: [
      'what the skill is',
      'why you want to learn it',
      'how you plan to learn it',
      'and explain how this skill might help you.',
    ],
  },
  {
    prompt: 'Describe a memorable journey you have taken. You should say:',
    bullets: [
      'where you went',
      'who you travelled with',
      'what you did during the trip',
      'and explain why it was memorable for you.',
    ],
  },
  {
    prompt: 'Describe a person who has influenced you. You should say:',
    bullets: [
      'who this person is',
      'how you know them',
      'what they have done that influenced you',
      'and explain how you feel about their influence.',
    ],
  },
  {
    prompt: 'Describe a building or public place you often visit. You should say:',
    bullets: [
      'where it is',
      'what it looks like',
      'what people do there',
      'and explain why you visit it regularly.',
    ],
  },
  {
    prompt: 'Describe a time when you helped someone. You should say:',
    bullets: [
      'who you helped',
      'what the situation was',
      'what you did to help',
      'and explain how you felt afterwards.',
    ],
  },
  {
    prompt: 'Describe a piece of technology you find useful. You should say:',
    bullets: [
      'what it is',
      'how you use it',
      'how long you have had it',
      'and explain why it is useful to you.',
    ],
  },
  {
    prompt: 'Describe a festival or celebration in your country. You should say:',
    bullets: [
      'what it celebrates',
      'what people typically do',
      'how you usually take part',
      'and explain why it matters to your community.',
    ],
  },
  {
    prompt: 'Describe a book you enjoyed reading. You should say:',
    bullets: [
      'what the book is',
      'when you read it',
      'what it is about',
      'and explain why you enjoyed it.',
    ],
  },
  {
    prompt: 'Describe a time you learned something new quickly. You should say:',
    bullets: [
      'what you learned',
      'why you needed to learn it',
      'how you learned it',
      'and explain how you felt about the experience.',
    ],
  },
  {
    prompt: 'Describe a place in your country you would recommend to visitors. You should say:',
    bullets: [
      'where it is',
      'what people can do there',
      'the best time to visit',
      'and explain why you would recommend it.',
    ],
  },
  {
    prompt: 'Describe a time you made a decision that you were happy with. You should say:',
    bullets: [
      'what the decision was',
      'when you made it',
      'what influenced your choice',
      'and explain why you were happy with it.',
    ],
  },
  {
    prompt: 'Describe a time you waited for something (or someone). You should say:',
    bullets: [
      'what you were waiting for',
      'where you were',
      'what you did while waiting',
      'and explain how you felt about waiting.',
    ],
  },
  {
    prompt: 'Describe an item you own that is important to you. You should say:',
    bullets: [
      'what it is',
      'how you got it',
      'how often you use it',
      'and explain why it is important to you.',
    ],
  },
  {
    prompt: 'Describe a time you tried a new food for the first time. You should say:',
    bullets: [
      'what the food was',
      'where you tried it',
      'who you were with',
      'and explain whether you liked it or not.',
    ],
  },
  {
    prompt: 'Describe a time you were late. You should say:',
    bullets: [
      'where you were going',
      'why you were late',
      'what happened as a result',
      'and explain how you felt about it.',
    ],
  },
  {
    prompt: 'Describe a helpful website or app you use. You should say:',
    bullets: [
      'what it is',
      'how you found out about it',
      'what you use it for',
      'and explain why it is helpful for you.',
    ],
  },
  {
    prompt: 'Describe a time you worked in a team. You should say:',
    bullets: [
      'what you were doing',
      'who you worked with',
      'what your role was',
      'and explain what you learned from the experience.',
    ],
  },
]

const PART3_POOL = [
  'How important is lifelong learning in today’s job market?',
  'Do you think schools should teach more practical skills?',
  'What are some challenges adults face when learning something new?',
  'How has technology changed the way people travel?',
  'Should governments invest more in public transport or roads?',
  'What qualities make a good leader in a workplace?',
  'Do you think remote meetings are as effective as face-to-face ones?',
  'How can cities encourage healthier lifestyles among residents?',
  'Is it better to specialise early in a career or try many roles?',
  'What impact do influencers have on young people’s choices?',
  'Should museums charge admission fees?',
  'How might climate change affect tourism in coastal areas?',
  'Do you think printed newspapers will disappear completely?',
  'What role should parents play in limiting screen time?',
  'How can communities support elderly people who live alone?',
  'Do you think people today have less free time than in the past? Why?',
  'How can individuals balance work and personal life more effectively?',
  'What are the benefits and drawbacks of living in a big city?',
  'In what ways can public spaces influence a community’s well-being?',
  'How might artificial intelligence change the workplace in the future?',
  'Do you think online learning can replace traditional classrooms?',
  'Why do some people find it difficult to change their habits?',
  'How can governments encourage people to use public transport more often?',
  'What role does advertising play in shaping people’s lifestyles?',
  'Should children be encouraged to compete, or to cooperate more? Why?',
  'How do you think tourism affects local culture?',
  'What can companies do to improve employees’ job satisfaction?',
  'Do you think people are becoming more or less patient than before?',
  'How important is it for cities to preserve historic buildings?',
  'What are the advantages of eating locally produced food?',
]

export type SpeakingSession = {
  part1: string[]
  part2: SpeakingPart2Cue
  part3: string[]
}

export function buildRandomSpeakingSession(): SpeakingSession {
  return {
    part1: pickNUnique(PART1_POOL, 5),
    part2: pickOne(PART2_POOL),
    part3: pickNUnique(PART3_POOL, 4),
  }
}
