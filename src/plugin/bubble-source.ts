import { getSelectionStatus } from './selection'
import { LAYER } from './bubble-schema'

export type BubbleResolution =
  | { ok: true; instance: InstanceNode; created: boolean }
  | { ok: false; message: string }

export interface BubbleSource {
  resolve(): Promise<BubbleResolution>
}

function hasSongLayer(node: ChildrenMixin): boolean {
  return node.findOne((n) => n.name === LAYER.SONG_NAME) !== null
}

// A Music Bubble already placed in the file: clone its main component. Covers a
// library component that has been used in the file (no key needed).
async function findInstanceSource(): Promise<ComponentNode | null> {
  const instances = figma.root.findAllWithCriteria({ types: ['INSTANCE'] })
  for (const instance of instances) {
    if (hasSongLayer(instance)) {
      const main = await instance.getMainComponentAsync()
      if (main) return main
    }
  }
  return null
}

// A local main component or component set with the bubble structure.
function findComponentSource(): ComponentNode | null {
  const components = figma.root.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] })
  for (const node of components) {
    if (node.type === 'COMPONENT_SET') {
      const variant = node.defaultVariant
      if (variant && hasSongLayer(variant)) return variant
    } else if (node.parent?.type !== 'COMPONENT_SET') {
      if (hasSongLayer(node)) return node
    }
  }
  return null
}

export class CanvasBubbleSource implements BubbleSource {
  async resolve(): Promise<BubbleResolution> {
    const selection = figma.currentPage.selection
    if (getSelectionStatus(selection).ok) {
      return { ok: true, instance: selection[0] as InstanceNode, created: false }
    }

    await figma.loadAllPagesAsync()
    const component = (await findInstanceSource()) ?? findComponentSource()
    if (!component) return { ok: false, message: 'Could not find a Music Bubble to use' }

    const instance = component.createInstance()
    const center = figma.viewport.center
    instance.x = Math.round(center.x - instance.width / 2)
    instance.y = Math.round(center.y - instance.height / 2)
    return { ok: true, instance, created: true }
  }
}
