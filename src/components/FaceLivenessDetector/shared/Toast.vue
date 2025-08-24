<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '@aws-amplify/ui'
import { LivenessClassNames } from '../types/classNames'

interface ToastProps {
  variation?: 'default' | 'primary' | 'error'
  size?: 'medium' | 'large'
  heading?: string
  isInitial?: boolean
  class?: string
}

const props = withDefaults(defineProps<ToastProps>(), {
  variation: 'default',
  size: 'medium',
  isInitial: false
})

const toastClasses = computed(() => 
  classNames(
    LivenessClassNames.Toast,
    `${LivenessClassNames.Toast}--${props.variation}`,
    `${LivenessClassNames.Toast}--${props.size}`,
    props.class
  )
)

const toastStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.isInitial) {
    styles.backgroundColor = 'var(--amplify-colors-background-primary)'
  }
  
  return styles
})

const messageStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.isInitial) {
    styles.color = 'var(--amplify-colors-font-primary)'
  }
  
  return styles
})
</script>

<template>
  <div 
    :class="toastClasses"
    :style="toastStyles"
  >
    <div :class="classNames('amplify-flex', LivenessClassNames.ToastContainer)">
      <div 
        :class="classNames('amplify-flex', LivenessClassNames.ToastMessage)"
        :style="messageStyles"
      >
        <slot />
      </div>
    </div>
  </div>
</template>