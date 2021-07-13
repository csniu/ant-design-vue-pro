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
        path: '/mock/:pageNo([1-9]\\d*)?',
        name: 'SamplMock',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/Mock'),
        meta: { title: '数据模拟', keepAlive: true, icon: 'coffee', permission: [ 'mock' ] }
      },
      // {
      //   path: '/contract/:pageNo([1-9]\\d*)?',
      //   name: 'contract',
      //   hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //   component: () => import('@/views/list/ContractList'),
      //   meta: { title: '合同管理', keepAlive: true, icon: 'read', permission: [ 'contract' ] }
      // },
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
            path: '/report/distributor-report/:pageNo([1-9]\\d*)?',
            name: 'distributorReport',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/DistributorReport'),
            meta: { title: '经销商报告版本管理', keepAlive: true, icon: 'appstore', permission: [ 'distributorReport' ] }
          }
          // {
          //   path: '/report/backup/:pageNo([1-9]\\d*)?',
          //   name: 'backup',
          //   hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
          //   component: () => import('@/views/list/ReportTableList'),
          //   meta: { title: '报告备份', keepAlive: true, icon: 'read', permission: [ 'backup' ] }
          // }
        ]
      },
      {
        path: '/config',
        name: 'config',
        component: PageView,
        meta: { title: '配置中心', icon: 'setting', permission: [ 'config' ] },
        redirect: '/config/report/',
        children: [
          {
            path: '/config/template/:pageNo([1-9]\\d*)?',
            name: 'TemplateConfig',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/TemplateTableList'),
            meta: { title: '模板管理', keepAlive: true, icon: 'bars', permission: [ 'template' ] }
          },
          {
            path: '/config/reportVersion/:pageNo([1-9]\\d*)?',
            name: 'reportVersionConfig',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/ReportVersionTableList'),
            meta: { title: '报告版本管理', keepAlive: true, icon: 'bars', permission: [ 'reportVersion' ] }
          },
          {
            path: '/config/distributor/:pageNo([1-9]\\d*)?',
            name: 'distributor',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/DistributorTableList'),
            meta: { title: '经销商管理', keepAlive: true, icon: 'bars', permission: [ 'distributor' ] }
          },
          {
            path: '/config/panel/:pageNo([1-9]\\d*)?',
            name: 'panleConfig',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/PanelList'),
            meta: { title: 'Panel管理', keepAlive: true, icon: 'bars', permission: [ 'panleConfig' ] }
          },
          {
            path: '/config/genelist/:pageNo([1-9]\\d*)?',
            name: 'genelistConfig',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/GeneListTableListDetail'),
            meta: { title: '基因列表', keepAlive: true, icon: 'bars', permission: [ 'genelist' ] }
          },
          {
            path: '/config/configServer/:pageNo([1-9]\\d*)?',
            name: 'staticConfig',
            hideChildrenInMenu: true,
            component: () => import('@/views/list/ConfigServer'),
            meta: { title: '其他配置', keepAlive: true, icon: 'bars', permission: [ 'configServer' ] }
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
            meta: { title: '用户', keepAlive: true, icon: 'user', permission: [ 'userMange' ] }
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
      },
      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: RouteView,
        meta: { title: '表单', icon: 'form' },
        hidden: true,
        children: [
          {
            path: '/form/advanced-form',
            name: 'Mock',
            component: () => import('@/views/form/mockForm/mockForm'),
            meta: { title: '数据模拟', keepAlive: true, permission: ['mock'] }
          }
        ]
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
