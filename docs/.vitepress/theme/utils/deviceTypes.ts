import { useMediaQuery } from '@vueuse/core';
import { computed, Ref, ComputedRef } from 'vue';

import type {DeviceSpecificData, DeviceSpecificInput} from '../types/common';


// Reactive vars used to determine the current device size
export const smaller1024 = useMediaQuery('(max-width: 1024px)');
export const smaller768 = useMediaQuery('(max-width: 768px)');

export const isMobile = computed<boolean>(() => smaller768.value);
export const isTablet = computed<boolean>(() => !smaller768.value && smaller1024.value);
export const isDesktop = computed<boolean>(() => !smaller1024.value);

function normalizeInput(raw?: DeviceSpecificInput): DeviceSpecificData {
    if (typeof raw === 'string') {
        return { mobile: raw, tablet: raw, desktop: raw }
    } else if (typeof raw === 'object') {
        return { mobile: raw.mobile, tablet: raw.tablet, desktop: raw.desktop }
    } else {
        return {}
    }
}

export function mergeDeviceData(...sources: DeviceSpecificInput[]): DeviceSpecificData {
    return Array.isArray(sources)
        ? sources
            .map(normalizeInput)
            .reduce((acc, cur) => {
                const result = { ...acc as DeviceSpecificData };
                if (typeof cur.mobile === 'string' && !result.mobile) {
                    result.mobile = cur.mobile
                };
                if (typeof cur.tablet === 'string' && !result.tablet) {
                    result.tablet = cur.tablet
                }
                if (typeof cur.desktop === 'string' && !result.desktop) {
                    result.desktop = cur.desktop
                }
                return result;
            },
            {} as DeviceSpecificData)
        : {}
}