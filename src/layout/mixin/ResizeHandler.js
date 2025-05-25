import { useAppStore } from '@/stores/modules/app'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  setup() {
    const appStore = useAppStore()
    return { appStore }
  },
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        this.appStore.closeSideBar(false)
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      this.appStore.toggleDevice('mobile')
      this.appStore.closeSideBar(true)
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        this.appStore.toggleDevice(isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          this.appStore.closeSideBar(true)
        }
      }
    }
  }
}
