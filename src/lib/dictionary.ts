let wordSet: Set<string> | null = null
let loadingPromise: Promise<void> | null = null

// Common English words list URL (SOWPODS-based)
const WORD_LIST_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'

export async function loadDictionary(): Promise<void> {
  if (wordSet !== null) return
  if (loadingPromise !== null) return loadingPromise

  loadingPromise = (async () => {
    try {
      const response = await fetch(WORD_LIST_URL)
      const text = await response.text()
      const words = text
        .split('\n')
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length >= 3) // Only words 3+ letters
      wordSet = new Set(words)
      console.log(`Dictionary loaded: ${wordSet.size} words`)
    } catch (error) {
      console.error('Failed to load dictionary:', error)
      // Fallback to a minimal set of common words
      wordSet = new Set(FALLBACK_WORDS)
    }
  })()

  return loadingPromise
}

export function isValidWord(word: string): boolean {
  if (!wordSet) return false
  return wordSet.has(word.toLowerCase())
}

export function isDictionaryLoaded(): boolean {
  return wordSet !== null
}

// Fallback common words if fetch fails
const FALLBACK_WORDS = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who',
  'boy', 'did', 'man', 'let', 'put', 'say', 'she', 'too', 'use', 'word',
  'cat', 'dog', 'run', 'fun', 'sun', 'big', 'red', 'blue', 'green', 'hot',
  'cold', 'fast', 'slow', 'high', 'low', 'good', 'bad', 'best', 'test',
  'game', 'play', 'word', 'dice', 'grid', 'cell', 'time', 'win', 'lose',
  'start', 'stop', 'move', 'place', 'take', 'make', 'give', 'find', 'tell',
  'that', 'this', 'with', 'have', 'from', 'they', 'been', 'call', 'will',
  'each', 'make', 'like', 'long', 'look', 'more', 'some', 'than', 'them',
  'then', 'time', 'very', 'when', 'come', 'made', 'find', 'here', 'many',
  'only', 'over', 'such', 'take', 'into', 'year', 'your', 'good', 'just',
  'know', 'back', 'work', 'first', 'well', 'even', 'want', 'because', 'any',
  'these', 'give', 'most', 'hand', 'high', 'think', 'also', 'last', 'need',
  'feel', 'seem', 'being', 'child', 'few', 'small', 'world', 'still', 'own',
  'left', 'right', 'house', 'home', 'great', 'help', 'might', 'came', 'show',
  'every', 'went', 'head', 'under', 'turn', 'live', 'line', 'same', 'three',
  'other', 'open', 'kind', 'keep', 'never', 'spell', 'air', 'away', 'animal',
  'far', 'hard', 'near', 'read', 'write', 'why', 'ask', 'men', 'change',
  'went', 'light', 'land', 'point', 'mother', 'answer', 'found', 'learn',
  'should', 'america', 'world', 'letter', 'follow', 'sound', 'water', 'form',
]
