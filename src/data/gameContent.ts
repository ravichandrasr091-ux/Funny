export type GameMode = 'likely' | 'roast' | 'guess' | 'delulu'

export interface Player {
  id: string
  nickname: string
  avatar: string
  isHost: boolean
  isDemo: boolean
}

export interface Room {
  id: string
  code: string
  name: string
  mode: GameMode
  status: 'lobby' | 'playing' | 'finished'
  hostId: string
  players: Player[]
  settings: { rounds: number; playerLimit: number; allowSelfVote: boolean; allowSkip: boolean }
  questions: string[]
  roundIndex: number
  votes: Record<number, Record<string, string>>
  history: { playerId: string; total: number }[][]
  resultId?: string
  expiresAt: number
}

export interface Result {
  id: string
  roomName: string
  mode: GameMode
  winner?: Player
  winners?: Player[]
  votes: number
  totalVotes: number
  caption: string
  createdAt: number
}

export const AVATARS = ['🤡', '👽', '🐸', '💀', '🦆', '🧃', '🐈', '🫠', '🦖', '🍕', '🦋', '🧠']

export const QUESTIONS = [
  'Who says “I will start the assignment after dinner” and meets the deadline at 11:58 PM?',
  'Who opens the group project doc, changes the title font, and calls it progress?',
  'Who says “I did not study” then casually knows every answer?',
  'Who is most likely to ask “wait, this is due today?” in the group chat?',
  'Who brings six highlighters to class and borrows a pen anyway?',
  'Who would turn a five-minute study break into a full season of a show?',
  'Who says “let us lock in” and immediately checks their phone?',
  'Who would make the group presentation intro longer than the actual topic?',
  'Who has 42 tabs open for one assignment and still cannot find the rubric?',
  'Who is most likely to type “sorry, just saw this” while actively online?',
  'Who would show up for the snacks and accidentally learn the whole lesson?',
  'Who turns “I will be there in five” into a mysterious time zone?',
  'Who would volunteer to share their screen, then panic-close every tab?',
  'Who could make a simple group-project meeting need a group-project meeting?',
  'Who says “the notes are in the chat” and sends 37 screenshots?',
  'Who is most likely to pack for class like they are moving into the library?',
  'Who would submit the file named final_FINAL_reallyfinal_v7?',
  'Who spends longer picking a study playlist than studying?',
  'Who would turn a cafeteria snack run into a full friend-group expedition?',
  'Who says “I am just going to sit for a second” and wakes up after class?',
  'Who would read one sentence of the assignment and confidently explain the whole thing?',
  'Who is most likely to have a color-coded planner and still miss the deadline?',
  'Who would make a meme about the exam before checking what chapters are on it?',
  'Who starts a study group and somehow becomes the entertainment committee?',
  'Who would bring a charger for everyone except themselves?',
  'Who is most likely to say “this class is easy” right before the surprise quiz?',
  'Who would get lost finding a classroom they have visited all semester?',
  'Who says “I am not hungry” then steals exactly half your fries?',
  'Who could turn borrowing one pencil into a long-term stationery lease?',
  'Who would remember the lecture gossip but forget the lecture topic?',
  'Who is most likely to have a camera roll full of board photos they never open?',
  'Who writes “quick question” then sends a voice note with three chapters?',
  'Who would make the class group chat active only when the deadline is close?',
  'Who says “I will just skim the reading” and ends up highlighting the entire page?',
  'Who is most likely to bring a snack loud enough to become the lecture soundtrack?',
  'Who would turn a normal class presentation into a dramatic movie trailer?',
  'Who says “I know a shortcut to campus” and adds a scenic tour?',
  'Who would create a beautiful study timetable and follow it for one afternoon?',
  'Who turns a small quiz score into a full sports commentary recap?',
  'Who would ask the teacher a question, then answer it before they can?',
  'Who is most likely to say “I am outside” while still choosing an outfit?',
  'Who would make a group assignment feel like a reality-show finale?',
  'Who has the strongest opinions about which seat is the lucky seat?',
  'Who would send “where are you?” from the wrong building?',
  'Who says “one more video” and returns to studying in a different century?',
  'Who would use the whole class break to decide what to eat during the next break?',
  'Who is most likely to have a secret stash of emergency snacks in their bag?',
  'Who turns “let us meet at 3” into a 27-message scheduling thread?',
  'Who would reply to the class announcement with “thanks” and start 40 notifications?',
  'Who writes the group presentation script like they are accepting an award?',
  'Who would forget the assignment but remember everyone’s coffee order?',
  'Who is most likely to bring a laptop with 2% battery and pure confidence?',
  'Who says “I will do my part tonight” and sends it at exactly midnight?',
  'Who would take a power nap so serious it needs a calendar invite?',
  'Who has a different personality before and after the first snack?',
  'Who would make a tiny campus walk feel like an Olympic event?',
  'Who starts the group chat plan with “whatever you all want” then rejects every option?',
  'Who would make a playlist for a 12-minute ride to class?',
  'Who could turn a normal “good luck” text into a motivational speech?',
  'Who is most likely to screenshot the homework and then lose the screenshot?',
  'Who says “I am not procrastinating, I am building suspense” with a straight face?',
  'Who would get emotionally attached to the class mascot or campus cat?',
  'Who is most likely to pack three notebooks and write on a napkin?',
  'Who would choose the group-project slide theme before reading the topic?',
  'Who says “I will remember the room number” and immediately asks the group?',
  'Who would turn a regular school day into a five-part story recap?',
  'Who can make a two-line message sound like the season finale of the group chat?',
  'Who is most likely to celebrate finishing one paragraph like graduation day?',
  'Who would ask “is this graded?” before asking what the assignment is?',
  'Who gets to class early just to save seats for the entire friend group?',
  'Who would bring a tote bag, backpack, and mystery extra bag for one class?',
  'Who is most likely to say “I am so focused” while watching everyone else?',
  'Who would make an accidental late arrival look like a planned entrance?',
  'Who could turn choosing a study spot into a campus-wide research project?',
  'Who sends “I am on my way” before they have found their shoes?',
  'Who would create a shared doc and then be the only person typing in it?',
  'Who is most likely to ask for the homework after saying they were paying attention?',
  'Who would treat a free period like a rare side quest with snacks?',
  'Who has the most dramatic reaction to the printer saying “paper jam”?',
  'Who would spend all evening studying and forget to bring the one thing for the test?',
  'Who is most likely to make friends with someone just because they have good notes?',
  'Who would turn “we should hang out” into an actual calendar event?',
  'Who says “I will be productive today” and starts by reorganizing their desk?',
  'Who would make the most iconic reaction face when the teacher says “pop quiz”?',
  'Who is most likely to have a favorite classroom chair and defend it like a throne?',
  'Who would finish the group task, then ask what the group task was?',
  'Who could make a snack run take longer than the lecture?',
  'Who would accidentally send a class meme to the class group chat at 2 AM?',
  'Who says “we have plenty of time” when the countdown says 00:30?',
  'Who would remember every inside joke but forget the name of the assignment?',
  'Who turns “I need one minute” into a dramatic loading screen?',
  'Who would make a study guide so pretty it deserves its own graduation?',
  'Who is most likely to say “this is my last coffee” and immediately get another?',
  'Who would choose the group photo where everyone else blinked?',
  'Who could make “what should we do after class?” a full committee vote?',
  'Who would bring the wrong book but somehow have the right snacks?',
  'Who says “I will just check one notification” and returns after the lecture ends?',
  'Who is most likely to turn a missed bus into a motivational origin story?',
  'Who would announce “new semester, new me” and keep the same alarm snooze record?',
]

export const ROASTS = [
  '{name} has 99 problems and a calendar app is somehow all of them.',
  'Your Wi-Fi has better communication skills than {name}.',
  '{name}’s confidence is in 4K. The planning is in 144p.',
  '{name} could turn a two-minute errand into a limited series.',
  'The group chat has seen {name} type “on my way” from the couch.',
  '{name} has the energy of a software update at the worst possible time.',
  'If overthinking burned calories, {name} would be a professional athlete.',
  '{name} brings main-character energy to a very minor side quest.',
  '{name} is proof that “I’ll figure it out” is a complete strategy.',
  'Even the autocorrect has started asking {name} for clarification.',
  '{name} treats a low battery warning like a personal challenge.',
  'Somewhere, a to-do list is waiting for {name} to remember it exists.',
  '{name} has never met a simple decision they couldn’t make theatrical.',
  'A loading spinner has more patience than {name} in a queue.',
  '{name} would lose a game of hide-and-seek while holding the map.',
  'The plot is moving. {name} is still looking for their other shoe.',
  '{name} calls it multitasking. The rest of us call it opening more tabs.',
  'Even the snooze button is tired of negotiating with {name}.',
  '{name} has the rare talent of making “five minutes” a flexible concept.',
  'The plan was simple. Then {name} arrived with a subplot.',
]

export const DELULU_QUESTIONS = [
  'Your crush views your story. What does it mean?',
  'You send a text and they reply “haha”. The analysis begins…',
  'Plans are at 7. When do you start getting ready?',
  'A friend says “we need to talk”. Your brain says…',
  'You see a cute person at the coffee shop. Your move?',
  'Your online order is delayed by one day. The response?',
  'Someone says “maybe sometime”. You hear…',
  'You have an unexpectedly free afternoon. Obviously you…',
]
