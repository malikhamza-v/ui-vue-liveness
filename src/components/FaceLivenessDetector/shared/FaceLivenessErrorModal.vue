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
interface Props {
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
