<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item label="菜单名称">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入菜单名称"
              clearable
              size="small"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable size="small">
              <el-option
                v-for="dict in visibleOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" size="small" @click="handleQuery">搜索</el-button>
            <el-button
              v-permisaction="['admin:sysMenu:add']"
              type="primary"
              :icon="Plus"
              size="small"
              @click="handleAdd"
            >新增</el-button>
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          :data="menuList"
          border
          row-key="menuId"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="title" label="菜单名称" :show-overflow-tooltip="true" width="180px" />
          <el-table-column prop="icon" label="图标" align="center" width="100px">
            <template #default="scope">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="60px" />
          <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true">
            <template #default="scope">
              <el-popover v-if="scope.row.sysApi.length>0" trigger="hover" placement="top">
                <el-table
                  :data="scope.row.sysApi"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="title"
                    label="title"
                    width="260px"
                  >
                    <template #default="scope">
                      <span v-if="scope.row.type=='SYS' && scope.row.title!=''"><el-tag type="success">{{ '['+scope.row.type +'] '+ scope.row.title }}</el-tag></span>
                      <span v-if="scope.row.type!='SYS' && scope.row.title!=''"><el-tag type="">{{ '['+scope.row.type +'] '+scope.row.title }}</el-tag></span>
                      <span v-if="scope.row.title==''"><el-tag type="danger">暂无</el-tag></span>

                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="path"
                    label="path"
                    width="270px"
                  >
                    <template #default="scope">
                      <el-tag v-if="scope.row.action=='GET'">{{ scope.row.action }}</el-tag>
                      <el-tag v-if="scope.row.action=='POST'" type="success">{{ scope.row.action }}</el-tag>
                      <el-tag v-if="scope.row.action=='PUT'" type="warning">{{ scope.row.action }}</el-tag>
                      <el-tag v-if="scope.row.action=='DELETE'" type="danger">{{ scope.row.action }}</el-tag>
                      {{ scope.row.path }}
                    </template>
                  </el-table-column>

                </el-table>
                <div slot="reference" class="name-wrapper">
                  <span v-if="scope.row.permission==''">-</span>
                  <span v-else>{{ scope.row.permission }}</span>
                </div>
              </el-popover>
              <span v-else>
                <span v-if="scope.row.permission==''">-</span>
                <span v-else>{{ scope.row.permission }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="组件路径" :show-overflow-tooltip="true">
            <template #default="scope">
              <span v-if="scope.row.menuType=='A'">{{ scope.row.path }}</span>
              <span v-else>{{ scope.row.component }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="visible" label="可见" :formatter="visibleFormat" width="80">
            <template #default="scope">
              <el-tag
                :type="scope.row.visible === '1' ? 'danger' : 'success'"
                disable-transitions
              >{{ visibleFormat(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
            <template #default="scope">
              <el-button
                v-permisaction="['admin:sysMenu:edit']"
                size="small"
                type="text"
                :icon="Edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-permisaction="['admin:sysMenu:add']"
                size="small"
                type="text"
                :icon="Plus"
                @click="handleAdd(scope.row)"
              >新增</el-button>
              <el-button
                v-permisaction="['admin:sysMenu:remove']"
                size="small"
                type="text"
                :icon="Delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加或修改菜单对话框 -->
        <el-drawer
          ref="drawer"
          :title="title"
          :before-close="cancel"
          v-model="open"
          direction="rtl"
          custom-class="demo-drawer"
          size="830px"
        >
          <div class="demo-drawer__content">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="106px">
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="parentId">
                    <span slot="label">
                      上级菜单
                      <el-tooltip content="指当前菜单停靠的菜单归属" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <treeselect
                      v-model="form.parentId"
                      :options="menuOptions"
                      :normalizer="normalizer"
                      :show-count="true"
                      placeholder="选择上级菜单"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="title">
                    <span slot="label">
                      菜单标题
                      <el-tooltip content="菜单位置显示的说明信息" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-input v-model="form.title" placeholder="请输入菜单标题" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="sort">
                    <span slot="label">
                      显示排序
                      <el-tooltip content="根据序号升序排列" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-input-number v-model="form.sort" controls-position="right" :min="0" />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item prop="menuType">
                    <span slot="label">
                      菜单类型
                      <el-tooltip content="包含目录：以及菜单或者菜单组，菜单：具体对应某一个页面，按钮：功能才做按钮；" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-radio-group v-model="form.menuType">
                      <el-radio label="M">目录</el-radio>
                      <el-radio label="C">菜单</el-radio>
                      <el-radio label="F">按钮</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="菜单图标">
                    <el-popover
                      placement="bottom-start"
                      width="460"
                      trigger="click"
                      @show="$refs['iconSelect'].reset()"
                    >
                      <IconSelect ref="iconSelect" @selected="selected" />
                      <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                        <svg-icon
                          v-if="form.icon"
                          slot="prefix"
                          :icon-class="form.icon"
                          class="el-input__icon"
                          style="height: 32px;width: 16px;"
                        />
                        <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                      </el-input>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item v-if="form.menuType == 'M' || form.menuType == 'C'" prop="menuName">
                    <span slot="label">
                      路由名称
                      <el-tooltip content="需要和页面name保持一致，对应页面即可选择缓存" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-input v-model="form.menuName" placeholder="请输入路由名称" />
                  </el-form-item>
                </el-col>

                <el-col v-if="form.menuType == 'M' || form.menuType == 'C'" :span="12">
                  <el-form-item prop="component">
                    <span slot="label">
                      组件路径
                      <el-tooltip content="菜单对应的具体vue页面文件路径views的下级路径/admin/sys-api/index；目录类型：填写Layout，如何有二级目录请参照日志目录填写；" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-input v-model="form.component" placeholder="请输入组件路径" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item v-if="form.menuType == 'M' || form.menuType == 'C'">
                    <span slot="label">
                      是否外链
                      <el-tooltip content="可以通过iframe打开指定地址" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-radio-group v-model="form.isFrame">
                      <el-radio label="0">是</el-radio>
                      <el-radio label="1">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item v-if="form.menuType != 'F'">
                    <span slot="label">
                      路由地址
                      <el-tooltip content="访问此页面自定义的url地址，建议/开头书写，例如 /app-name/menu-name" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-input v-model="form.path" placeholder="请输入路由地址" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item v-if="form.menuType == 'F' || form.menuType == 'C'">
                    <span slot="label">
                      权限标识
                      <el-tooltip content="前端权限控制按钮是否显示" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-input v-model="form.permission" placeholder="请权限标识" maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item v-if="form.menuType != 'F'">
                    <span slot="label">
                      菜单状态
                      <el-tooltip content="需要显示在菜单列表的菜单设置为显示，否则设置为隐藏" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-radio-group v-model="form.visible">
                      <el-radio
                        v-for="dict in visibleOptions"
                        :key="dict.value"
                        :label="dict.value"
                      >{{ dict.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item v-if="form.menuType == 'F' || form.menuType == 'C'">
                    <span slot="label">
                      api权限
                      <el-tooltip content="配置在这个才做上需要使用到的接口，否则在设置用户角色时，接口将无权访问。" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                    <el-transfer
                      v-model="form.apis"
                      style="text-align: left; display: inline-block"
                      filterable
                      :props="{
                        key: 'id',
                        label: 'title'
                      }"
                      :titles="['未授权', '已授权']"
                      :button-texts="['收回', '授权 ']"
                      :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                      class="panel"
                      :data="sysapiList"
                      @change="handleChange"
                    >
                      <span slot-scope="{ option }">{{ option.title }}</span>
                    </el-transfer>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </div>

        </el-drawer>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete, QuestionFilled } from '@element-plus/icons-vue'

import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/admin/sys-menu'
import { listSysApi } from '@/api/admin/sys-api'
import { getDicts, selectDictLabel } from '@/utils/dict'

import Treeselect from '@zanmato/vue3-treeselect'
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css'
import IconSelect from '@/components/IconSelect'

// 组件引用
const queryFormRef = ref()
const formRef = ref()

// 响应式数据
const loading = ref(true)
const menuList = ref([])
const sysapiList = ref([])
const menuOptions = ref([])
const title = ref('')
const open = ref(false)
const visibleOptions = ref([])

// 查询参数
const queryParams = reactive({
  title: undefined,
  visible: undefined
})

// 表单参数
const form = reactive({
  menuId: undefined,
  parentId: 0,
  menuName: undefined,
  icon: undefined,
  menuType: 'M',
  apis: [],
  sort: 0,
  action: '',
  isFrame: '1',
  visible: '0',
  sysApi: []
})

// 表单校验规则
const rules = {
  title: [{ required: true, message: '菜单标题不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }]
}

// 处理穿梭框变化
const handleChange = (value, direction, movedKeys) => {
  console.log(value, direction, movedKeys)
  const list = form.sysApi
  form.apis = value
  if (direction === 'right') {
    for (let x = 0; x < movedKeys.length; x++) {
      for (let index = 0; index < sysapiList.value.length; index++) {
        const element = sysapiList.value[index]
        if (element.id === movedKeys[x]) {
          list.push(element)
          break
        }
      }
    }
    form.sysApi = list
  } else if (direction === 'left') {
    const l = []
    for (let index = 0; index < movedKeys.length; index++) {
      const element = movedKeys[index]
      for (let x = 0; x < list.length; x++) {
        const e = list[x]
        if (element !== e.id) {
          l.push()
          break
        }
      }
    }
    form.sysApi = l
  }
  console.log(form.sysApi)
}

// 获取API列表
const getApiList = () => {
  loading.value = true
  listSysApi({ 'pageSize': 10000, 'type': 'BUS' }).then(response => {
    sysapiList.value = response.data.list
    loading.value = false
  })
}

// 处理抽屉关闭
const handleClose = (done) => {
  // 可以在这里添加关闭前的逻辑
}

// 选择图标
const selected = (name) => {
  form.icon = name
}

// 查询菜单列表
const getList = () => {
  loading.value = true
  listMenu(queryParams).then(response => {
    menuList.value = response.data
    loading.value = false
  })
}

// 转换菜单数据结构
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children
  }
  return {
    id: node.menuId,
    label: node.title,
    children: node.children
  }
}

// 查询菜单下拉树结构
const getTreeselect = () => {
  listMenu().then(response => {
    menuOptions.value = []
    const menu = { menuId: 0, title: '主类目', children: [] }
    menu.children = response.data
    menuOptions.value.push(menu)
  })
}

// 菜单显示状态字典翻译
const visibleFormat = (row) => {
  if (row.menuType === 'F') {
    return '-- --'
  }
  return selectDictLabel(visibleOptions.value, row.visible)
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 表单重置
const reset = () => {
  Object.assign(form, {
    menuId: undefined,
    parentId: 0,
    menuName: undefined,
    icon: undefined,
    menuType: 'M',
    apis: [],
    sort: 0,
    action: form.menuType === 'A' ? form.action : '',
    isFrame: '1',
    visible: '0',
    sysApi: []
  })
  formRef.value?.resetFields()
}

// 搜索按钮操作
const handleQuery = () => {
  getList()
}

// 新增按钮操作
const handleAdd = (row) => {
  reset()
  getTreeselect()
  if (row != null) {
    form.parentId = row.menuId
  }
  open.value = true
  title.value = '添加菜单'
}

// 修改按钮操作
const handleUpdate = (row) => {
  reset()
  getTreeselect()
  getMenu(row.menuId).then(response => {
    Object.assign(form, response.data)
    open.value = true
    title.value = '修改菜单'
  })
}

// 提交按钮
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.menuId !== undefined) {
        updateMenu(form).then(() => {
          ElMessage.success('修改成功')
          open.value = false
          getList()
        })
      } else {
        addMenu(form).then(() => {
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
  ElMessageBox.confirm('是否确认删除名称为"' + row.title + '"的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return delMenu(row.menuId)
  }).then(() => {
    getList()
    ElMessage.success('删除成功')
  })
}

// 组件挂载时执行
onMounted(() => {
  getList()
  getApiList()
  getDicts('sys_show_hide').then(response => {
    visibleOptions.value = response.data
  })
})
</script>
<style lang="css">
.panel .el-transfer__buttons{
  width: 150px;
}
.panel .el-transfer__buttons .el-button + .el-button{
  margin-left:0;
}
.panel .el-transfer-panel{
  width: 300px;
}

.el-col {
padding: 0 5px;
}
.el-drawer__header{
margin-bottom: 0;
}
</style>
