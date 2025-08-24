<script setup lang="ts">
import { classNames } from '@aws-amplify/ui'
import { LivenessClassNames } from '../types/classNames'
import Toast from './Toast.vue'

interface ToastWithLoaderProps {
  displayText: string
}

defineProps<ToastWithLoaderProps>()
</script>

<template>
  <Toast aria-live="polite">
    <div :class="classNames('amplify-flex', LivenessClassNames.HintText)">
      <div 
        :class="classNames('amplify-loader', 'amplify-loader--medium')"
        role="status"
        aria-label="Loading"
      >
        <div class="amplify-loader__icon"></div>
      </div>
      <div>{{ displayText }}</div>
    </div>
  </Toast>
</template>