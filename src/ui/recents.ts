import { TrackEntry } from '../types'

const RECENTS_KEY = 'music-bubble:recents'
const MAX_RECENTS = 5

export interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function createStore(): KeyValueStore {
  try {
    window.localStorage.getItem('__probe__')
    return window.localStorage
  } catch {
    const map = new Map<string, string>()
    return {
      getItem: (k) => (map.has(k) ? (map.get(k) as string) : null),
      setItem: (k, v) => void map.set(k, String(v)),
      removeItem: (k) => void map.delete(k),
    }
  }
}

export class RecentsStore {
  constructor(private store: KeyValueStore) {}

  get(): TrackEntry[] {
    try {
      return JSON.parse(this.store.getItem(RECENTS_KEY) || '[]') as TrackEntry[]
    } catch {
      return []
    }
  }

  add(entry: TrackEntry): void {
    const list = this.get().filter(
      (r) => !(r.trackName === entry.trackName && r.artistName === entry.artistName)
    )
    list.unshift(entry)
    this.store.setItem(RECENTS_KEY, JSON.stringify(list.slice(0, MAX_RECENTS)))
  }

  clear(): void {
    this.store.removeItem(RECENTS_KEY)
  }
}
