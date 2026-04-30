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
      script: `Library registration conversation (extended IELTS-style practice script).

Staff: Good morning, City Library. How can I help you today?
Caller: Hi, I’m new to the area and I’d like to join the library, please.
Staff: Of course. First, can I check whether you live in the local council area? Membership is free for residents.
Caller: Yes, I do. I’ve just moved into a place on Maple Street.
Staff: Maple Street—right. What number is it?
Caller: It’s 42, Maple Street.
Staff: Great. And can I take your full name? … Thank you. Now, just so you know our opening hours: on Thursdays we stay open late until 8 p.m., and on Mondays we close at 6.
Caller: That’s helpful.
Staff: Borrowing limits are standard. You can take out up to 8 books at any one time.
Caller: Okay.
Staff: And if you want DVDs, you can borrow up to 3 at a time, for 2 weeks each.
Caller: Perfect.
Staff: There’s no charge to join at the moment. Joining is free until March 1st.
Caller: So after March 1st, do I pay anything?
Staff: Only if you’re not a local resident. After that date there’s a £5 administration fee for non‑residents.
Caller: Got it.`,
      ttsChunks: [
        'Good morning, City Library. How can I help you today?',
        'Hi, I’m new to the area and I’d like to join the library, please.',
        'Of course. Membership is free for local residents. Do you live in the local area?',
        'Yes, I do. I’ve just moved to Maple Street.',
        'Maple Street—right. What house number is that?',
        'It’s forty-two. Number forty-two, Maple Street.',
        'Great. Our opening hours: on Thursdays we’re open until eight p.m., and on Mondays we close at six.',
        'You can borrow up to eight books at any one time.',
        'For DVDs, you can borrow up to three at a time, and the loan period is two weeks.',
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
      script: `Museum announcement (extended IELTS-style practice script).

Speaker: Welcome to the Riverside Museum. Before you begin your visit, here are a few quick announcements.
First, our main temporary exhibition is a photography show. It will be running until the end of July, so you still have several weeks to see it.
Tickets are available from the desk in the entrance hall. Adult tickets cost £12. Children under 12 can enter free, as long as they are accompanied by an adult.
If you’d like refreshments, our café is on the second floor, next to the lift. Toilets are located on the ground floor, beside the gift shop.
Finally, we do allow photography in most galleries, but please remember: flash photography is not permitted, as it can damage the artworks.
Thank you, and enjoy your visit.`,
      ttsChunks: [
        'Welcome to the Riverside Museum. Before you begin, here are a few quick announcements.',
        'Our main temporary exhibition is a photography show. It runs until the end of July.',
        'Adult tickets cost twelve pounds.',
        'Children under twelve can enter free when accompanied by an adult.',
        'If you’d like refreshments, the café is on the second floor, next to the lift.',
        'We do allow photography in most galleries, but please do not use flash photography.',
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
      script: `Two students planning a presentation (extended IELTS-style practice script).

Student A: Have you decided what we’re doing for the seminar presentation?
Student B: I think we should focus on renewable energy in cities. The lecturer said the examples should be practical, like solar panels on apartment blocks or district heating.
Student A: Yes, that sounds more relevant than rural projects.
Student B: Exactly. And we need to be careful with timing. The supervisor said the whole thing must be under fifteen minutes—including questions at the end.
Student A: Right, so maybe we plan for twelve minutes speaking time, then three minutes for questions.
Student B: Good idea. Also, we have to submit our slides in advance.
Student A: When’s the deadline again?
Student B: By five p.m. on Friday. Not midnight—five p.m.
Student A: Okay. I’ll draft the introduction tonight and send you a first version.`,
      ttsChunks: [
        'Have you decided what we’re doing for the seminar presentation?',
        'I think we should focus on renewable energy in cities, not rural areas.',
        'The supervisor said the whole presentation must be under fifteen minutes, including questions.',
        'So we should aim for about twelve minutes speaking time, then a few minutes for questions.',
        'And don’t forget: we have to submit our slides by five p.m. on Friday.',
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
      script: `Sleep lecture extract (extended IELTS-style practice script).

Lecturer: Today we’re going to look at the impact of sleep on health and learning.
Most adults need between seven and nine hours of sleep per night. Of course, individuals vary, but that range is a useful guideline.
If you repeatedly sleep less than you need, you build up what researchers call “sleep debt”. Chronic sleep debt can affect memory consolidation—meaning your brain is less effective at storing new information—and it can also weaken immune function, so you may be more likely to get sick.
People often ask whether they can ‘catch up’ by taking naps. Short naps can be helpful for alertness, but they cannot fully replace consolidated night sleep, because the body cycles through different sleep stages across the night.
So if you want to perform well, especially when studying, consistent night sleep is key.`,
      ttsChunks: [
        'Today we’re looking at the impact of sleep on health and learning.',
        'Most adults need between seven and nine hours of sleep per night.',
        'If you repeatedly sleep less than you need, you build up sleep debt.',
        'Chronic sleep debt can affect memory consolidation and immune function.',
        'Short naps can help, but they cannot fully replace consolidated night sleep.',
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
      script: `Hotel check-in conversation (extended IELTS-style practice script).

Receptionist: Good evening. Welcome to the Harbour Hotel. Do you have a reservation?
Guest: Yes, it should be under Park—P A R K.
Receptionist: Thank you. Yes, I can see it here. A twin room for two nights, is that right?
Guest: That’s right.
Receptionist: Great. You’ll be staying on the third floor. Checkout is at eleven in the morning.
Guest: Okay, eleven.
Receptionist: Breakfast is served from seven, and the lift is just around the corner. Here are your key cards.
Guest: Thanks. And what about Wi‑Fi?
Receptionist: The Wi‑Fi password is your room number followed by nine nine—so room number plus 99.
Guest: Perfect. Thanks very much.`,
      ttsChunks: [
        'Good evening. Welcome to the Harbour Hotel. Do you have a reservation?',
        'Yes, it’s under Park. P A R K.',
        'Thank you. A twin room for two nights, correct?',
        'That’s right.',
        'You’re on the third floor, and checkout is at eleven in the morning.',
        'The Wi-Fi password is your room number followed by nine nine.',
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
      ],
    },
    {
      title: T2,
      script: `Local transport announcement (extended IELTS-style practice script).

Announcer: Attention passengers. Due to roadworks in the city centre, bus route 22 will be diverted until the end of March.
During this period, buses will not serve the usual stop outside the train station. Instead, a temporary stop will operate on Oak Street, next to the pharmacy.
Please allow extra time for your journey. Replacement buses will run every fifteen minutes throughout the day.
We apologise for any inconvenience and thank you for your patience.`,
      ttsChunks: [
        'Attention passengers. Due to roadworks, bus route twenty-two will be diverted until the end of March.',
        'A temporary stop will operate on Oak Street, next to the pharmacy.',
        'Replacement buses will run every fifteen minutes.',
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
      script: `Coursework instructions (extended IELTS-style practice script).

Tutor: Just a reminder about the poster submission.
Please use the department template—don’t design your own layout from scratch. Also, check your page setup carefully: margins must be two centimetres on all sides.
The submission deadline is midday on Friday. That means 12 noon, not midnight.
After you submit, you can still make edits during the weekend, but you must lock the final file on Sunday at six p.m. so it can’t be changed after that.
If you have any questions, email the course office.`,
      ttsChunks: [
        'Just a reminder about the poster submission.',
        'Margins must be two centimetres on all sides.',
        'Please use the department template.',
        'The deadline is midday on Friday.',
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
      script: `Marine biology lecture extract (extended IELTS-style practice script).

Lecturer: In this lecture we’ll examine coral bleaching and why it has become more common in recent decades.
When sea temperatures rise by about two degrees Celsius above the seasonal average, corals experience stress.
One response is that they expel the symbiotic algae that live inside their tissues. These algae normally provide much of the coral’s energy and also contribute to its colour.
When the algae are lost, the coral becomes pale—this process is known as bleaching.
Bleaching does not always kill the coral immediately, but it increases vulnerability to disease and can lead to large-scale reef decline if conditions persist.`,
      ttsChunks: [
        'In this lecture we’ll examine coral bleaching.',
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
  [
    {
      title: T1,
      script: `Community centre booking conversation (extended IELTS-style practice script).

Staff: Westfield Community Centre, bookings desk. How can I help?
Caller: Hi, I’d like to book a room for a small workshop next month.
Staff: Certainly. What type of room do you need? We have a meeting room and a larger activity hall.
Caller: The meeting room should be fine — it’s only about fifteen people.
Staff: Okay. Which date were you thinking of?
Caller: Saturday the 12th, if possible.
Staff: Let me check… yes, the meeting room is available. What time would you like?
Caller: From 2 p.m. until 5 p.m.
Staff: Great. The hourly rate is twelve pounds, and there’s a refundable deposit of fifty pounds.
Caller: All right.
Staff: Do you need any equipment? We can provide a projector for no extra charge.
Caller: Yes, a projector would be helpful.
Staff: Finally, could I take a contact email?
Caller: Sure — it’s info at westfieldworkshops dot org.
Staff: Perfect. I’ll email the confirmation.`,
      ttsChunks: [
        'Westfield Community Centre, bookings desk. How can I help?',
        'I’d like to book a room for a small workshop next month.',
        'We have a meeting room and a larger activity hall. Which do you need?',
        'The meeting room should be fine — it’s only about fifteen people.',
        'Which date were you thinking of?',
        'Saturday the twelfth.',
        'What time would you like?',
        'From two p.m. until five p.m.',
        'The hourly rate is twelve pounds, and there is a refundable deposit of fifty pounds.',
        'We can provide a projector for no extra charge.',
      ],
      questions: [
        mcq('The caller wants to book:', ['A hotel room', 'A room for a workshop', 'A concert ticket'], 1),
        g('Preferred day (one word)', ['saturday']),
        g('Date (number)', ['12', 'twelfth', 'twelve']),
        g('Start time (number)', ['2', 'two']),
        g('End time (number)', ['5', 'five']),
        g('Hourly rate in pounds', ['12', 'twelve']),
        g('Deposit in pounds', ['50', 'fifty']),
        mcq('The room type booked is:', ['Activity hall', 'Meeting room', 'Sports court'], 1),
        mcq('Equipment requested:', ['Speakers', 'Projector', 'Microphone'], 1),
        mcq('The deposit is described as:', ['Non-refundable', 'Refundable', 'Optional'], 1),
      ],
    },
    {
      title: T2,
      script: `Campus tour announcement (extended IELTS-style practice script).

Guide: Welcome everyone to the campus tour. We’ll begin outside the main reception and walk to three key locations.
First, we’ll visit the student services building, where you can get help with timetables and accommodation queries.
After that, we’ll head to the sports centre. It’s open from six a.m. on weekdays, and it closes at ten p.m.
Finally, we’ll finish at the library, which stays open until midnight during exam periods.
Please stay with the group. If you need to leave early, tell me now. Also, because of construction, we’ll avoid the riverside path and take the central walkway instead.
All right — let’s begin.`,
      ttsChunks: [
        'Welcome to the campus tour. We will visit three key locations.',
        'First: student services.',
        'Second: the sports centre, open from six a.m. and closing at ten p.m.',
        'Finally: the library, open until midnight during exam periods.',
        'Because of construction, we will avoid the riverside path and take the central walkway.',
      ],
      questions: [
        mcq('The tour begins outside:', ['The library', 'Main reception', 'The café'], 1),
        mcq('Student services helps with:', ['Only sports membership', 'Timetables and accommodation', 'Parking fines'], 1),
        g('Sports centre opens at (number)', ['6', 'six']),
        g('Sports centre closes at (number)', ['10', 'ten']),
        g('The library stays open until (word/number)', ['midnight', '12']),
        mcq('During the tour they will avoid:', ['The central walkway', 'The riverside path', 'The bus stop'], 1),
        mcq('The tour visits how many locations?', ['Two', 'Three', 'Four'], 1),
        mcq('The last stop is:', ['The library', 'Student services', 'The sports centre'], 0),
        mcq('The guide asks people to:', ['Walk alone', 'Stay with the group', 'Run to the sports centre'], 1),
        mcq('Construction affects:', ['The route', 'The sports centre hours', 'Ticket prices'], 0),
      ],
    },
    {
      title: T3,
      script: `Two students discussing research methods (extended IELTS-style practice script).

Student A: I’m worried our survey questions are too long.
Student B: We can shorten them. The tutor said the biggest issue is low response rates.
Student A: True. Maybe we should add an incentive?
Student B: The department won’t pay for prizes, but we can offer a summary of results to participants.
Student A: Good idea. Also, should we do interviews as well?
Student B: Only a few. Remember, we have to submit the ethics form by Wednesday at 3 p.m.
Student A: Wednesday, three o’clock. Got it.
Student B: And the pilot survey needs to be tested with at least five people before we send it widely.
Student A: Okay, I’ll ask classmates to help.`,
      ttsChunks: [
        'I’m worried our survey questions are too long.',
        'The tutor said the biggest issue is low response rates.',
        'We have to submit the ethics form by Wednesday at three p.m.',
        'The pilot survey needs to be tested with at least five people.',
      ],
      questions: [
        mcq('Their main problem is:', ['Low response rates', 'Too many prizes', 'No internet'], 0),
        mcq('The department will not pay for:', ['Transport', 'Prizes', 'Printing'], 1),
        g('Ethics form deadline day', ['wednesday']),
        g('Ethics form deadline time (number)', ['3', 'three']),
        mcq('They will offer participants:', ['Cash', 'A results summary', 'Free lunch'], 1),
        mcq('They plan interviews:', ['None', 'Only a few', 'For everyone'], 1),
        g('Minimum pilot testers (number)', ['5', 'five']),
        mcq('They will shorten:', ['The survey questions', 'The lecture', 'The textbook'], 0),
        mcq('Student A will ask:', ['Classmates', 'Parents', 'Strangers on the street'], 0),
        mcq('The ethics form is needed before:', ['Sending widely', 'Reading the article', 'Buying prizes'], 0),
      ],
    },
    {
      title: T4,
      script: `Lecture on habit formation (extended IELTS-style practice script).

Lecturer: In behavioural science, habits are often described as automatic responses to cues.
One widely used model breaks habit formation into three parts: cue, routine, and reward.
For example, a notification sound can be the cue; checking your phone is the routine; and the feeling of relief is the reward.
Researchers argue that changing the cue is difficult, but replacing the routine while keeping the same reward can be effective.
Another important point is time: habits rarely form overnight. A common estimate is around sixty-six days, though it varies widely by person and by behaviour.
Finally, self-monitoring — for instance, using a simple checklist — can increase the likelihood of sustaining a new routine.`,
      ttsChunks: [
        'Habits are often described as automatic responses to cues.',
        'A common model includes cue, routine, and reward.',
        'Replacing the routine while keeping the same reward can be effective.',
        'A common estimate is around sixty-six days.',
        'Self-monitoring, such as a checklist, can help sustain a new routine.',
      ],
      questions: [
        mcq('Habits are described as responses to:', ['Rewards', 'Cues', 'Prices'], 1),
        mcq('The model has how many parts?', ['Two', 'Three', 'Five'], 1),
        g('One estimate for forming a habit is about (number)', ['66', 'sixty-six', 'sixtysix']),
        mcq('Changing the cue is described as:', ['Easy', 'Difficult', 'Unnecessary'], 1),
        mcq('Replacing the routine can work if you keep the same:', ['Cue', 'Reward', 'Weather'], 1),
        mcq('A notification sound is an example of a:', ['Cue', 'Reward', 'Routine'], 0),
        mcq('Checking your phone is the:', ['Reward', 'Routine', 'Cue'], 1),
        mcq('Self-monitoring example:', ['Checklist', 'Television', 'Cooking'], 0),
        mcq('The estimate varies by:', ['Person and behaviour', 'Only country', 'Only age'], 0),
        mcq('Habits form overnight, according to the lecture:', ['TRUE', 'FALSE', 'NOT GIVEN'], 1),
      ],
    },
  ],
]
