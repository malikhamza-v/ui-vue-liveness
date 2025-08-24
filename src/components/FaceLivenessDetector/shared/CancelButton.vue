<script setup lang="ts">
import { computed } from 'vue'
import { useLivenessActor } from '../composables'

interface CancelButtonProps {
  ariaLabel: string
}

defineProps<CancelButtonProps>()

const { state, send } = useLivenessActor()
const isFinalState = computed(() => state.value.done)

const handleClick = () => {
  send({
    type: 'CANCEL',
  })
}
</script>

<template>
  <button v-if="!isFinalState" @click="handleClick" :aria-label="ariaLabel">
    <span>Close ICON</span>
  </button>
</template>
