/**
 * 微信小程序自定义 TabBar（原生组件，uni-app 会直接拷贝到输出目录）
 * 与 constants/tabbar.ts TAB_BAR_ITEMS 索引保持一致
 */
Component({
  data: {
    /** 是否展示（AI 沉浸式等场景隐藏） */
    show: true,
    selected: 0,
    color: '#6b84a8',
    selectedColor: '#1d4ed8',
    /** 与 TAB_BAR_ITEMS 顺序一致：0首页 1分类 2发布 3AI 4我的 */
    list: [
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
  },

  methods: {
    /** 切换 Tab 或打开发布子页 */
    onTap(e) {
      const { index, path, publish } = e.currentTarget.dataset;
      const idx = Number(index);

      if (publish) {
        wx.navigateTo({
          url: path,
          fail: () => {
            wx.showToast({ title: '无法打开发布页', icon: 'none' });
          },
        });
        return;
      }

      if (idx === this.data.selected) return;

      this.setData({ selected: idx });
      wx.switchTab({
        url: path,
        fail: () => {
          wx.showToast({ title: '页面跳转失败', icon: 'none' });
        },
      });
    },
  },
});
