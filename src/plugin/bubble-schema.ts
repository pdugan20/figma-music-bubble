export const LAYER = {
  SONG_NAME: 'Song Name',
  ARTIST_NAME: 'Artist Name',
  ALBUM_ART: 'Album Art',
  MESSAGE_CONTAINER: 'Message Container',
  TAIL: 'Shape',
  APPLE_LOGO: ['Apple Logo', 'Apple'] as readonly string[],
} as const

// Variant (component) property that switches the bubble into its editable
// "dynamic color" mode. When it is False the bubble/tail fills are bound to the
// default iMessage color variable, so the plugin enables this before applying
// the artwork color.
export const DYNAMIC_COLORS = {
  PROP: 'Uses dynamic colors',
  ON: 'True',
} as const

// Variant property that adds the bubble tail. The tail's Shape node only exists
// in the True variants, so the plugin force-enables it while applying color (then
// restores the user's choice) — the fill override persists, keeping the tail in
// sync with the bubble whenever it is shown.
export const HAS_TAIL = {
  PROP: 'Has tail',
  ON: 'True',
} as const
