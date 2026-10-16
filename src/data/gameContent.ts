import type { Question, QuestionCategory } from './questionBank'

export type { Question } from './questionBank'
export { QUESTIONS } from './questionBank'
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
  settings: { rounds: number; playerLimit: number; allowSelfVote: boolean; allowSkip: boolean; questionCategory: QuestionCategory }
  questions: Question[]
  questionHistory: string[]
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
