import { describe, it, expect } from 'vitest'
import { createApp } from 'vue'
import waves from '@/directive/waves/waves'

describe('Custom Directives', () => {
  it('should register waves directive', () => {
    const app = createApp({})
    app.directive('waves', waves)
    
    expect(app._context.directives.waves).toBeDefined()
  })

  it('waves directive should have correct lifecycle hooks', () => {
    expect(typeof waves).toBe('object')
    expect(waves).toHaveProperty('mounted')
    expect(waves).toHaveProperty('updated')
    expect(waves).toHaveProperty('beforeUnmount')
  })
})