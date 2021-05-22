// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout, PageView } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'
// 可选图标：https://www.antdv.com/components/icon/#Custom-Font-Icon

// eslint-disable-next-line
const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/sample/',
    children: [
      {
        path: '/sample/:pageNo([1-9]\\d*)?',
        name: 'sample',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/SampleTableList'),
        meta: { title: '样本信息', keepAlive: true, icon: 'idcard', permission: [ 'sample' ] }
      },
      {
        path: '/download/:pageNo([1-9]\\d*)?',
        name: 'download',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/TableList'),
        meta: { title: '数据下载', keepAlive: true, icon: 'download', permission: [ 'download' ] }
      },
      {
        path: '/analysis/:pageNo([1-9]\\d*)?',
        name: 'analysis',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/AnalysisTableList'),
        meta: { title: '分析状态', keepAlive: true, icon: 'radar-chart', permission: [ 'analysis' ] }
      },
      {
        path: '/contract/:pageNo([1-9]\\d*)?',
        name: 'contract',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/ContractList'),
        meta: { title: '合同管理', keepAlive: true, icon: 'read', permission: [ 'contract' ] }
      },
      {
        path: '/share/:pageNo([1-9]\\d*)?',
        name: 'share',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/Share'),
        meta: { title: '数据分享', keepAlive: true, icon: 'share-alt', permission: [ 'share' ] }
      },
      // 报告管理
      {
        path: '/report',
        name: 'report',
        component: PageView,
        meta: { title: '报告管理', icon: 'compass', permission: [ 'report' ] },
        redirect: '/report/report/',
        children: [
          {
            path: '/report/report/:pageNo([1-9]\\d*)?',
            name: 'makeReport',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/MakeReportTableList'),
            meta: { title: '生成记录', keepAlive: true, icon: 'read', permission: [ 'report' ] }
          },
          {
            path: '/report/template/:pageNo([1-9]\\d*)?',
            name: 'Template',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/TemplateTableList'),
            meta: { title: '模板管理', keepAlive: true, icon: 'read', permission: [ 'template' ] }
          },
          {
            path: '/report/distributor/:pageNo([1-9]\\d*)?',
            name: 'distributor',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/DistributorTableList'),
            meta: { title: '经销商管理', keepAlive: true, icon: 'read', permission: [ 'distributor' ] }
          },
          {
            path: '/report/reportVersion/:pageNo([1-9]\\d*)?',
            name: 'reportVersion',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/ReportVersionTableList'),
            meta: { title: '报告版本管理', keepAlive: true, icon: 'read', permission: [ 'reportVersion' ] }
          },
          // {
          //   path: '/report/genelist/:pageNo([1-9]\\d*)?',
          //   name: 'genelist',
          //   hideChildrenInMenu: true,
          //   component: () => import('@/views/list/GeneListTableListDetail'),
          //   meta: { title: '基因列表', keepAlive: true, icon: 'bars', permission: [ 'genelist' ] }
          // },
          {
            path: '/report/backup/:pageNo([1-9]\\d*)?',
            name: 'backup',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/ReportTableList'),
            meta: { title: '报告备份', keepAlive: true, icon: 'read', permission: [ 'backup' ] }
          },
          {
            path: '/report/configServer/:pageNo([1-9]\\d*)?',
            name: 'static',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/ConfigServer'),
            meta: { title: '配置中心', keepAlive: true, icon: 'read', permission: [ 'configServer' ] }
          }
        ]
      },
      // 用户管理
      {
        path: '/manage',
        name: 'userMange',
        component: PageView,
        meta: { title: '用户管理', icon: 'user', permission: [ 'userMange' ] },
        redirect: '/manage/user-list',
        children: [
          {
            path: '/manage/user-list',
            name: 'userList',
            component: () => import('@/views/other/UserList'),
            meta: { title: '用户', keepAlive: true, icon: 'user', permission: [ 'userList' ] }
          },
          {
            path: '/manage/role-list',
            name: 'roleList',
            component: () => import('@/views/other/RoleList'),
            meta: { title: '角色', keepAlive: true, icon: 'tags', permission: [ 'roleList' ] }
          },
          {
            path: '/manage/group-list',
            name: 'groupList',
            component: () => import('@/views/other/GroupList'),
            meta: { title: '用户组', keepAlive: true, icon: 'team', permission: [ 'groupList' ] }
          }
        ]
      },
      {
        path: '/password',
        name: 'passwordMange',
        component: PageView,
        hidden: true,
        meta: { title: '用户管理', icon: 'user' },
        redirect: '/password/change-password',
        children: [
          {
            path: 'change-password',
            name: 'changePassword',
            // hidden: true,
            component: () => import('@/views/user/ChangePassword'),
            meta: { title: '修改密码' }
          }
        ]
      },
      {
        path: '/sample-profile/:sampleRecoderId(\\d*)?',
        name: 'sampleProfile',
        hidden: true,
        meta: { title: '样本详情', icon: 'profile' },
        component: () => import('@/views/profile/advanced/sample')
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      // },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
