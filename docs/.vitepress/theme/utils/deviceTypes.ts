import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';

// @ts-ignore
export const larger1024 = useMediaQuery('(min-width: 1024px)', { ssrWidth: 1200 });
// @ts-ignore
export const larger768 = useMediaQuery('(min-width: 768px)', { ssrWidth: 1200 });

export const isMobile = computed(() => !larger768.value);
export const isTablet = computed(() => larger768.value && !larger1024.value);
export const isDesktop = computed(() => larger1024.value);
