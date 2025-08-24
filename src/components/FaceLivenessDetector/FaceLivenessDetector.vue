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
