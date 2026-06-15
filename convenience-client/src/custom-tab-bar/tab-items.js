/**
 * TabBar 图标与路由配置（微信 custom-tab-bar 与 Vue 端共用）
 * 图标位于 /static/tab/*.png（微信 tabBar 仅支持 png/jpg）
 */
module.exports = {
  TAB_BAR_TAB_ITEMS: [
    {
      pagePath: '/pages/home/index',
      text: '首页',
      iconPath: '/static/tab/home.png',
      selectedIconPath: '/static/tab/home-active.png',
    },
    {
      pagePath: '/pages/category/index',
      text: '分类',
      iconPath: '/static/tab/category.png',
      selectedIconPath: '/static/tab/category-active.png',
    },
    {
      pagePath: '/pages/publish/index',
      text: '发布',
      isPublish: true,
    },
    {
      pagePath: '/pages/ai/index',
      text: 'AI',
      iconPath: '/static/tab/ai.png',
      selectedIconPath: '/static/tab/ai-active.png',
    },
    {
      pagePath: '/pages/mine/index',
      text: '我的',
      iconPath: '/static/tab/mine.png',
      selectedIconPath: '/static/tab/mine-active.png',
    },
  ],
};
