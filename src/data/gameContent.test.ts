import { describe, expect, it } from 'vitest'
import { QUESTION_BANK, QUESTION_CATEGORIES, selectQuestions } from './questionBank'

describe('structured question bank', () => {
  it('meets the required size for every category', () => {
    const minimums = { friends: 60, siblings: 60, family: 60, 'couples-crushes': 60, 'brainrot-memes': 80 }
    for (const [category, minimum] of Object.entries(minimums)) {
      expect(QUESTION_BANK.filter((question) => question.category === category).length).toBeGreaterThanOrEqual(minimum)
    }
    expect(Object.keys(QUESTION_CATEGORIES)).toHaveLength(5)
    expect(QUESTION_BANK).toHaveLength(320)
  })

  it('has unique IDs and normalized text, valid tags, and mobile-length prompts', () => {
    const ids = QUESTION_BANK.map((question) => question.id)
    const normalized = QUESTION_BANK.map((question) => question.text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim())
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(normalized).size).toBe(normalized.length)
    for (const question of QUESTION_BANK) {
      expect(question.id).toBeTruthy()
      expect(question.tags.length).toBeGreaterThan(0)
      expect(question.text.trim().endsWith('?')).toBe(true)
      expect(question.text.trim().split(/\s+/).length).toBeLessThanOrEqual(10)
    }
  })

  it('selects without repeats and avoids adjacent matching topics', () => {
    const questions = selectQuestions(40, 'friends', () => 0)
    expect(questions).toHaveLength(40)
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length)
    for (let index = 1; index < questions.length; index += 1) {
      expect(questions[index].tags.some((tag) => questions[index - 1].tags.includes(tag))).toBe(false)
    }
  })

  it('selects only questions from the chosen pack', () => {
    const questions = selectQuestions(10, 'siblings', () => 0)
    expect(questions.every((question) => question.category === 'siblings')).toBe(true)
  })
})
