<script setup lang="ts">
import { classNames } from '@aws-amplify/ui'
import { LivenessClassNames } from '../types/classNames'

interface RecordingIconProps {
  children?: string
}

defineProps<RecordingIconProps>()
</script>

<template>
  <div :class="classNames('amplify-flex', LivenessClassNames.RecordingIcon)">
    <div 
      :class="classNames('amplify-flex', 'amplify-flex--justify-content-center')"
      data-testid="rec-icon"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="8" fill="red" />
      </svg>
    </div>
    <span 
      :class="classNames('amplify-text', 'amplify-text--fontWeight-bold')"
    >
      <slot>{{ children }}</slot>
    </span>
  </div>
</template>