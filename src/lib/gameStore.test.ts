import { beforeEach, describe, expect, it } from 'vitest'
import { createRoom, findRoom, getResult, saveResult, saveRoom, uniqueRoomCode } from './gameStore'
import type { Player, Result } from '../data/gameContent'

const host: Player = { id: 'host-id', nickname: 'Host', avatar: '🐸', isHost: true, isDemo: false }

beforeEach(() => localStorage.clear())

describe('local demo room storage', () => {
  it('creates a room with a short code and sample seats', () => {
    const beforeCreate = Date.now()
    const room = createRoom({ roomName: 'Test room', nickname: host.nickname, mode: 'likely', rounds: 5, players: 8, host, demoSeats: true })
    expect(room.code).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
    expect(room.players).toHaveLength(4)
    expect(room.questions).toHaveLength(5)
    expect(room.expiresAt).toBeGreaterThanOrEqual(beforeCreate + 30 * 24 * 60 * 60 * 1000)
    expect(findRoom(room.code)?.id).toBe(room.id)
  })

  it('stores room state updates in the current browser', () => {
    const room = createRoom({ roomName: 'Test room', nickname: host.nickname, mode: 'likely', rounds: 3, players: 4, host, demoSeats: false })
    room.status = 'playing'
    saveRoom(room)
    expect(findRoom(room.code)?.status).toBe('playing')
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
