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
