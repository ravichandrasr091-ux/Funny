import { beforeEach, describe, expect, it } from 'vitest'
import { createRoom, findRoom, getResult, saveResult, saveRoom, uniqueRoomCode } from './gameStore'
import type { Player, Result } from '../data/gameContent'
import { type QuestionCategory } from '../data/questionBank'

const host: Player = { id: 'host-id', nickname: 'Host', avatar: '🐸', isHost: true, isDemo: false }

beforeEach(() => localStorage.clear())

describe('local demo room storage', () => {
  it('rejects room limits below three or above twelve', () => {
    const create = (players: number) => createRoom({ roomName: 'Test room', nickname: host.nickname, mode: 'likely', rounds: 5, players, host, demoSeats: false })
    expect(() => create(2)).toThrow('Player limit must be between 3 and 12.')
    expect(() => create(13)).toThrow('Player limit must be between 3 and 12.')
  })

  it('creates a room with a short code and sample seats', () => {
    const beforeCreate = Date.now()
    const room = createRoom({ roomName: 'Test room', nickname: host.nickname, mode: 'likely', rounds: 5, players: 8, host, demoSeats: true })
    expect(room.code).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
    expect(room.players).toHaveLength(4)
    expect(room.questions).toHaveLength(5)
    expect(new Set(room.questions.map((question) => question.id)).size).toBe(5)
    expect(room.questionHistory).toEqual([])
    expect(room.expiresAt).toBeGreaterThanOrEqual(beforeCreate + 30 * 24 * 60 * 60 * 1000)
    expect(findRoom(room.code)?.id).toBe(room.id)
  })

  it('stores room state updates in the current browser', () => {
    const room = createRoom({ roomName: 'Test room', nickname: host.nickname, mode: 'likely', rounds: 3, players: 4, host, demoSeats: false })
    room.status = 'playing'
    saveRoom(room)
    expect(findRoom(room.code)?.status).toBe('playing')
  })

  it('stores and selects questions from the chosen category', () => {
    const category: QuestionCategory = 'siblings'
    const room = createRoom({ roomName: 'Sibling room', nickname: host.nickname, mode: 'likely', rounds: 5, players: 4, host, demoSeats: false, questionCategory: category })
    expect(room.settings.questionCategory).toBe(category)
    expect(room.questions).toHaveLength(5)
    expect(room.questions.every((question) => question.category === category)).toBe(true)
  })

  it('upgrades previously saved string questions without losing the room', () => {
    const room = createRoom({ roomName: 'Legacy room', nickname: host.nickname, mode: 'likely', rounds: 3, players: 4, host, demoSeats: false })
    localStorage.setItem('wtp-demo-rooms-v1', JSON.stringify([{ ...room, questions: room.questions.map((question) => question.text), questionHistory: undefined }]))
    const restored = findRoom(room.code)
    expect(restored?.questions).toHaveLength(3)
    expect(restored?.questions.every((question) => typeof question.id === 'string' && typeof question.text === 'string')).toBe(true)
    expect(restored?.questionHistory).toEqual([])
  })

  it('creates plausible invite codes', () => {
    expect(uniqueRoomCode()).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
  })

  it('stores result cards locally', () => {
    const result: Result = { id: 'result-1', roomName: 'Test', mode: 'likely', winner: host, votes: 2, totalVotes: 4, caption: 'Plot twist.', createdAt: Date.now() }
    saveResult(result)
    expect(getResult(result.id)).toEqual(result)
  })
})
