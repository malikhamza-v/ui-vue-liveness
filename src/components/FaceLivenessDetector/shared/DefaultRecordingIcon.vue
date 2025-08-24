<template>
  <div :class="LivenessClassNames.RecordingIconContainer">
    <RecordingIconComponent>{{ recordingIndicatorText }}</RecordingIconComponent>
  </div>
</template>

<script setup lang="ts">
import RecordingIconComponent from './RecordingIcon.vue'
import { LivenessClassNames } from '../types/classNames'

interface Props {
  recordingIndicatorText: string
}

defineProps<Props>()
</script>