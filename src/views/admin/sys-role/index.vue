<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="名称" prop="roleName">
            <el-input
              v-model="queryParams.roleName"
              placeholder="请输入角色名称"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="权限字符" prop="roleKey">
            <el-input
              v-model="queryParams.roleKey"
              placeholder="请输入权限字符"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="角色状态"
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
          <!-- <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" :icon="Search" size="small" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysRole:add']"
              type="primary"
              :icon="Plus"
              size="small"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysRole:update']"
              type="success"
              :icon="Edit"
              size="small"
              :disabled="single"
              @click="handleUpdate"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysRole:remove']"
              type="danger"
              :icon="Delete"
              size="small"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysRole:export']"
              type="warning"
              :icon="Download"
              size="small"
              @click="handleExport"
            >导出</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="roleList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="编码" sortable="custom" prop="roleId" width="80" />
          <el-table-column label="名称" sortable="custom" prop="roleName" :show-overflow-tooltip="true" />
          <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="排序" sortable="custom" prop="roleSort" width="80" />
          <el-table-column label="状态" sortable="custom" width="80">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="2"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" sortable="custom" prop="createdAt" width="160">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
            class-name="small-padding fixed-width"
            width="220"
          >
            <template #default="scope">
              <el-button
                v-permisaction="['admin:sysRole:update']"
                size="small"
                type="text"
                :icon="Edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-permisaction="['admin:sysRole:update']"
                size="small"
                type="text"
                icon="el-icon-circle-check"
                @click="handleDataScope(scope.row)"
              >数据权限</el-button>
              <el-button
                v-if="scope.row.roleKey!=='admin'"
                v-permisaction="['admin:sysRole:remove']"
                size="small"
                type="text"
                :icon="Delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
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

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog v-if="open" :title="title" v-model="open" width="500px" :close-on-click-modal="false">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" :disabled="isEdit" />
            </el-form-item>
            <el-form-item label="权限字符" prop="roleKey">
              <el-input v-model="form.roleKey" placeholder="请输入权限字符" :disabled="isEdit" />
            </el-form-item>
            <el-form-item label="角色顺序" prop="roleSort">
              <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单权限">
              <el-tree
                ref="menuTreeRef"
                :data="menuOptions"
                show-checkbox
                node-key="id"
                :empty-text="menuOptionsAlert"
                style="height:171px;overflow-y:auto;overflow-x:hidden;"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 分配角色数据权限对话框 -->
        <el-dialog v-if="openDataScope" :title="title" v-model="openDataScope" width="500px" :close-on-click-modal="false">
          <el-form :model="form" label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="form.roleName" :disabled="true" />
            </el-form-item>
            <el-form-item label="权限字符">
              <el-input v-model="form.roleKey" :disabled="true" />
            </el-form-item>
            <el-form-item label="权限范围">
              <el-select v-model="form.dataScope">
                <el-option
                  v-for="item in dataScopeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-show="form.dataScope == 2" label="数据权限">
              <el-tree
                ref="deptRef"
                :data="deptOptions"
                show-checkbox
                default-expand-all
                node-key="id"
                empty-text="加载中，请稍后"
                :props="defaultProps"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitDataScope">确 定</el-button>
            <el-button @click="cancelDataScope">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete, Download } from '@element-plus/icons-vue'

import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus, exportRole } from '@/api/admin/sys-role'
import { roleMenuTreeselect } from '@/api/admin/sys-menu'
import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/api/admin/sys-dept'
import { formatJson } from '@/utils'
import { addDateRange, parseTime, download } from '@/utils/ruoyi'
import { getDicts } from '@/utils/dict'

// 组件引用
const queryFormRef = ref()
const formRef = ref()
const menuTreeRef = ref()
const deptRef = ref()

// 响应式数据
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const roleList = ref([])
const menuIdsChecked = ref([])
const title = ref('')
const open = ref(false)
const openDataScope = ref(false)
const isEdit = ref(false)
const dateRange = ref([])
const statusOptions = ref([])
const menuOptions = ref([])
const menuList = ref([])
const deptOptions = ref([])
const menuOptionsAlert = ref('加载中，请稍后')

// 数据范围选项
const dataScopeOptions = [
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' }
]

// 查询参数
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  roleName: undefined,
  roleKey: undefined,
  status: undefined
})

// 表单参数
const form = reactive({
  roleId: undefined,
  roleName: undefined,
  roleKey: undefined,
  roleSort: 0,
  status: '2',
  menuIds: [],
  deptIds: [],
  remark: undefined,
  dataScope: undefined,
  sysMenu: []
})

// 默认属性
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 表单校验规则
const rules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
}

// 查询角色列表
const getList = () => {
  loading.value = true
  listRole(addDateRange(queryParams, dateRange.value)).then(response => {
    roleList.value = response.data.list
    total.value = response.data.count
    loading.value = false
  })
}

// 查询菜单树结构
const getMenuTreeselect = () => {
  roleMenuTreeselect(0).then(response => {
    menuOptions.value = response.data.menus
    menuList.value = menuOptions.value
  })
}

// 查询部门树结构
const getDeptTreeselect = () => {
  deptTreeselect().then(response => {
    deptOptions.value = response.data.list
  })
}

// 所有菜单节点数据
const getMenuAllCheckedKeys = () => {
  const checkedKeys = menuTreeRef.value?.getHalfCheckedKeys() || []
  const halfCheckedKeys = menuTreeRef.value?.getCheckedKeys() || []
  return halfCheckedKeys
}

// 所有部门节点数据
const getDeptAllCheckedKeys = () => {
  return deptRef.value?.getCheckedKeys() || []
}

// 根据角色ID查询菜单树结构
const getRoleMenuTreeselect = (row, checkedKeys) => {
  if (row.roleKey === 'admin') {
    menuOptionsAlert.value = '系统超级管理员无需此操作'
    menuOptions.value = []
  } else {
    nextTick(() => {
      menuTreeRef.value?.setCheckedKeys(checkedKeys)
    })
  }
}

// 根据角色ID查询部门树结构
const getRoleDeptTreeselect = (roleId) => {
  roleDeptTreeselect(roleId).then(response => {
    deptOptions.value = response.data.depts
    nextTick(() => {
      deptRef.value?.setCheckedKeys(response.data.checkedKeys)
    })
  })
}

// 角色状态修改
const handleStatusChange = (row) => {
  const text = row.status === '2' ? '启用' : '停用'
  ElMessageBox.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return changeRoleStatus(row.roleId, row.status)
  }).then((res) => {
    ElMessage.success(res.msg)
  }).catch(() => {
    row.status = row.status === '2' ? '1' : '2'
  })
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 取消按钮（数据权限）
const cancelDataScope = () => {
  openDataScope.value = false
  reset()
}

// 表单重置
const reset = () => {
  menuOptions.value = menuList.value
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([])
  }
  Object.assign(form, {
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    status: '2',
    menuIds: [],
    deptIds: [],
    remark: undefined,
    dataScope: undefined,
    sysMenu: []
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
  ids.value = selection.map(item => item.roleId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增按钮操作
const handleAdd = () => {
  reset()
  getMenuTreeselect()
  open.value = true
  title.value = '添加角色'
  isEdit.value = false
}

// 修改按钮操作
const handleUpdate = (row) => {
  reset()
  const roleId = row.roleId || ids.value
  getRole(roleId).then(response => {
    Object.assign(form, response.data)
    open.value = true
    title.value = '修改角色'
    isEdit.value = true
    nextTick(() => {
      const checkedKeys = response.data.menuIds
      getRoleMenuTreeselect(response.data, checkedKeys)
    })
  })
}

// 选择角色权限范围触发
const dataScopeSelectChange = (value) => {
  if (value !== '2') {
    deptRef.value?.setCheckedKeys([])
  }
}

// 提交按钮
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.roleId !== undefined) {
        form.menuIds = getMenuAllCheckedKeys()
        updateRole(form).then(() => {
          ElMessage.success('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.menuIds = getMenuAllCheckedKeys()
        addRole(form).then(() => {
          ElMessage.success('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

// 提交按钮（数据权限）
const submitDataScope = () => {
  if (form.roleId !== undefined) {
    form.deptIds = getDeptAllCheckedKeys()
    dataScope(form).then(() => {
      ElMessage.success('修改成功')
      openDataScope.value = false
      getList()
    })
  }
}

// 删除按钮操作
const handleDelete = (row) => {
  const roleIds = row.roleId || ids.value
  ElMessageBox.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return delRole(roleIds)
  }).then(() => {
    getList()
    ElMessage.success('删除成功')
  })
}

// 导出按钮操作
const handleExport = () => {
  const exportParams = addDateRange(queryParams, dateRange.value)
  ElMessageBox.confirm('是否确认导出所有角色数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return exportRole(exportParams)
  }).then(response => {
    download(response.data)
  })
}

// 分配数据权限操作
const handleDataScope = (row) => {
  reset()
  const roleId = row.roleId || ids.value
  getRole(roleId).then(response => {
    Object.assign(form, response.data)
    openDataScope.value = true
    title.value = '分配数据权限'
    getRoleDeptTreeselect(roleId)
  })
}

// 组件挂载时执行
onMounted(() => {
  getList()
  getMenuTreeselect()
  getDicts('sys_normal_disable').then(response => {
    statusOptions.value = response.data
  })
})
</script>
