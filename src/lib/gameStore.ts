import { type Player, type Result, type Room } from '../data/gameContent'
import { findQuestionByText, selectQuestions, type Question, type QuestionCategory } from '../data/questionBank'

const ROOMS_KEY = 'wtp-demo-rooms-v1'
const RESULTS_KEY = 'wtp-demo-results-v1'
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

type StoredRoom = Omit<Room, 'settings' | 'questions' | 'questionHistory'> & {
  settings: Omit<Room['settings'], 'questionCategory'> & { questionCategory?: QuestionCategory }
  questions: Array<Question | string>
  questionHistory?: string[]
}

export function uniqueRoomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

function readRooms(): Room[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(ROOMS_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return (parsed as StoredRoom[])
      .filter((room) => room.expiresAt > Date.now())
      .map((room) => ({
        ...room,
        settings: { ...room.settings, questionCategory: room.settings.questionCategory ?? 'friends' },
        questions: room.questions.map((question, index) => typeof question === 'string'
          ? findQuestionByText(question) ?? {
              id: `legacy-${room.code}-${index + 1}`,
              category: 'friends' as const,
              tags: ['legacy'],
              text: question,
            }
          : question),
        questionHistory: room.questionHistory ?? [],
      }))
  } catch {
    return []
  }
}

export function createRoom(input: {
  roomName: string
  nickname: string
  mode: Room['mode']
  rounds: number
  players: number
  host: Player
  demoSeats: boolean
  questionCategory?: QuestionCategory
}): Room {
  const rooms = readRooms()
  let code = uniqueRoomCode()
  while (rooms.some((room) => room.code === code)) code = uniqueRoomCode()
  const players = [input.host]
  if (input.demoSeats) {
    const demoNames = ['Mildly Suspicious', 'Professional Yapper', 'Definitely Innocent']
    const demoAvatars = ['🐸', '🦆', '👽']
    for (let index = 0; index < Math.min(3, input.players - 1); index += 1) {
      players.push({ id: crypto.randomUUID(), nickname: demoNames[index], avatar: demoAvatars[index], isHost: false, isDemo: true })
    }
  }
  const questionCategory = input.questionCategory ?? 'friends'
  const questions = selectQuestions(input.rounds, questionCategory)
  const room: Room = {
    id: crypto.randomUUID(), code, name: input.roomName, mode: input.mode, status: 'lobby', hostId: input.host.id,
    players, settings: { rounds: input.rounds, playerLimit: input.players, allowSelfVote: false, allowSkip: false, questionCategory },
    questions, questionHistory: [], roundIndex: 0, votes: {}, history: [], expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  }
  rooms.push(room)
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
  return room
}

export function findRoom(code: string): Room | undefined {
  return readRooms().find((room) => room.code.toUpperCase() === code.toUpperCase())
}

export function saveRoom(updated: Room): void {
  const rooms = readRooms()
  const index = rooms.findIndex((room) => room.id === updated.id)
  if (index < 0) rooms.push(updated)
  else rooms[index] = updated
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
}

export function saveResult(result: Result): void {
  let results: Result[] = []
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '[]')
    if (Array.isArray(parsed)) results = parsed as Result[]
  } catch {
    results = []
  }
  results = [result, ...results.filter((item) => item.id !== result.id)].slice(0, 30)
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results))
}

export function getResult(id: string): Result | undefined {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as Result[]).find((result) => result.id === id) : undefined
  } catch {
    return undefined
  }
}
