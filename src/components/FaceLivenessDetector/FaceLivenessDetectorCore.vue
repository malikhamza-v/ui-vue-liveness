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
import { ref } from 'vue'
import { useInterpret } from '@xstate/vue'
import type { FaceLivenessDetectorCoreProps as FaceLivenessDetectorPropsFromUi } from './service'
import { livenessMachine } from './service'

import { FaceLivenessDetectorProvider } from './providers'
import { LivenessCheck } from './LivenessCheck'
import type { FaceLivenessDetectorComponents } from './shared/DefaultStartScreenComponents'
import type { LivenessDisplayText } from './displayText'
import { getDisplayText } from './utils/getDisplayText'

export interface FaceLivenessDetectorCoreProps
  extends /* @vue-ignore */ FaceLivenessDetectorPropsFromUi {
  components?: FaceLivenessDetectorComponents
  displayText?: LivenessDisplayText
}

// Explicitly define props for Vue to recognize them
interface VueFaceLivenessDetectorCoreProps {
  sessionId: string
  region: string
  onAnalysisComplete: () => Promise<void>
  onUserCancel?: () => void
  onError?: (livenessError: any) => void
  disableStartScreen?: boolean
  config?: any
  components?: FaceLivenessDetectorComponents
  displayText?: LivenessDisplayText
}

const props = withDefaults(defineProps<VueFaceLivenessDetectorCoreProps>(), {
  components: undefined,
  displayText: undefined,
  disableStartScreen: false,
  config: () => ({}),
  onUserCancel: undefined,
  onError: undefined,
})

const emit = defineEmits<{
  'face-match-state': [faceMatchState: any]
}>()

const currElementRef = ref<HTMLDivElement | null>(null)

const {
  hintDisplayText,
  cameraDisplayText,
  instructionDisplayText,
  streamDisplayText,
  errorDisplayText,
} = getDisplayText(props.displayText)

// Pass emit function to machine context so it can emit face match state changes
const emitFaceMatchState = (faceMatchState: any) => {
  emit('face-match-state', faceMatchState)
}

const service = useInterpret(livenessMachine, {
  devTools: process.env.NODE_ENV === 'development',
  context: {
    componentProps: {
      ...props,
      config: props.config ?? {},
    },
    emitFaceMatchState,
  },
})
</script>

<template>
  <div>
    <FaceLivenessDetectorProvider :component-props="props" :service="service">
      <slot>
        <div class="flex flex-col" ref="currElementRef">
          <LivenessCheck
            :instruction-display-text="instructionDisplayText"
            :hint-display-text="hintDisplayText"
            :camera-display-text="cameraDisplayText"
            :stream-display-text="streamDisplayText"
            :error-display-text="errorDisplayText"
            :components="components"
          />
        </div>
      </slot>
    </FaceLivenessDetectorProvider>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}
</style>
