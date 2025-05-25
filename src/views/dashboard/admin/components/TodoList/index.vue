<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List" @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked })">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ pluralizeText }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ capitalizeText(key) }}</a>
        </li>
      </ul>
      <!-- <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
        Clear completed
      </button> -->
    </footer>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import Todo from './Todo.vue'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}

const defaultList = [
  { text: 'star this repository', done: false },
  { text: 'fork this repository', done: false },
  { text: 'follow author', done: false },
  { text: 'vue-element-admin', done: true },
  { text: 'vue', done: true },
  { text: 'element-ui', done: true },
  { text: 'axios', done: true },
  { text: 'webpack', done: true }
]

// 响应式数据
const visibility = ref('all')
const todos = ref(defaultList)

// 计算属性
const allChecked = computed(() => {
  return todos.value.every(todo => todo.done)
})

const filteredTodos = computed(() => {
  return filters[visibility.value](todos.value)
})

const remaining = computed(() => {
  return todos.value.filter(todo => !todo.done).length
})

// 替代过滤器的计算属性和方法
const pluralizeText = computed(() => {
  return remaining.value === 1 ? 'item' : 'items'
})

const capitalizeText = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 方法
const setLocalStorage = () => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}

const addTodo = (e) => {
  const text = e.target.value
  if (text.trim()) {
    todos.value.push({
      text,
      done: false
    })
    setLocalStorage()
  }
  e.target.value = ''
}

const toggleTodo = (val) => {
  val.done = !val.done
  setLocalStorage()
}

const deleteTodo = (todo) => {
  todos.value.splice(todos.value.indexOf(todo), 1)
  setLocalStorage()
}

const editTodo = ({ todo, value }) => {
  todo.text = value
  setLocalStorage()
}

const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.done)
  setLocalStorage()
}

const toggleAll = ({ done }) => {
  todos.value.forEach(todo => {
    todo.done = done
    setLocalStorage()
  })
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
