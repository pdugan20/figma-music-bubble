import { PopulateMessage } from '../types'
import { getSelectionStatus } from './selection'
import { CanvasBubbleSource } from './bubble-source'
import { fillBubble } from './fill'
import { TOOL_ID, DISPLAY_NAME } from './meta'

const bubbleSource = new CanvasBubbleSource()

figma.showUI(__html__, { themeColors: true, width: 320, height: 480 })
figma.root.setRelaunchData({ [TOOL_ID]: DISPLAY_NAME })

function postSelection() {
  figma.ui.postMessage({
    type: 'selection',
    status: getSelectionStatus(figma.currentPage.selection),
  })
}

postSelection()
figma.on('selectionchange', postSelection)

figma.ui.onmessage = async (msg: PopulateMessage) => {
  if (msg.type !== 'populate') return
  const resolved = await bubbleSource.resolve()
  if (!resolved.ok) {
    figma.notify(resolved.message)
    return
  }
  const filled = await fillBubble(resolved.instance, msg)
  if (!filled) {
    figma.notify('Could not find the expected layers in this Music Bubble')
    return
  }
  if (resolved.created) figma.currentPage.selection = [resolved.instance]
  figma.notify(`Added ${msg.trackName} by ${msg.artistName}`)
}
