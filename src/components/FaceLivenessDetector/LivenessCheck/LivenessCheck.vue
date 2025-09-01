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
import { computed, onMounted, onUnmounted } from 'vue'

import { LivenessErrorState } from '../service'
import LivenessCameraModule from './LivenessCameraModule.vue'
import { useLivenessActor, useLivenessSelector } from '../composables'
import { selectIsRecordingStopped } from './selectors'
import { isMobileScreen, getLandscapeMediaQuery } from '../utils/device'
import CancelButton from '../shared/CancelButton.vue'
import { selectErrorState } from '../shared'
import type { FaceLivenessDetectorComponents } from '../shared/DefaultStartScreenComponents'
import type {
  InstructionDisplayText,
  HintDisplayText,
  CameraDisplayText,
  StreamDisplayText,
  ErrorDisplayText,
} from '../displayText'

const CHECK_CLASS_NAME = 'liveness-detector-check'
const CAMERA_ERROR_TEXT_WIDTH = 420

interface LivenessCheckProps {
  instructionDisplayText: Required<InstructionDisplayText>
  hintDisplayText: Required<HintDisplayText>
  cameraDisplayText: Required<CameraDisplayText>
  streamDisplayText: Required<StreamDisplayText>
  errorDisplayText: Required<ErrorDisplayText>
  components?: FaceLivenessDetectorComponents
}

const props = defineProps<LivenessCheckProps>()

const { state, send } = useLivenessActor()
const errorState = useLivenessSelector(selectErrorState)
const isRecordingStopped = useLivenessSelector(selectIsRecordingStopped)

const isPermissionDenied = computed(() => state.value.matches('permissionDenied'))
const isMobile = computed(() => isMobileScreen())

const recheckCameraPermissions = () => {
  // [IGNORE]
  send({ type: 'RETRY_CAMERA_CHECK' })
}

const {
  cameraMinSpecificationsHeadingText,
  cameraMinSpecificationsMessageText,
  cameraNotFoundHeadingText,
  cameraNotFoundMessageText,
  retryCameraPermissionsText,
} = props.cameraDisplayText

const { cancelLivenessCheckText } = props.streamDisplayText

// Handle landscape orientation on mobile
onMounted(() => {
  if (isMobile.value) {
    const sendLandscapeWarning = (isLandscapeMatched: boolean) => {
      if (isLandscapeMatched) {
        // [IGNORE]
        send({ type: 'MOBILE_LANDSCAPE_WARNING' })
      }
    }

    // Get orientation: landscape media query
    const landscapeMediaQuery = getLandscapeMediaQuery()

    // Send warning based on initial orientation
    sendLandscapeWarning(landscapeMediaQuery.matches)

    // Listen for future orientation changes and send warning
    const changeHandler = (e: MediaQueryListEvent) => {
      sendLandscapeWarning(e.matches)
    }

    landscapeMediaQuery.addEventListener('change', changeHandler)

    // Remove matchMedia event listener
    onUnmounted(() => {
      landscapeMediaQuery.removeEventListener('change', changeHandler)
    })
  }

  send({
    type: 'INIT_CAMERA',
  })
})
</script>

<template>
  <div :class="CHECK_CLASS_NAME" class="liveness-check-container">
    <!-- Camera Module -->
    <LivenessCameraModule
      :isMobileScreen="isMobile"
      :isRecordingStopped="isRecordingStopped!"
      :instructionDisplayText="instructionDisplayText"
      :streamDisplayText="streamDisplayText"
      :hintDisplayText="hintDisplayText"
      :errorDisplayText="errorDisplayText"
      :cameraDisplayText="cameraDisplayText"
      :components="components"
    />
  </div>
</template>

<style scoped>
.liveness-check-container {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 1.5rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: var(--amplify-colors-background-primary, #ffffff);
}

.landscape-error {
  position: absolute;
}

.permission-error {
  height: 480px;
}

.error-heading {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.error-message {
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.retry-button {
  background-color: var(--amplify-colors-brand-primary, #0066cc);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
}

.retry-button:hover {
  background-color: var(--amplify-colors-brand-primary-90, #0052a3);
}

.cancel-button-container {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
