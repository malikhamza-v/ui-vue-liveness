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

<script lang="ts">
import type { FaceLivenessDetectorProps as FaceLivenessDetectorPropsFromUi } from './service'
import type { LivenessDisplayText } from './displayText'
import type { FaceLivenessDetectorComponents } from './shared/DefaultStartScreenComponents'

export interface FaceLivenessDetectorProps
  extends /* @vue-ignore */ FaceLivenessDetectorPropsFromUi {
  components?: FaceLivenessDetectorComponents
  displayText?: LivenessDisplayText
}
</script>

<script setup lang="ts">
import { fetchAuthSession } from 'aws-amplify/auth'
import FaceLivenessDetectorCore from './FaceLivenessDetectorCore.vue'
import { computed } from 'vue'

export interface Props extends /* @vue-ignore */ FaceLivenessDetectorProps {
  // This interface extends FaceLivenessDetectorProps for Vue component props
}

const props = defineProps<Props>()

const defaultCredentialProvider = async () => {
  const { credentials } = await fetchAuthSession()
  if (!credentials) {
    throw new Error('No credentials provided')
  }
  return credentials
}

const coreProps = computed(() => {
  const { config, ...rest } = props

  // Use default credential provider since FaceLivenessDetector wraps the core with Amplify defaults
  const finalCredentialProvider = defaultCredentialProvider

  return {
    ...rest,
    config: {
      ...config,
      credentialProvider: finalCredentialProvider,
    },
  }
})
</script>

<template>
  <FaceLivenessDetectorCore v-bind="coreProps" />
</template>
