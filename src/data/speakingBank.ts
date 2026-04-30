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
