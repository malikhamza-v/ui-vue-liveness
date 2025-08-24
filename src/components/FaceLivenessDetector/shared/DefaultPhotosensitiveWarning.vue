<template>
  <div
    :class="`${ComponentClassName.Alert} ${LivenessClassNames.StartScreenWarning}`"
    :style="{ zIndex: '3', display: 'flex' }"
  >
    <div style="flex: 1">
      <div :class="ComponentClassName.AlertHeading">{{ headingText }}</div>
      <div :class="ComponentClassName.AlertBody">{{ bodyText }}</div>
    </div>
    <LivenessIconWithPopoverComponent :labelText="labelText" :headingText="headingText">
      {{ infoText }}
    </LivenessIconWithPopoverComponent>
  </div>
</template>

<script setup lang="ts">
import { ComponentClassName } from '@aws-amplify/ui'
import LivenessIconWithPopoverComponent from './LivenessIconWithPopover.vue'
import { LivenessClassNames } from '../types/classNames'

interface Props {
  bodyText: string
  headingText: string
  infoText: string
  labelText: string
}

defineProps<Props>()
</script>