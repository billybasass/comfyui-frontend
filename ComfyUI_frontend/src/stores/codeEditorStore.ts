import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LGraphNode } from '@comfyorg/litegraph'

export const useCodeEditorStore = defineStore('codeEditor', () => {
  const isVisible = ref(false)
  const currentNode = ref<LGraphNode | null>(null)
  const editorTitle = ref('')
  const editorCode = ref('')
  const editorLanguage = ref('javascript')

  function showEditor(node: LGraphNode, title: string, code: string, language?: string) {
    currentNode.value = node
    editorTitle.value = title
    editorCode.value = code
    editorLanguage.value = language || 'javascript'
    isVisible.value = true
  }

  function hideEditor() {
    isVisible.value = false
    currentNode.value = null
    editorTitle.value = ''
    editorCode.value = ''
    editorLanguage.value = 'javascript'
  }

  function saveCode(code: string) {
    if (currentNode.value) {
      // Update the node's code
      currentNode.value.code = code
      // Trigger any necessary updates
      currentNode.value.setDirtyCanvas(true, true)
    }
    hideEditor()
  }

  return {
    isVisible,
    currentNode,
    editorTitle,
    editorCode,
    editorLanguage,
    showEditor,
    hideEditor,
    saveCode
  }
}) 