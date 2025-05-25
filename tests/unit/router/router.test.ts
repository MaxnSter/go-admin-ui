import { describe, it, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes, resetRouter } from '@/router'

describe('Router Configuration', () => {
  it('should create router with constant routes', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: constantRoutes
    })
    
    expect(router).toBeDefined()
    expect(router.getRoutes().length).toBeGreaterThan(0)
  })

  it('should have required constant routes', () => {
    const routePaths = constantRoutes.map(route => route.path)
    
    expect(routePaths).toContain('/')
    expect(routePaths).toContain('/login')
    expect(routePaths).toContain('/404')
    expect(routePaths).toContain('/401')
    expect(routePaths).toContain('/profile')
  })

  it('should have dashboard route with correct meta', () => {
    const dashboardRoute = constantRoutes.find(route => route.path === '/')
    
    expect(dashboardRoute).toBeDefined()
    expect(dashboardRoute?.children).toBeDefined()
    expect(dashboardRoute?.children?.[0]?.meta?.title).toBe('首页')
    expect(dashboardRoute?.children?.[0]?.meta?.icon).toBe('dashboard')
  })

  it('should reset router correctly', () => {
    expect(() => resetRouter()).not.toThrow()
  })
}) 