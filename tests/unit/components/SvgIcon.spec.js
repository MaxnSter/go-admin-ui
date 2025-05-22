import { shallowMount } from '@vue/test-utils'
import SvgIcon from '@/components/SvgIcon/index.vue'
describe('SvgIcon.vue', () => {
  it('iconClass', () => {
    const wrapper = shallowMount(SvgIcon, {
      propsData: {
        iconClass: 'test'
      }
    })
    expect(wrapper.find('use').attributes().href).toBe('#icon-test')
  })
  // setProps() is async, otherwise class updates won't be observed
  it('className', async() => {
    const wrapper = shallowMount(SvgIcon, {
      propsData: {
        iconClass: 'test'
      }
    })
    expect(wrapper.classes().length).toBe(1)
    await wrapper.setProps({ className: 'test' })
    expect(wrapper.classes().includes('test')).toBe(true)
  })
})
