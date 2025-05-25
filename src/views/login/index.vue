<template>
  <div class="login-container">
    <div id="particles-js">
      <!-- <vue-particles
        v-if="refreshParticles"
        color="#dedede"
        :particle-opacity="0.7"
        :particles-number="80"
        shape-type="circle"
        :particle-size="4"
        lines-color="#dedede"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        hover-mode="grab"
        :click-effect="true"
        click-mode="push"
      /> -->
    </div>

    <div class="login-weaper animated bounceInDown">
      <div class="login-left">
        <div class="login-time" v-text="currentTime" />
        <img :src="sysInfo.sys_app_logo" alt="" class="img">
        <p class="title" v-text="sysInfo.sys_app_name" />
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
                <i class="el-icon-user" />
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
              v-model:visible="capsTooltip"
              content="Caps lock is On"
              placement="right"
              :manual="true"
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
                    :icon-class="
                      passwordType === 'password' ? 'eye' : 'eye-open'
                    "
                  />
                </span>
              </el-form-item>
            </el-tooltip>
            <el-form-item prop="code" style="width: 66%; float: left">
              <span class="svg-container">
                <svg-icon icon-class="validCode" />
              </span>
              <el-input
                ref="codeRef"
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
              @click.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog v-model="showDialog" title="Or connect with" :close-on-click-modal="false">
      Can not be simulated on local, so please combine you own business
      simulation! ! !
      <br>
      <br>
      <br>
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
        <div class="open-content-info">
          <div class="tip-hover-panel" style="top: -18px; right: -12px">
            <div class="rest_info_tip">
              <div class="tip-wrapper">
                <div class="lh tip-item" style="display: none">
                  <a
                    class="text-color"
                    href="https://beian.miit.gov.cn"
                    target="_blank"
                  >
                    沪ICP备XXXXXXXXX号-1
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCodeImg } from '@/api/login'
import dayjs from 'dayjs'
import SocialSign from './components/SocialSignin.vue'
import { useUserStore, useSystemStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const systemStore = useSystemStore()

// Refs
const loginFormRef = ref()
const usernameRef = ref()
const passwordRef = ref()
const codeRef = ref()

// Reactive data
const codeUrl = ref('')
const cookiePassword = ref('')
const refreshParticles = ref(true)
const passwordType = ref('password')
const capsTooltip = ref(false)
const loading = ref(false)
const showDialog = ref(false)
const currentTime = ref('')
const timer = ref<NodeJS.Timeout>()

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

// Computed
const redirect = ref<string>()
const otherQuery = ref({})
const sysInfo = computed(() => {
  const info = systemStore.info
  if (typeof info === 'object' && info !== null) {
    return info as { sys_app_logo?: string; sys_app_name?: string }
  }
  return { sys_app_logo: '', sys_app_name: 'Go Admin' }
})

// Helper function - defined before watch
const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

// Watch route changes
watch(() => route.query, (query) => {
  if (query) {
    redirect.value = query.redirect as string
    otherQuery.value = getOtherQuery(query)
  }
}, { immediate: true })

// Methods
const getSystemSetting = async () => {
  try {
    const ret = await systemStore.settingDetail()
    if (ret && ret.sys_app_name) {
      document.title = ret.sys_app_name
    }
  } catch (error) {
    console.error('Failed to get system settings:', error)
  }
}

const getCurrentTime = () => {
  timer.value = setInterval(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH时mm分ss秒')
  }, 1000)
}

const getCode = async () => {
  try {
    const res = await getCodeImg()
    console.log('Captcha API response:', res)
    if (res !== undefined) {
      codeUrl.value = res.data || ''
      loginForm.uuid = res.id || ''
      console.log('Set UUID:', loginForm.uuid)
    }
  } catch (error) {
    console.error('Failed to get verification code:', error)
  }
}

const checkCapslock = ({ shiftKey, key }: KeyboardEvent) => {
  if (key && key.length === 1) {
    if (
      (shiftKey && key >= 'a' && key <= 'z') ||
      (!shiftKey && key >= 'A' && key <= 'Z')
    ) {
      capsTooltip.value = true
    } else {
      capsTooltip.value = false
    }
  }
  if (key === 'CapsLock' && capsTooltip.value === true) {
    capsTooltip.value = false
  }
}

const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
  nextTick(() => {
    passwordRef.value?.focus()
  })
}

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        await router.push({ path: redirect.value || '/', query: otherQuery.value })
      } catch (error) {
        loading.value = false
        getCode()
      }
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// Lifecycle
onMounted(() => {
  getCode()
  getCurrentTime()
  getSystemSetting()
  
  if (loginForm.username === '') {
    usernameRef.value?.focus()
  } else if (loginForm.password === '') {
    passwordRef.value?.focus()
  }
  
  window.addEventListener('resize', () => {
    refreshParticles.value = false
    nextTick(() => (refreshParticles.value = true))
  })
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  window.removeEventListener('resize', () => {})
})
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

#bottom_layer {
  visibility: hidden;
  width: 3000px;
  position: fixed;
  z-index: 302;
  bottom: 0;
  left: 0;
  height: 39px;
  padding-top: 1px;
  zoom: 1;
  margin: 0;
  line-height: 39px;
  // background: #0e6cff;
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
#bottom_layer .s-bottom-layer-content .auto-transform-line {
  display: inline;
}
#bottom_layer .s-bottom-layer-content .auto-transform-line:first-child {
  margin-right: 14px;
}
.s-bottom-space {
  position: static;
  width: 100%;
  height: 40px;
  margin: 23px auto 12px;
}
#bottom_layer .open-content-info a:hover {
  color: #fff;
}
#bottom_layer .open-content-info .text-color {
  color: #626675;
}
.open-content-info {
  position: relative;
  display: inline-block;
  width: 20px;
}
.open-content-info > span {
  cursor: pointer;
  font-size: 14px;
}
.open-content-info > span:hover {
  color: #fff;
}
.open-content-info .tip-hover-panel {
  position: absolute;
  display: none;
  padding-bottom: 18px;
}
.open-content-info .tip-hover-panel .rest_info_tip {
  max-width: 560px;
  padding: 8px 12px 8px 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  text-align: left;
}
.open-content-info .tip-hover-panel .rest_info_tip .tip-wrapper {
  white-space: nowrap;
  line-height: 20px;
}
.open-content-info .tip-hover-panel .rest_info_tip .tip-wrapper .tip-item {
  height: 20px;
  line-height: 20px;
}
.open-content-info
  .tip-hover-panel
  .rest_info_tip
  .tip-wrapper
  .tip-item:last-child {
  margin-right: 0;
}
@media screen and (max-width: 515px) {
  .open-content-info {
    width: 16px;
  }
  .open-content-info .tip-hover-panel {
    right: -16px !important;
  }
}
.footer {
  background-color: #0e6cff;
  margin-bottom: -20px;
}

.login-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
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
  -webkit-box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.login-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: rgba(64, 158, 255, 0);
  color: #fff;
  float: left;
  width: 50%;
  position: relative;
  min-height: 500px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
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
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
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

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
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
$bg: #2d3a4b;
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
