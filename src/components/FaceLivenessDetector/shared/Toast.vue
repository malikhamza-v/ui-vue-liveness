<!--
Copyright 2025 [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

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
