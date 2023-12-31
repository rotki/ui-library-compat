import type TeleportContainer from '@/components/overlays/teleport-container';

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $teleport?: TeleportContainer;
  }
}
