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
import { ref, onMounted, onUnmounted } from 'vue'
import { LivenessClassNames } from '../types/classNames'

interface LivenessIconWithPopoverProps {
  labelText: string
  headingText: string
}

defineProps<LivenessIconWithPopoverProps>()

const shouldShowPopover = ref(false)
const wrapperRef = ref<HTMLDivElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (
    shouldShowPopover.value &&
    wrapperRef.value &&
    !wrapperRef.value.contains(event.target as Node)
  ) {
    shouldShowPopover.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const togglePopover = () => {
  shouldShowPopover.value = !shouldShowPopover.value
}
</script>

<template>
  <div :class="LivenessClassNames.Popover" ref="wrapperRef">
    <button
      aria-controls="photosensitivity-description"
      :aria-expanded="shouldShowPopover"
      role="alertdialog"
      :aria-label="labelText"
      aria-describedby="photosensitivity-description"
      id="popover-button"
      @click="togglePopover"
      data-testid="popover-icon"
      class="amplify-button amplify-button--colorTheme-info"
    >
      <!-- Info icon SVG -->
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
        <path d="M8 4v4M8 12h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <template v-if="shouldShowPopover">
      <div :class="LivenessClassNames.PopoverAnchor" />
      <div :class="LivenessClassNames.PopoverAnchorSecondary" />
      <div
        :aria-hidden="!shouldShowPopover"
        :aria-label="headingText"
        :class="LivenessClassNames.PopoverContainer"
        data-testid="popover-text"
        id="photosensitivity-description"
        role="alertdialog"
        style="left: -108px"
      >
        <slot />
      </div>
    </template>
  </div>
</template>
