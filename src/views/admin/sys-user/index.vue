<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-row :gutter="20">
          <!--部门数据-->
          <el-col :span="4" :xs="24">
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="请输入部门名称"
                clearable
                size="small"
                prefix-:icon="Search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                ref="treeRef"
                :data="deptOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </el-col>
          <!--用户数据-->
          <el-col :span="20" :xs="24">
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
              <el-form-item label="用户名称" prop="username">
                <el-input
                  v-model="queryParams.username"
                  placeholder="请输入用户名称"
                  clearable
                  size="small"
                  style="width: 160px"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="queryParams.phone"
                  placeholder="请输入手机号码"
                  clearable
                  size="small"
                  style="width: 160px"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  placeholder="用户状态"
                  clearable
                  size="small"
                  style="width: 160px"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" size="small" @click="handleQuery">搜索</el-button>
                <el-button :icon="Refresh" size="small" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['admin:sysUser:add']"
                  type="primary"
                  :icon="Plus"
                  size="small"
                  @click="handleAdd"
                >新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['admin:sysUser:edit']"
                  type="success"
                  :icon="Edit"
                  size="small"
                  :disabled="single"
                  @click="handleUpdate"
                >修改</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['admin:sysUser:remove']"
                  type="danger"
                  :icon="Delete"
                  size="small"
                  :disabled="multiple"
                  @click="handleDelete"
                >删除</el-button>
              </el-col>
            </el-row>

            <el-table
              v-loading="loading"
              :data="userList"
              border
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChang"
            >
              <el-table-column type="selection" width="45" align="center" />
              <el-table-column label="编号" width="75" prop="userId" sortable="custom" />
              <el-table-column label="登录名" width="105" prop="username" sortable="custom" :show-overflow-tooltip="true" />
              <el-table-column label="昵称" prop="nickName" :show-overflow-tooltip="true" />
              <el-table-column label="部门" prop="dept.deptName" :show-overflow-tooltip="true" />
              <el-table-column label="手机号" prop="phone" width="108" />
              <el-table-column label="状态" width="80" sortable="custom">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-value="2"
                    inactive-value="1"
                    @change="handleStatusChange(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                prop="createdAt"
                sortable="custom"
                width="155"
              >
                <template #default="scope">
                  <span>{{ parseTime(scope.row.createdAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="160"
                fix="right"
                class-name="small-padding fixed-width"
              >
                <template #default="scope">
                  <el-button
                    v-permisaction="['admin:sysUser:edit']"
                    size="small"
                    type="text"
                    :icon="Edit"
                    @click="handleUpdate(scope.row)"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.userId !== 1"
                    v-permisaction="['admin:sysUser:remove']"
                    size="small"
                    type="text"
                    :icon="Delete"
                    @click="handleDelete(scope.row)"
                  >删除</el-button>
                  <el-button
                    v-permisaction="['admin:sysUser:resetPassword']"
                    size="small"
                    type="text"
                    :icon="Key"
                    @click="handleResetPwd(scope.row)"
                  >重置</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total>0"
              :total="total"
              v-model:page="queryParams.pageIndex"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
            />
          </el-col>
        </el-row>
      </el-card>
      
      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" :close-on-click-modal="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属部门" prop="deptId">
                <treeselect
                  v-model="form.deptId"
                  :options="deptOptions"
                  placeholder="请选择归属部门"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item v-if="form.userId == undefined" label="用户名称" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户性别">
                <el-select v-model="form.sex" placeholder="请选择">
                  <el-option
                    v-for="dict in sexOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="岗位">
                <el-select v-model="form.postIds" multiple placeholder="请选择">
                  <el-option
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                    :disabled="item.status == 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-select v-model="form.roleIds" multiple placeholder="请选择">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.status == 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px">
        <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
            </div>
            <div class="el-upload__tip">
              仅允许导入"xls"或"xlsx"格式文件！
            </div>
          </template>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete, Key, UploadFilled } from '@element-plus/icons-vue'

import { listUser, getUser, delUser, addUser, updateUser, exportUser, resetUserPwd, changeUserStatus, importTemplate } from '@/api/admin/sys-user'
import { getToken } from '@/utils/auth'
import { listPost } from '@/api/admin/sys-post'
import { listRole } from '@/api/admin/sys-role'
import { treeselect } from '@/api/admin/sys-dept'
import { addDateRange, parseTime, download } from '@/utils/ruoyi'
import { getDicts, getConfigKey } from '@/utils/dict'

import Treeselect from '@zanmato/vue3-treeselect'
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css'

// 组件引用
const treeRef = ref()
const queryFormRef = ref()
const formRef = ref()
const uploadRef = ref()

// 响应式数据
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const userList = ref(null)
const title = ref('')
const deptOptions = ref(undefined)
const open = ref(false)
const deptName = ref(undefined)
const initPassword = ref(undefined)
const dateRange = ref([])
const statusOptions = ref([])
const sexOptions = ref([])
const postOptions = ref([])
const roleOptions = ref([])
const order = ref('')

// 表单数据
const form = reactive({
  userId: undefined,
  deptId: undefined,
  username: undefined,
  nickName: undefined,
  password: undefined,
  phone: undefined,
  email: undefined,
  sex: undefined,
  status: '2',
  remark: undefined,
  postIds: [],
  roleIds: []
})

// 默认属性
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 用户导入参数
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  updateSupport: 0,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData'
})

// 查询参数
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  username: undefined,
  phone: undefined,
  status: undefined,
  deptId: undefined
})

// 表单校验规则
const rules = {
  username: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  deptId: [{ required: true, message: '归属部门不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    { type: 'email', message: "'请输入正确的邮箱地址", trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 监听部门名称变化
watch(deptName, (val) => {
  treeRef.value?.filter(val)
})

// 查询用户列表
const getList = () => {
  loading.value = true
  listUser(addDateRange(queryParams, dateRange.value)).then(response => {
    userList.value = response.data.list
    total.value = response.data.count
    loading.value = false
  })
}

// 查询部门下拉树结构
const getTreeselect = () => {
  treeselect().then(response => {
    deptOptions.value = response.data
  })
}

// 筛选节点
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

// 节点单击事件
const handleNodeClick = (data) => {
  queryParams.deptId = '/' + data.id + '/'
  getList()
}

// 转换菜单数据结构
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children
  }
  return {
    id: node.id,
    label: node.label,
    children: node.children
  }
}

// 排序回调函数
const handleSortChang = (column) => {
  const prop = column.prop
  const orderValue = column.order
  if (order.value !== '' && order.value !== prop + 'Order') {
    queryParams[order.value] = undefined
  }
  if (orderValue === 'descending') {
    queryParams[prop + 'Order'] = 'desc'
    order.value = prop + 'Order'
  } else if (orderValue === 'ascending') {
    queryParams[prop + 'Order'] = 'asc'
    order.value = prop + 'Order'
  } else {
    queryParams[prop + 'Order'] = undefined
  }
  getList()
}

// 用户状态修改
const handleStatusChange = (row) => {
  const text = row.status === '2' ? '启用' : '停用'
  ElMessageBox.confirm('确认要"' + text + '""' + row.username + '"用户吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return changeUserStatus(row)
  }).then(() => {
    ElMessage.success(text + '成功')
  }).catch(() => {
    row.status = row.status === '2' ? '1' : '2'
  })
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 表单重置
const reset = () => {
  Object.assign(form, {
    userId: undefined,
    deptId: undefined,
    username: undefined,
    nickName: undefined,
    password: undefined,
    phone: undefined,
    email: undefined,
    sex: undefined,
    status: '2',
    remark: undefined,
    postIds: [],
    roleIds: []
  })
  formRef.value?.resetFields()
}

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageIndex = 1
  getList()
}

// 重置按钮操作
const resetQuery = () => {
  dateRange.value = []
  queryFormRef.value?.resetFields()
  handleQuery()
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.userId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增按钮操作
const handleAdd = () => {
  reset()
  getTreeselect()
  listPost().then(response => {
    postOptions.value = response.data
  })
  listRole().then(response => {
    roleOptions.value = response.data
  })
  open.value = true
  title.value = '添加用户'
  form.password = initPassword.value
}

// 修改按钮操作
const handleUpdate = (row) => {
  reset()
  getTreeselect()
  listPost().then(response => {
    postOptions.value = response.data
  })
  listRole().then(response => {
    roleOptions.value = response.data
  })
  const userId = row.userId || ids.value
  getUser(userId).then(response => {
    Object.assign(form, response.data)
    form.postIds = response.data.posts.map(item => item.postId)
    form.roleIds = response.data.roles.map(item => item.roleId)
    open.value = true
    title.value = '修改用户'
    form.password = ''
  })
}

// 提交按钮
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.userId !== undefined) {
        updateUser(form).then(() => {
          ElMessage.success('修改成功')
          open.value = false
          getList()
        })
      } else {
        addUser(form).then(() => {
          ElMessage.success('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

// 删除按钮操作
const handleDelete = (row) => {
  const userIds = row.userId || ids.value
  ElMessageBox.confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return delUser(userIds)
  }).then(() => {
    getList()
    ElMessage.success('删除成功')
  })
}

// 导出按钮操作
const handleExport = () => {
  const exportParams = addDateRange(queryParams, dateRange.value)
  ElMessageBox.confirm('是否确认导出所有用户数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return exportUser(exportParams)
  }).then(response => {
    download(response.data)
  })
}

// 导入按钮操作
const handleImport = () => {
  upload.title = '用户导入'
  upload.open = true
}

// 下载模板操作
const handleImportTemplate = () => {
  importTemplate().then(response => {
    download(response.data)
  })
}

// 文件上传中处理
const handleFileUploadProgress = () => {
  upload.isUploading = true
}

// 文件上传成功处理
const handleFileSuccess = (response) => {
  upload.open = false
  upload.isUploading = false
  uploadRef.value?.clearFiles()
  ElMessage.success(response.msg)
  getList()
}

// 提交上传文件
const submitFileForm = () => {
  uploadRef.value?.submit()
}

// 重置密码
const handleResetPwd = (row) => {
  ElMessageBox.prompt('请输入"' + row.username + '"的新密码', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    resetUserPwd(row.userId, value).then(() => {
      ElMessage.success('修改成功，新密码是：' + value)
    })
  })
}

// 组件挂载时执行
onMounted(() => {
  getList()
  getTreeselect()
  getDicts('sys_normal_disable').then(response => {
    statusOptions.value = response.data
  })
  getDicts('sys_user_sex').then(response => {
    sexOptions.value = response.data
  })
  getConfigKey('sys_user_initPassword').then(response => {
    initPassword.value = response.data.configValue
  })
})
</script>

<style scoped>
.box-card {
  margin: 20px;
}
</style>
