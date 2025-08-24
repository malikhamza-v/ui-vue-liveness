<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { LivenessClassNames } from '../types/classNames'

interface MatchIndicatorProps {
  percentage: number
  initialPercentage?: number
  testId?: string
}

const props = withDefaults(defineProps<MatchIndicatorProps>(), {
  initialPercentage: 25
})

const matchPercentage = ref(props.initialPercentage)

watch(() => props.percentage, (newPercentage) => {
  if (newPercentage < 0) {
    matchPercentage.value = 0
  } else if (newPercentage > 100) {
    matchPercentage.value = 100
  } else {
    matchPercentage.value = newPercentage
  }
}, { immediate: true })

const percentageStyles = computed(() => ({
  '--percentage': `${matchPercentage.value}%`
}))
</script>

<template>
  <div :class="LivenessClassNames.MatchIndicator" :data-testid="testId">
    <div
      :class="`${LivenessClassNames.MatchIndicator}__bar`"
      :style="percentageStyles"
      role="progressbar"
      aria-label="MatchIndicator"
      :aria-valuenow="percentage"
      :aria-valuetext="`${percentage}% face fit`"
    />
  </div>
</template>