<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { useKidsStore } from '@/stores/kids';

/** 应用启动：从本地存储恢复进度、作品集与档案 */
onLaunch(() => {
  useKidsStore().hydrateFromStorage();
});
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
