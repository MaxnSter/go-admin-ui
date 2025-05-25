import { describe, it, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

describe('Vue Router 4.x Basic Tests', () => {
  it('should create router instance', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/test', component: { template: '<div>Test</div>' } }
      ]
    })
    
    expect(router).toBeDefined()
    expect(router.getRoutes().length).toBe(2)
  })

  it('should support dynamic route addition', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: []
    })
    
    router.addRoute({
      path: '/dynamic',
      name: 'Dynamic',
      component: { template: '<div>Dynamic</div>' }
    })
    
    const routes = router.getRoutes()
    expect(routes.length).toBe(1)
    expect(routes[0].name).toBe('Dynamic')
  })
}) 