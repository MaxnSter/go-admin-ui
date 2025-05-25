<template>
  <div ref="editorRef" class="codemirror-editor"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { go } from '@codemirror/lang-go'
import { vue } from '@codemirror/lang-vue'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'javascript'
  },
  theme: {
    type: String,
    default: 'light'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  lineNumbers: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
const editorView = ref(null)

const getLanguageExtension = (mode) => {
  switch (mode) {
    case 'javascript':
    case 'text/javascript':
      return javascript()
    case 'go':
    case 'text/x-go':
      return go()
    case 'vue':
    case 'text/x-vue':
      return vue()
    default:
      return javascript()
  }
}

const createEditor = () => {
  if (!editorRef.value) return

  const extensions = [
    basicSetup,
    getLanguageExtension(props.mode),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString()
        emit('update:modelValue', newValue)
      }
    })
  ]

  if (props.theme === 'dark') {
    extensions.push(oneDark)
  }

  if (props.readonly) {
    extensions.push(EditorState.readOnly.of(true))
  }

  const state = EditorState.create({
    doc: props.modelValue,
    extensions
  })

  editorView.value = new EditorView({
    state,
    parent: editorRef.value
  })
}

const updateContent = (newValue) => {
  if (editorView.value && newValue !== editorView.value.state.doc.toString()) {
    const transaction = editorView.value.state.update({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: newValue
      }
    })
    editorView.value.dispatch(transaction)
  }
}

const updateMode = (newMode) => {
  if (!editorView.value) return
  
  const extensions = [
    basicSetup,
    getLanguageExtension(newMode),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString()
        emit('update:modelValue', newValue)
      }
    })
  ]

  if (props.theme === 'dark') {
    extensions.push(oneDark)
  }

  if (props.readonly) {
    extensions.push(EditorState.readOnly.of(true))
  }

  const state = EditorState.create({
    doc: editorView.value.state.doc.toString(),
    extensions
  })

  editorView.value.setState(state)
}

watch(() => props.modelValue, updateContent)
watch(() => props.mode, updateMode)

onMounted(() => {
  createEditor()
})

onBeforeUnmount(() => {
  if (editorView.value) {
    editorView.value.destroy()
  }
})

// 暴露方法给父组件
defineExpose({
  focus: () => editorView.value?.focus(),
  getContent: () => editorView.value?.state.doc.toString() || '',
  setContent: updateContent
})
</script>

<style scoped>
.codemirror-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.codemirror-editor :deep(.cm-editor) {
  height: 100%;
}

.codemirror-editor :deep(.cm-focused) {
  outline: none;
}
</style> 