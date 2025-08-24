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

<script lang="ts">
import type { Component } from 'vue'
import type { ErrorDisplayText } from '../displayText'

export interface CheckScreenComponents {
  ErrorView?: Component<FaceLivenessErrorModalProps>
}

export interface FaceLivenessErrorModalProps {
  displayText?: Partial<ErrorDisplayText>
  onRetry: () => void
}
</script>

<script setup lang="ts">
export interface Props {
  displayText?: Partial<ErrorDisplayText>
  onRetry?: () => void
}

defineProps<Props>()
</script>

<template>
  <div class="error-modal">
    <p>Error occurred during liveness detection</p>
    <button v-if="onRetry" @click="onRetry">Retry</button>
  </div>
</template>
