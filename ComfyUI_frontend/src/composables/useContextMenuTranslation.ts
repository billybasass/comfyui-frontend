import type {
  IContextMenuOptions,
  IContextMenuValue,
  INodeInputSlot,
  IWidget,
  LGraphNode
} from '@comfyorg/litegraph'
import { LGraphCanvas, LiteGraph } from '@comfyorg/litegraph'

import { st, te } from '@/i18n'
import { normalizeI18nKey } from '@/utils/formatUtil'
import { useCodeEditorStore } from '@/stores/codeEditorStore'

/**
 * Add translation for litegraph context menu.
 */
export const useContextMenuTranslation = () => {
  const f = LGraphCanvas.prototype.getCanvasMenuOptions
  const getCanvasCenterMenuOptions = function (
    this: LGraphCanvas,
    ...args: Parameters<typeof f>
  ) {
    const res = f.apply(this, args) as ReturnType<typeof f>
    for (const item of res) {
      if (item?.content) {
        item.content = st(`contextMenu.${item.content}`, item.content)
      }
    }
    return res
  }

  LGraphCanvas.prototype.getCanvasMenuOptions = getCanvasCenterMenuOptions

  const codeEditorStore = useCodeEditorStore()

  // Add Edit Code option to node context menu
  const originalGetNodeMenuOptions = LGraphCanvas.prototype.getNodeMenuOptions
  LGraphCanvas.prototype.getNodeMenuOptions = function (
    node: LGraphNode
  ) {
    console.log("Context menu opened for node:", node.title);
    console.log("Node object:", node);
    console.log("Does node have 'code' property?", 'code' in node);
    if ('code' in node) {
      console.log("Type of node.code:", typeof node.code);
      if (typeof node.code === 'string') {
        console.log("Node code (first 50 chars):");
        console.log(node.code.substring(0, 50));
      }
    }

    const menuOptions = originalGetNodeMenuOptions.call(this, node)
    
    // Add Edit Code option if the node has code
    if ('code' in node && typeof node.code === 'string') {
      menuOptions.push({
        content: 'Edit Code',
        callback: () => {
          codeEditorStore.showEditor(
            node,
            `Edit Code - ${node.title}`,
            node.code as string,
            'javascript'
          )
        }
      })
    }
    
    return menuOptions
  }

  function translateMenus(
    values: readonly (IContextMenuValue | string | null)[] | undefined,
    options: IContextMenuOptions
  ) {
    if (!values) return
    const reInput = /Convert (.*) to input/
    const reWidget = /Convert (.*) to widget/
    const cvt = st('contextMenu.Convert ', 'Convert ')
    const tinp = st('contextMenu. to input', ' to input')
    const twgt = st('contextMenu. to widget', ' to widget')
    for (const value of values) {
      if (typeof value === 'string') continue

      translateMenus(value?.submenu?.options, options)
      if (!value?.content) {
        continue
      }
      if (te(`contextMenu.${value.content}`)) {
        value.content = st(`contextMenu.${value.content}`, value.content)
      }

      // for capture translation text of input and widget
      const extraInfo: any = options.extra || options.parentMenu?.options?.extra
      // widgets and inputs
      const matchInput = value.content?.match(reInput)
      if (matchInput) {
        let match = matchInput[1]
        extraInfo?.inputs?.find((i: INodeInputSlot) => {
          if (i.name != match) return false
          match = i.label ? i.label : i.name
        })
        extraInfo?.widgets?.find((i: IWidget) => {
          if (i.name != match) return false
          match = i.label ? i.label : i.name
        })
        value.content = cvt + match + tinp
        continue
      }
      const matchWidget = value.content?.match(reWidget)
      if (matchWidget) {
        let match = matchWidget[1]
        extraInfo?.inputs?.find((i: INodeInputSlot) => {
          if (i.name != match) return false
          match = i.label ? i.label : i.name
        })
        extraInfo?.widgets?.find((i: IWidget) => {
          if (i.name != match) return false
          match = i.label ? i.label : i.name
        })
        value.content = cvt + match + twgt
        continue
      }
    }
  }

  const OriginalContextMenu = LiteGraph.ContextMenu
  function ContextMenu(
    values: (IContextMenuValue | string)[],
    options: IContextMenuOptions
  ) {
    if (options.title) {
      options.title = st(
        `nodeDefs.${normalizeI18nKey(options.title)}.display_name`,
        options.title
      )
    }
    translateMenus(values, options)
    const ctx = new OriginalContextMenu(values, options)
    return ctx
  }

  LiteGraph.ContextMenu = ContextMenu as unknown as typeof LiteGraph.ContextMenu
  LiteGraph.ContextMenu.prototype = OriginalContextMenu.prototype
}
