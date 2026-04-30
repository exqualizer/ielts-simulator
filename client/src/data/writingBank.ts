import { pickOne } from '../lib/random'

export type WritingPair = { task1: string; task2: string }

/** IELTS General Training: Task 1 = letter (≥150 words); Task 2 = essay (≥250 words). */
const PAIRS: WritingPair[] = [
  {
    task1: `You recently organised an important family celebration at a local restaurant. When you received the bill, you noticed several charges for items you did not order.

Write a letter to the restaurant manager. In your letter:
• describe the event and what went wrong
• say what you would like the manager to do
• explain how you feel about the situation

Write at least 150 words.

You do not need to write any addresses. Begin your letter as follows:
Dear …,`,
    task2: `Some people think that the government should pay for and encourage the use of public transport. Others believe that individuals should use their own cars.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
  },
  {
    task1: `A friend who lives abroad has asked you for some information about a short course you took at a local college last year.

Write a letter to your friend. In your letter:
• explain what the course was and why you took it
• describe what you enjoyed about the course
• say whether you would recommend the course to your friend

Write at least 150 words.

You do not need to write any addresses. Begin your letter as follows:
Dear …,`,
    task2: `In many places, shops are open for long hours every day, including weekends. Some people think this is positive for customers and the economy; others believe it has negative effects on families and communities.

Discuss both views and give your opinion.

Write at least 250 words.`,
  },
  {
    task1: `You rent a room in a house shared with other tenants. The heating has not worked properly for two weeks, despite you reporting it to the landlord by email.

Write a letter to the landlord. In your letter:
• explain the problem and how it affects you
• describe what you have already done to try to resolve it
• say what you expect the landlord to do next

Write at least 150 words.

You do not need to write any addresses. Begin your letter as follows:
Dear …,`,
    task2: `Some people believe that children should spend less time using phones and computers and more time playing outside. To what extent do you agree or disagree?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
  },
  {
    task1: `You work for a company and need to take one week’s unpaid leave next month to help a relative who is unwell. Write a letter to your manager.

In your letter:
• explain why you need the time off
• say exactly when you would like to be away
• offer to arrange cover for your duties during your absence

Write at least 150 words.

You do not need to write any addresses. Begin your letter as follows:
Dear …,`,
    task2: `Nowadays more people move away from their hometowns for work or study. What are the advantages and disadvantages of living away from the place where you grew up?

Write at least 250 words.`,
  },
  {
    task1: `You recently bought an item online. When it arrived, it was damaged and one part was missing.

Write a letter to the customer service department of the company. In your letter:
• give details of your order and what was wrong
• explain what problems this has caused you
• say what you want the company to do (e.g. refund, replacement, repair)

Write at least 150 words.

You do not need to write any addresses. Begin your letter as follows:
Dear Sir or Madam,`,
    task2: `Some people think that older employees are less useful to a company than younger ones. Others believe that experience makes older workers valuable.

Discuss both views and give your own opinion.

Write at least 250 words.`,
  },
  {
    task1: `A new neighbour has recently moved in next door. You would like to invite them to a small welcome gathering at your home next weekend.

Write a letter to your neighbour. In your letter:
• introduce yourself briefly
• explain the idea of the gathering (when, where, who will come)
• suggest how they can reply to accept or decline

Write at least 150 words.

You do not need to write any addresses. Begin your letter as follows:
Dear …,`,
    task2: `In some countries, young people have little leisure time and are under pressure to work or study hard. What do you think are the causes of this? What solutions can you suggest?

Write at least 250 words.`,
  },
]

export function buildRandomWritingPair(): WritingPair {
  return pickOne(PAIRS)
}
