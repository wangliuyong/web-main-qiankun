/**
 * 微信小程序自定义 TabBar（原生组件，uni-app 会直接拷贝到输出目录）
 */
const { TAB_BAR_TAB_ITEMS } = require('./tab-items.js');

Component({
  data: {
    show: true,
    selected: 0,
    color: '#6b84a8',
    selectedColor: '#1d4ed8',
    list: TAB_BAR_TAB_ITEMS,
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
