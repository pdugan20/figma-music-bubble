import { describe, it, expect } from 'vitest'
import { darken, luminance, needsLightText, toHex } from './color'

describe('color', () => {
  it('darken scales each channel', () => {
    expect(darken({ r: 1, g: 0.5, b: 0.2 }, 0.5)).toEqual({ r: 0.5, g: 0.25, b: 0.1 })
  })

  it('luminance is higher for white than black', () => {
    expect(luminance({ r: 1, g: 1, b: 1 })).toBeGreaterThan(luminance({ r: 0, g: 0, b: 0 }))
  })

  it('needsLightText is true on a dark background', () => {
    expect(needsLightText({ r: 0.05, g: 0.05, b: 0.05 })).toBe(true)
  })

  it('needsLightText is false on a light background', () => {
    expect(needsLightText({ r: 0.95, g: 0.95, b: 0.95 })).toBe(false)
  })

  it('toHex formats 0-1 channels and falls back for null', () => {
    expect(toHex({ r: 1, g: 0, b: 0 })).toBe('#ff0000')
    expect(toHex(null)).toBe('#ccc')
  })
})
