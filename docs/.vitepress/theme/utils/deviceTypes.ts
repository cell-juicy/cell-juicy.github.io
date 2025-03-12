import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';

// @ts-ignore
export const smaller1024 = useMediaQuery('(max-width: 1024px)', { ssrWidth: 1200 });
// @ts-ignore
export const smaller768 = useMediaQuery('(max-width: 768px)', { ssrWidth: 1200 });

export const isMobile = computed<boolean>(() => smaller768.value);
export const isTablet = computed<boolean>(() => !smaller768.value && smaller1024.value);
export const isDesktop = computed<boolean>(() => !smaller1024.value);
