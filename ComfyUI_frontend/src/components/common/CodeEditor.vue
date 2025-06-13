<template>
  <Dialog
    :visible="visible"
    :header="title"
    :style="{ width: '80vw', height: '80vh' }"
    :modal="true"
    :closable="true"
    :dismissableMask="true"
    class="code-editor-dialog"
    @update:visible="(value: boolean) => emit('update:visible', value)"
  >
    <div ref="editorContainer" class="code-editor-container"></div>
    <template #footer>
      <Button
        label="Save"
        icon="pi pi-check"
        @click="handleSave"
        class="p-button-text"
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="handleCancel"
        class="p-button-text"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, nextTick } from 'vue'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps<{
  visible: boolean
  title: string
  code: string
  language?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', code: string): void
}>()

const editorContainer = ref<HTMLElement | null>(null)
let editor: EditorView | null = null

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
  }
})

watch(
  () => props.visible,
  async (newVisible: boolean) => {
    if (newVisible) {
      await nextTick()
      
      // Log dimensions right before CodeMirror creation
      console.log("Before CodeMirror creation - Editor Container Width:", editorContainer.value?.offsetWidth);
      console.log("Before CodeMirror creation - Editor Container Height:", editorContainer.value?.offsetHeight);

      if (!editor && editorContainer.value) {
        const state = EditorState.create({
          doc: props.code,
          extensions: [
            basicSetup,
            javascript(),
            // oneDark, // Temporarily commented out
            EditorView.updateListener.of((update: ViewUpdate) => {
              if (update.docChanged) {
                // Handle any changes if needed
              }
            })
          ]
        })
        
        editor = new EditorView({
          state,
          parent: editorContainer.value
        })
      } else if (editor) {
        editor.dispatch({
          changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: props.code
          }
        })
      }

      // Add a small delay and re-log dimensions for debugging
      setTimeout(() => {
        console.log("After setTimeout - Editor Container Width:", editorContainer.value?.offsetWidth);
        console.log("After setTimeout - Editor Container Height:", editorContainer.value?.offsetHeight);
      }, 50);

    } else {
      if (editor) {
        editor.destroy()
        editor = null
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.code,
  (newCode: string) => {
    if (editor && editor.state.doc.toString() !== newCode) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: newCode
        }
      })
    }
  }
)

const handleSave = () => {
  if (editor) {
    emit('save', editor.state.doc.toString())
    emit('update:visible', false)
  }
}

const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
/* Target the main dialog element */
:deep(.p-dialog) {
  display: flex;
  flex-direction: column;
  height: 100% !important;
  max-height: 100% !important;
}

/* Ensure the dialog content area grows and is a flex container */
:deep(.p-dialog-content) {
  flex-grow: 1 !important;
  display: flex;
  flex-direction: column;
  min-height: 0 !important;
  padding: 0 !important;
  position: relative;
}

/* Prevent header and footer from taking all space */
:deep(.p-dialog-header),
:deep(.p-dialog-footer) {
  flex-shrink: 0 !important;
}

.code-editor-container {
  width: 100% !important;
  height: 100% !important;
  flex-grow: 1 !important;
  border: 1px solid var(--surface-border);
  box-sizing: border-box;
  overflow: hidden;
}

/* CodeMirror specific styles */
:deep(.cm-editor) {
  height: 100% !important;
  font-size: 14px;
}

:deep(.cm-scroller) {
  overflow: auto;
}
</style> 