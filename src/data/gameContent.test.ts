import { describe, expect, it } from 'vitest'
import { QUESTIONS } from './gameContent'

describe('student friend-group question bank', () => {
  it('has at least 80 unique prompts', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(80)
    expect(new Set(QUESTIONS).size).toBe(QUESTIONS.length)
  })

  it('includes relatable class, deadline, and group-project situations', () => {
    expect(QUESTIONS.some((question) => /class|classroom|lecture/i.test(question))).toBe(true)
    expect(QUESTIONS.some((question) => /deadline|due today|assignment/i.test(question))).toBe(true)
    expect(QUESTIONS.some((question) => /group project|group-project|shared doc/i.test(question))).toBe(true)
  })
})
