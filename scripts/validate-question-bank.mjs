import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bankPath = path.join(root, 'src/data/questionBank.json')
const reviewPath = path.join(root, 'src/data/question-similarity-review.json')
const minimums = {
  friends: 60,
  siblings: 60,
  family: 60,
  'couples-crushes': 60,
  'brainrot-memes': 80,
}
const errors = []

const bank = JSON.parse(await readFile(bankPath, 'utf8'))
const review = JSON.parse(await readFile(reviewPath, 'utf8'))
const ids = new Set()
const normalizedTexts = new Map()
const allQuestions = []

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function contentWords(text) {
  const ignored = new Set(['who', 'whod', 'would', 'could', 'the', 'a', 'an', 'to', 'for', 'of', 'on', 'in', 'at', 'their', 'they', 'it', 'its', 'then', 'and', 'with', 'from', 'while', 'before', 'after', 'like', 'own'])
  return new Set(normalize(text).split(' ').filter((word) => word && !ignored.has(word)))
}

function overlap(left, right) {
  const a = contentWords(left)
  const b = contentWords(right)
  const intersection = [...a].filter((word) => b.has(word)).length
  const union = new Set([...a, ...b]).size
  return union === 0 ? 0 : intersection / union
}

for (const [category, minimum] of Object.entries(minimums)) {
  const questions = bank[category]
  if (!Array.isArray(questions)) {
    errors.push(`Missing or invalid category: ${category}`)
    continue
  }
  if (questions.length < minimum) errors.push(`${category}: ${questions.length} questions; minimum is ${minimum}`)
  console.log(`${category}: ${questions.length}`)
  for (const question of questions) {
    if (typeof question.id !== 'string' || !question.id.trim()) errors.push(`${category}: missing question ID`)
    else if (ids.has(question.id)) errors.push(`Duplicate question ID: ${question.id}`)
    else ids.add(question.id)

    if (typeof question.text !== 'string' || !question.text.trim() || !question.text.trim().endsWith('?')) {
      errors.push(`${question.id ?? category}: empty or invalid question text`)
      continue
    }
    const wordCount = question.text.trim().split(/\s+/).length
    if (wordCount > 10) errors.push(`${question.id}: ${wordCount} words (maximum 10): ${question.text}`)
    if (!Array.isArray(question.tags) || question.tags.length === 0 || question.tags.some((tag) => typeof tag !== 'string' || !tag.trim())) {
      errors.push(`${question.id}: missing topic tags`)
    }

    const normalized = normalize(question.text)
    const existing = normalizedTexts.get(normalized)
    if (existing) errors.push(`Duplicate normalized text: ${existing} and ${question.id}`)
    else normalizedTexts.set(normalized, question.id)
    allQuestions.push({ ...question, category })
  }
}

for (const category of Object.keys(bank)) {
  if (!(category in minimums)) errors.push(`Unknown category: ${category}`)
}

const idSet = new Set(allQuestions.map((question) => question.id))
const reviewedPairs = new Set()
for (const item of review.pairs ?? []) {
  if (!idSet.has(item.left) || !idSet.has(item.right)) errors.push(`Similarity review references an unknown ID: ${item.left} / ${item.right}`)
  if (!['distinct', 'rewritten'].includes(item.decision)) errors.push(`Similarity review needs a distinct/rewritten decision: ${item.left} / ${item.right}`)
  if (!item.resolution?.trim()) errors.push(`Similarity review needs a resolution: ${item.left} / ${item.right}`)
  const key = [item.left, item.right].sort().join('|')
  if (reviewedPairs.has(key)) errors.push(`Duplicate similarity review pair: ${key}`)
  reviewedPairs.add(key)
}

const nearPairs = []
for (let leftIndex = 0; leftIndex < allQuestions.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < allQuestions.length; rightIndex += 1) {
    const left = allQuestions[leftIndex]
    const right = allQuestions[rightIndex]
    if (left.category !== right.category) continue
    const score = overlap(left.text, right.text)
    if (score >= 0.58) {
      const key = [left.id, right.id].sort().join('|')
      nearPairs.push({ left: left.id, right: right.id, score: Number(score.toFixed(2)), reviewed: reviewedPairs.has(key) })
    }
  }
}

console.log(`total: ${allQuestions.length}`)
console.log(`manual semantic review pairs: ${(review.pairs ?? []).length}`)
console.log(`near-wording candidates (review manually): ${nearPairs.length}`)
for (const pair of nearPairs) {
  const left = allQuestions.find((question) => question.id === pair.left)
  const right = allQuestions.find((question) => question.id === pair.right)
  console.log(`  ${pair.reviewed ? '[reviewed]' : '[REVIEW]'} ${pair.score} ${pair.left}: ${left.text} | ${pair.right}: ${right.text}`)
}

if (errors.length) {
  console.error(`\nQuestion bank validation failed (${errors.length} issue(s)):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('Question bank validation passed.')
}
