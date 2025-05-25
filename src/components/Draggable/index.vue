<template>
  <VueDraggable
    v-model="modelValue"
    v-bind="$attrs"
    :animation="animation"
    :disabled="disabled"
    :ghost-class="ghostClass"
    :chosen-class="chosenClass"
    :drag-class="dragClass"
    @start="onStart"
    @end="onEnd"
    @add="onAdd"
    @update="onUpdate"
    @sort="onSort"
    @remove="onRemove"
    @filter="onFilter"
    @move="onMove"
    @clone="onClone"
    @change="onChange"
  >
    <template #item="{ element, index }">
      <slot name="item" :element="element" :index="index">
        {{ element }}
      </slot>
    </template>
    <template #header>
      <slot name="header" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </VueDraggable>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'

defineOptions({
  name: 'Draggable',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  animation: {
    type: Number,
    default: 150
  },
  disabled: {
    type: Boolean,
    default: false
  },
  ghostClass: {
    type: String,
    default: 'sortable-ghost'
  },
  chosenClass: {
    type: String,
    default: 'sortable-chosen'
  },
  dragClass: {
    type: String,
    default: 'sortable-drag'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'start',
  'end',
  'add',
  'update',
  'sort',
  'remove',
  'filter',
  'move',
  'clone',
  'change'
])

// 事件处理函数
const onStart = (evt) => {
  emit('start', evt)
}

const onEnd = (evt) => {
  emit('end', evt)
}

const onAdd = (evt) => {
  emit('add', evt)
}

const onUpdate = (evt) => {
  emit('update', evt)
}

const onSort = (evt) => {
  emit('sort', evt)
}

const onRemove = (evt) => {
  emit('remove', evt)
}

const onFilter = (evt) => {
  emit('filter', evt)
}

const onMove = (evt) => {
  emit('move', evt)
}

const onClone = (evt) => {
  emit('clone', evt)
}

const onChange = (evt) => {
  emit('change', evt)
}
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

.sortable-chosen {
  opacity: 0.8;
}

.sortable-drag {
  opacity: 0.8;
}
</style> 