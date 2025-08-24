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
interface CameraSelectorProps {
  deviceId?: string
  devices: MediaDeviceInfo[]
}

defineProps<CameraSelectorProps>()

const emit = defineEmits<{
  select: [event: Event]
}>()

const onSelect = (event: Event) => {
  emit('select', event)
}

// You'll need to import or define LivenessClassNames
import { LivenessClassNames } from '../types/classNames'
</script>

<template>
  <div :class="LivenessClassNames.StartScreenCameraSelect">
    <div :class="LivenessClassNames.StartScreenCameraSelectContainer">
      <label
        for="amplify-liveness-camera-select"
        :class="`${LivenessClassNames.StartScreenCameraSelect}__label`"
      >
        Camera:
      </label>
      <select
        id="amplify-liveness-camera-select"
        :data-testid="'amplify-liveness-camera-select'"
        :value="deviceId"
        @change="onSelect"
      >
        <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
          {{ device.label }}
        </option>
      </select>
    </div>
  </div>
</template>
