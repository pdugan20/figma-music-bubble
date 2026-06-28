import { SelectionStatus } from '../types'
import { LAYER } from './bubble-schema'

export function getSelectionStatus(selection: readonly SceneNode[]): SelectionStatus {
  const insert: SelectionStatus = { ok: false, message: 'No bubble selected' }
  if (selection.length !== 1) return insert
  const node = selection[0]
  if (node.type !== 'INSTANCE') return insert
  if (!node.findOne((n) => n.name === LAYER.SONG_NAME)) return insert
  return { ok: true, message: '1 layer selected' }
}
