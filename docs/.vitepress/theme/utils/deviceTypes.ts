import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';

import type {
    DeviceSpecificData
} from '../types/common'



// Reactive vars used to determine the current device size
export const smaller1024 = useMediaQuery('(max-width: 1024px)');
export const smaller768 = useMediaQuery('(max-width: 768px)');

export const isMobile = computed<boolean>(() => smaller768.value);
export const isTablet = computed<boolean>(() => !smaller768.value && smaller1024.value);
export const isDesktop = computed<boolean>(() => !smaller1024.value);


export function getDeviceSpecificData<T>(data: DeviceSpecificData<T>) {
    if (isMobile.value) return data.mobile;
    if (isTablet.value) return data.tablet;
    return data.desktop;
}