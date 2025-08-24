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
