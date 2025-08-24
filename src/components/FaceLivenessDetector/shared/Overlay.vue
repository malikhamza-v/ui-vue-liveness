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
