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
