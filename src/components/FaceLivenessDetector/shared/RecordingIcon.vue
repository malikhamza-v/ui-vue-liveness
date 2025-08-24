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
