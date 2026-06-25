import { describe, it, expect } from 'vitest'
import { RecentsStore, KeyValueStore } from './recents'
import { TrackEntry } from '../types'

function fakeStore(): KeyValueStore {
  const map = new Map<string, string>()
  return {
    getItem: (k) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  }
}

function entry(name: string): TrackEntry {
  return { trackName: name, artistName: 'A', artworkUrl: '', dominantColor: null }
}

describe('RecentsStore', () => {
  it('adds newest first', () => {
    const r = new RecentsStore(fakeStore())
    r.add(entry('one'))
    r.add(entry('two'))
    expect(r.get().map((e) => e.trackName)).toEqual(['two', 'one'])
  })

  it('dedupes by track + artist', () => {
    const r = new RecentsStore(fakeStore())
    r.add(entry('one'))
    r.add(entry('one'))
    expect(r.get()).toHaveLength(1)
  })

  it('caps at 5', () => {
    const r = new RecentsStore(fakeStore())
    for (const n of ['a', 'b', 'c', 'd', 'e', 'f']) r.add(entry(n))
    expect(r.get()).toHaveLength(5)
    expect(r.get()[0].trackName).toBe('f')
  })

  it('clears', () => {
    const r = new RecentsStore(fakeStore())
    r.add(entry('one'))
    r.clear()
    expect(r.get()).toEqual([])
  })
})
