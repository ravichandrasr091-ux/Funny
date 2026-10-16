import rawQuestionBank from './questionBank.json'

export const QUESTION_CATEGORIES = {
  friends: 'Friends',
  siblings: 'Siblings',
  family: 'Family',
  'couples-crushes': 'Couples & Crushes',
  'brainrot-memes': 'Brainrot & Memes',
} as const

export type QuestionCategory = keyof typeof QUESTION_CATEGORIES

export interface Question {
  id: string
  category: QuestionCategory
  tags: string[]
  text: string
}

type QuestionInput = Omit<Question, 'category'>
const pack = rawQuestionBank as Record<QuestionCategory, QuestionInput[]>

export const QUESTION_BANK: Question[] = Object.entries(pack).flatMap(([category, questions]) =>
  questions.map((question) => ({ ...question, category: category as QuestionCategory })),
)

export const QUESTIONS = QUESTION_BANK.map((question) => question.text)

const questionByText = new Map(QUESTION_BANK.map((question) => [question.text, question]))

export function findQuestionByText(text: string): Question | undefined {
  return questionByText.get(text)
}

export function selectQuestions(
  count: number,
  category: QuestionCategory = 'friends',
  randomIndex: (length: number) => number = (length) => crypto.getRandomValues(new Uint32Array(1))[0] % length,
): Question[] {
  const remaining = QUESTION_BANK.filter((question) => question.category === category)
  const selected: Question[] = []
  let previousTags = new Set<string>()

  while (remaining.length > 0 && selected.length < count) {
    const eligible = remaining
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => !question.tags.some((tag) => previousTags.has(tag)))
    const candidates = eligible.length > 0
      ? eligible
      : remaining.map((question, index) => ({ question, index }))
    const choice = candidates[randomIndex(candidates.length)] ?? candidates[0]
    const [question] = remaining.splice(choice.index, 1)
    selected.push(question)
    previousTags = new Set(question.tags)
  }

  return selected
}
