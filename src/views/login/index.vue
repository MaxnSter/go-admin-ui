<template>
  <div class="login-container">
    <div id="particles-js">
      <!-- 粒子效果暂时注释掉，可以后续添加 Vue 3 兼容的粒子库 -->
    </div>

    <div class="login-weaper animated bounceInDown">
      <div class="login-left">
        <div class="login-time" v-text="currentTime" />
        <img :src="sysInfo.sys_app_logo || '/logo.png'" alt="" class="img">
        <p class="title" v-text="sysInfo.sys_app_name || 'Go Admin 管理系统'" />
      </div>
      <div class="login-border">
        <div class="login-main">
          <div class="login-title">用户登录</div>
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="usernameRef"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip
              v-model="capsTooltip"
              content="大写锁定已开启"
              placement="right"
              manual
            >
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="passwordRef"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon
                    :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                  />
                </span>
              </el-form-item>
            </el-tooltip>
            
            <el-form-item prop="code" style="width: 66%; float: left">
              <span class="svg-container">
                <svg-icon icon-class="validCode" />
              </span>
              <el-input
                v-model="loginForm.code"
                placeholder="验证码"
                name="code"
                type="text"
                tabindex="3"
                maxlength="5"
                autocomplete="off"
                style="width: 75%"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <div
              class="login-code"
              style="
                cursor: pointer;
                width: 30%;
                height: 48px;
                float: right;
                background-color: #f0f1f5;
              "
            >
              <img
                style="
                  height: 48px;
                  width: 100%;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
                "
                :src="codeUrl"
                @click="getCode"
              >
            </div>

            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; padding: 12px 20px; margin-bottom: 30px"
              @click="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog title="第三方登录" v-model="showDialog" :close-on-click-modal="false">
      <p>第三方登录功能开发中...</p>
      <social-sign />
    </el-dialog>
    
    <div
      id="bottom_layer"
      class="s-bottom-layer s-isindex-wrap"
      style="visibility: visible; width: 100%"
    >
      <div class="s-bottom-layer-content">
        <div class="lh">
          <a class="text-color" href="https://beian.miit.gov.cn" target="_blank">
            沪ICP备XXXXXXXXX号-1
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCodeImg } from '@/api/login'
import { useUserStore } from '@/stores/modules/user'
import { useSystemStore } from '@/stores/modules/system'
import SocialSign from './components/SocialSignin.vue'

// 响应式数据
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const systemStore = useSystemStore()

const loginFormRef = ref()
const usernameRef = ref()
const passwordRef = ref()

const codeUrl = ref('')
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  rememberMe: false,
  code: '',
  uuid: ''
})

const loginRules = {
  username: [
    { required: true, trigger: 'blur', message: '用户名不能为空' }
  ],
  password: [
    { required: true, trigger: 'blur', message: '密码不能为空' }
  ],
  code: [
    { required: true, trigger: 'change', message: '验证码不能为空' }
  ]
}

const passwordType = ref('password')
const capsTooltip = ref(false)
const loading = ref(false)
const showDialog = ref(false)
const redirect = ref<string>()
const otherQuery = ref({})
const currentTime = ref('')
const sysInfo = ref<any>({
  sys_app_logo: '/logo.png',
  sys_app_name: 'Go Admin 管理系统'
})

let timer: NodeJS.Timeout

// 方法
const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

const getSystemSetting = async () => {
  try {
    // 如果有系统设置的 API，可以在这里调用
    // const ret = await systemStore.getSettingDetail()
    // sysInfo.value = ret
    // document.title = ret.sys_app_name
    document.title = 'Go Admin 管理系统'
  } catch (error) {
    console.error('获取系统设置失败:', error)
  }
}

const getCurrentTime = () => {
  timer = setInterval(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    currentTime.value = `${year}-${month}-${day} ${hours}时${minutes}分${seconds}秒`
  }, 1000)
}

const getCode = async () => {
  try {
    const res = await getCodeImg()
    if (res && res.data) {
      codeUrl.value = 'data:image/gif;base64,' + res.data.img
      loginForm.uuid = res.data.uuid
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

const checkCapslock = (event: KeyboardEvent) => {
  const { key } = event
  if (key && key.length === 1) {
    capsTooltip.value = key >= 'A' && key <= 'Z'
  }
  if (key === 'CapsLock' && capsTooltip.value === true) {
    capsTooltip.value = false
  }
}

const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
  nextTick(() => {
    passwordRef.value?.focus()
  })
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      loading.value = true
      await userStore.login(loginForm)
      await router.push({ path: redirect.value || '/', query: otherQuery.value })
      loading.value = false
    }
  } catch (error: any) {
    loading.value = false
    getCode()
    ElMessage.error(error.message || '登录失败')
  }
}

// 监听路由变化
watch(() => route.query, (query) => {
  if (query) {
    redirect.value = query.redirect as string
    otherQuery.value = getOtherQuery(query)
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  getCode()
  getCurrentTime()
  getSystemSetting()
  
  if (loginForm.username === '') {
    usernameRef.value?.focus()
  } else if (loginForm.password === '') {
    passwordRef.value?.focus()
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

#bottom_layer {
  visibility: visible;
  width: 100%;
  position: fixed;
  z-index: 302;
  bottom: 0;
  left: 0;
  height: 39px;
  padding-top: 1px;
  zoom: 1;
  margin: 0;
  line-height: 39px;
}

#bottom_layer .lh {
  display: inline-block;
  margin-right: 14px;
}

#bottom_layer .lh .emphasize {
  text-decoration: underline;
  font-weight: 700;
}

#bottom_layer .lh:last-child {
  margin-left: -2px;
  margin-right: 0;
}

#bottom_layer .lh.activity {
  font-weight: 700;
  text-decoration: underline;
}

#bottom_layer a {
  font-size: 12px;
  text-decoration: none;
}

#bottom_layer .text-color {
  color: #bbb;
}

#bottom_layer .aria-img {
  width: 49px;
  height: 20px;
  margin-bottom: -5px;
}

#bottom_layer a:hover {
  color: #fff;
}

#bottom_layer .s-bottom-layer-content {
  margin: 0 17px;
  text-align: center;
}

.login-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url("../../assets/login.png") no-repeat;
  background-color: #0e6cff;
  position: relative;
  background-size: cover;
  height: 100vh;
  background-position: 50%;
}

#particles-js {
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
}

.login-weaper {
  margin: 0 auto;
  width: 1000px;
  box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.login-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(64, 158, 255, 0);
  color: #fff;
  float: left;
  width: 50%;
  position: relative;
  min-height: 500px;
  align-items: center;
  display: flex;
  
  .login-time {
    position: absolute;
    left: 25px;
    top: 25px;
    width: 100%;
    color: #fff;
    opacity: 0.9;
    font-size: 18px;
    overflow: hidden;
    font-weight: 500;
  }
}

.login-left .img {
  width: 90px;
  height: 90px;
  border-radius: 3px;
}

.login-left .title {
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
  font-size: 16px;
  font-weight: 600;
}

.login-border {
  position: relative;
  min-height: 500px;
  align-items: center;
  display: flex;
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: #fff;
  background-color: hsla(0, 0%, 100%, 0.9);
  width: 50%;
  float: left;
}

.login-main {
  margin: 0 auto;
  width: 65%;
}

.login-title {
  color: #333;
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 22px;
  text-align: center;
  letter-spacing: 4px;
}

/* reset element-plus css */
.login-container {
  :deep(.el-input) {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      caret-color: #333;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    color: #454545;
  }
}

$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
    .login-weaper {
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      box-shadow: none;
    }
    .login-main {
      width: 80%;
    }
    .login-left {
      display: none !important;
    }
    .login-border {
      width: 100%;
    }
  }
}
</style>
