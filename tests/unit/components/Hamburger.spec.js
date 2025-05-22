import { shallowMount } from '@vue/test-utils'
import Hamburger from '@/components/Hamburger/index.vue'
describe('Hamburger.vue', () => {
  it('toggle click', () => {
    const wrapper = shallowMount(Hamburger)
    const mockFn = jest.fn()
    wrapper.vm.$on('toggleClick', mockFn)
    wrapper.find('.hamburger').trigger('click')
    expect(mockFn).toBeCalled()
  })
  // setProps() is async, otherwise DOM updates may not complete before checks
  it('prop isActive', async() => {
    const wrapper = shallowMount(Hamburger)
    await wrapper.setProps({ isActive: true })
    expect(wrapper.contains('.is-active')).toBe(true)
    await wrapper.setProps({ isActive: false })
    expect(wrapper.contains('.is-active')).toBe(false)
  })
})
