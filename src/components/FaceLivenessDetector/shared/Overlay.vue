<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '@aws-amplify/ui'
import { LivenessClassNames } from '../types/classNames'

interface OverlayProps {
  horizontal?: 'start' | 'center' | 'end'
  vertical?: 'start' | 'center' | 'end' | 'space-between'
  class?: string
}

const props = withDefaults(defineProps<OverlayProps>(), {
  horizontal: 'center',
  vertical: 'center'
})

const flexClasses = computed(() => {
  const alignItems = props.horizontal === 'start' ? 'flex-start' : 
                     props.horizontal === 'end' ? 'flex-end' : 'center'
  
  const justifyContent = props.vertical === 'start' ? 'flex-start' :
                         props.vertical === 'end' ? 'flex-end' :
                         props.vertical === 'space-between' ? 'space-between' : 'center'

  return classNames(
    'amplify-flex',
    LivenessClassNames.Overlay,
    props.class,
    {
      'amplify-flex--align-items-flex-start': alignItems === 'flex-start',
      'amplify-flex--align-items-center': alignItems === 'center',
      'amplify-flex--align-items-flex-end': alignItems === 'flex-end',
      'amplify-flex--justify-content-flex-start': justifyContent === 'flex-start',
      'amplify-flex--justify-content-center': justifyContent === 'center',
      'amplify-flex--justify-content-flex-end': justifyContent === 'flex-end',
      'amplify-flex--justify-content-space-between': justifyContent === 'space-between',
    }
  )
})
</script>

<template>
  <div :class="flexClasses">
    <slot />
  </div>
</template>