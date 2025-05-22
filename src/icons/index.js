import SvgIcon from '@/components/SvgIcon'// svg component

export default {
  install(app) {
    app.component('svg-icon', SvgIcon)

    const req = require.context('./svg', false, /\.svg$/)
    req.keys().forEach(req)
  }
}
