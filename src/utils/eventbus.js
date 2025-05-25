import { createApp } from 'vue'

// Vue 3 中推荐使用 mitt 或者自定义事件总线
// 这里提供一个简单的事件总线实现
class EventBus {
  constructor() {
    this.events = {}
  }

  $on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  $emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args))
    }
  }

  $off(event, callback) {
    if (this.events[event]) {
      if (callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback)
      } else {
        delete this.events[event]
      }
    }
  }
}

export default new EventBus()
