<template>
  <el-color-picker
    v-model="theme"
    :predefine="['#1890FF', '#F5222D', '#FA541C','#FAAD14','#13C2C2', '#52C460', '#2F54EB', '#722ED1', '#00b38a', '#2878FF']"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useSettingsStore } from '@/stores/modules/settings'

// Use a fixed version or get it from import.meta.env
const version = '2.9.11' // element-plus version - update this when upgrading Element Plus
const ORIGINAL_THEME = '#1890FF' // default color

export default {
  setup(props, { emit }) {
    const settingsStore = useSettingsStore()
    
    const chalk = ref('') // content of theme-chalk css
    const theme = ref('')

    const defaultTheme = computed(() => settingsStore.theme)
    // 方法定义
    const updateStyle = (style, oldCluster, newCluster) => {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    }

    const getCSSString = (url, variable) => {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            if (variable === 'chalk') {
              chalk.value = xhr.responseText.replace(/@font-face{[^}]+}/, '')
            }
            resolve()
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
    }

    const getThemeCluster = (themeColor) => {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [themeColor]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(themeColor, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(themeColor, 0.1))
      return clusters
    }

    // 监听器
    watch(defaultTheme, (val) => {
      theme.value = val
    }, { immediate: true })

    watch(theme, async (val) => {
      const oldVal = chalk.value ? theme.value : ORIGINAL_THEME
      if (typeof val !== 'string') return
      const themeCluster = getThemeCluster(val.replace('#', ''))
      const originalCluster = getThemeCluster(oldVal.replace('#', ''))

      // 这里需要使用 ElMessage 而不是 this.$message
      // 暂时注释掉，因为需要正确导入 ElMessage
      // const $message = ElMessage({
      //   message: '编译主题中',
      //   type: 'success',
      //   duration: 0
      // })

      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''))
          const newStyle = updateStyle(variable === 'chalk' ? chalk.value : '', originalCluster, themeCluster)

          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }

      if (!chalk.value) {
        const url = `https://unpkg.com/element-plus@${version}/dist/index.css`
        await getCSSString(url, 'chalk')
      }

      const chalkHandler = getHandler('chalk', 'chalk-style')
      chalkHandler()

      const styles = [].slice.call(document.querySelectorAll('style'))
        .filter(style => {
          const text = style.innerText
          return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
        })
      styles.forEach(style => {
        const { innerText } = style
        if (typeof innerText !== 'string') return
        style.innerText = updateStyle(innerText, originalCluster, themeCluster)
      })
      
      emit('change', val)
      // $message.close()
    })

    return {
      chalk,
      theme,
      defaultTheme,
      updateStyle,
      getCSSString,
      getThemeCluster
    }
  }
}
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
