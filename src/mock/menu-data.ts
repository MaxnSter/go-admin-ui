// 模拟菜单数据，用于测试图标系统
export const mockMenuData = [
  {
    path: '/system',
    component: 'Layout',
    visible: '0',
    menuName: 'System',
    title: '系统管理',
    icon: 'system',
    noCache: false,
    children: [
      {
        path: '/system/user',
        component: '/admin/sys-user/index',
        visible: '0',
        menuName: 'User',
        title: '用户管理',
        icon: 'user',
        noCache: false
      },
      {
        path: '/system/role',
        component: '/admin/sys-role/index',
        visible: '0',
        menuName: 'Role',
        title: '角色管理',
        icon: 'peoples',
        noCache: false
      },
      {
        path: '/system/menu',
        component: '/admin/sys-menu/index',
        visible: '0',
        menuName: 'Menu',
        title: '菜单管理',
        icon: 'tree-table',
        noCache: false
      }
    ]
  },
  {
    path: '/monitor',
    component: 'Layout',
    visible: '0',
    menuName: 'Monitor',
    title: '系统监控',
    icon: 'monitor',
    noCache: false,
    children: [
      {
        path: '/monitor/operlog',
        component: '/admin/sys-oper-log/index',
        visible: '0',
        menuName: 'OperLog',
        title: '操作日志',
        icon: 'form',
        noCache: false
      },
      {
        path: '/monitor/loginlog',
        component: '/admin/sys-login-log/index',
        visible: '0',
        menuName: 'LoginLog',
        title: '登录日志',
        icon: 'logininfor',
        noCache: false
      }
    ]
  },
  {
    path: '/tool',
    component: 'Layout',
    visible: '0',
    menuName: 'Tool',
    title: '系统工具',
    icon: 'tool',
    noCache: false,
    children: [
      {
        path: '/tool/gen',
        component: '/dev-tools/gen/index',
        visible: '0',
        menuName: 'Gen',
        title: '代码生成',
        icon: 'code',
        noCache: false
      }
    ]
  }
] 