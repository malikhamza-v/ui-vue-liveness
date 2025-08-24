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
