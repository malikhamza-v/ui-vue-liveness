<template>
  <div :class="LivenessClassNames.CancelContainer">
    <CancelButtonComponent :ariaLabel="cancelLivenessCheckText" />
  </div>
</template>

<script setup lang="ts">
import CancelButtonComponent from './CancelButton.vue'
import { LivenessClassNames } from '../types/classNames'

interface Props {
  cancelLivenessCheckText: string
}

defineProps<Props>()
</script>
