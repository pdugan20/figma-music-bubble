import { RGB } from '../types'

export function darken(c: RGB, factor: number): RGB {
  return { r: c.r * factor, g: c.g * factor, b: c.b * factor }
}

export function luminance(c: RGB): number {
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
}

export function needsLightText(bg: RGB): boolean {
  const l = luminance(bg)
  const contrastWhite = 1.05 / (l + 0.05)
  const contrastBlack = (l + 0.05) / 0.05
  return contrastWhite > contrastBlack
}

export function toHex(color: RGB | null): string {
  if (!color) return '#ccc'
  return (
    '#' +
    [color.r, color.g, color.b]
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}
