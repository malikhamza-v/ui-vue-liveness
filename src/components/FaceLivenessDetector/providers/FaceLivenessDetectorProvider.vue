<template>
  <slot />
</template>

<script lang="ts">
import type {
  LivenessInterpreter,
  FaceLivenessDetectorProps,
} from '../service';

interface FaceLivenessDetectorContextType {
  componentProps: FaceLivenessDetectorProps;
  service: LivenessInterpreter;
}

export interface FaceLivenessDetectorProviderProps
  extends FaceLivenessDetectorContextType {}

// Create injection key symbol for type safety
export const FaceLivenessDetectorProviderKey = Symbol('FaceLivenessDetectorProvider');
</script>

<script setup lang="ts">
import { provide } from 'vue';

const props = defineProps<FaceLivenessDetectorProviderProps>();

// Provide the context value
provide(FaceLivenessDetectorProviderKey, {
  componentProps: props.componentProps,
  service: props.service,
});
</script>