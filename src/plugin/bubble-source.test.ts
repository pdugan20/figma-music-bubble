import { describe, it, expect, afterEach } from 'vitest'
import { CanvasBubbleSource } from './bubble-source'
import { LAYER } from './bubble-schema'

const songMatcher = (p: (n: { name: string }) => boolean) =>
  p({ name: LAYER.SONG_NAME }) ? {} : null

function makeInstance() {
  return { width: 100, height: 80, x: 0, y: 0 }
}

afterEach(() => {
  delete (globalThis as { figma?: unknown }).figma
})

function setFigma(opts: { selection?: unknown[]; byType?: Record<string, unknown[]> }) {
  ;(globalThis as { figma?: unknown }).figma = {
    currentPage: { selection: opts.selection ?? [] },
    loadAllPagesAsync: async () => {},
    viewport: { center: { x: 50, y: 60 } },
    root: {
      findAllWithCriteria: (c: { types: string[] }) => {
        const out: unknown[] = []
        for (const t of c.types) out.push(...(opts.byType?.[t] ?? []))
        return out
      },
    },
  }
}

describe('CanvasBubbleSource', () => {
  it('uses the selected bubble without creating one', async () => {
    const instance = { type: 'INSTANCE', findOne: songMatcher }
    setFigma({ selection: [instance] })
    const res = await new CanvasBubbleSource().resolve()
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.instance).toBe(instance)
      expect(res.created).toBe(false)
    }
  })

  it('creates from an existing bubble instance when nothing valid is selected', async () => {
    const newInstance = makeInstance()
    const mainComponent = { createInstance: () => newInstance }
    const existing = {
      type: 'INSTANCE',
      findOne: songMatcher,
      getMainComponentAsync: async () => mainComponent,
    }
    setFigma({ selection: [], byType: { INSTANCE: [existing] } })
    const res = await new CanvasBubbleSource().resolve()
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.instance).toBe(newInstance)
      expect(res.created).toBe(true)
    }
    expect(newInstance.x).toBe(0) // 50 - 100/2
    expect(newInstance.y).toBe(20) // 60 - 80/2
  })

  it('creates from a standalone local component', async () => {
    const newInstance = makeInstance()
    const comp = {
      type: 'COMPONENT',
      parent: { type: 'PAGE' },
      findOne: songMatcher,
      createInstance: () => newInstance,
    }
    setFigma({ selection: [], byType: { COMPONENT: [comp] } })
    const res = await new CanvasBubbleSource().resolve()
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.created).toBe(true)
  })

  it('creates from a component set default variant', async () => {
    const newInstance = makeInstance()
    const variant = { findOne: songMatcher, createInstance: () => newInstance }
    const set = { type: 'COMPONENT_SET', defaultVariant: variant }
    setFigma({ selection: [], byType: { COMPONENT_SET: [set] } })
    const res = await new CanvasBubbleSource().resolve()
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.instance).toBe(newInstance)
  })

  it('fails when no bubble exists in the file', async () => {
    setFigma({ selection: [] })
    const res = await new CanvasBubbleSource().resolve()
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.message).toBe('Could not find a Music Bubble to use')
  })
})
