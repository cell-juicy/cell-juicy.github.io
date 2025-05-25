import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';



// Reactive vars used to determine the current device size
export const smaller1024 = useMediaQuery('(max-width: 1024px)');
export const smaller768 = useMediaQuery('(max-width: 768px)');

export const isMobile = computed<boolean>(() => smaller768.value);
export const isTablet = computed<boolean>(() => !smaller768.value && smaller1024.value);
export const isDesktop = computed<boolean>(() => !smaller1024.value);