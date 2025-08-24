<script lang="ts">
import type { FaceLivenessDetectorProps as FaceLivenessDetectorPropsFromUi } from './service'
import type { LivenessDisplayText } from './displayText'
import type { FaceLivenessDetectorComponents } from './shared/DefaultStartScreenComponents.vue'

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

interface Props extends /* @vue-ignore */ FaceLivenessDetectorProps {}

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

  // Use the provided credentialProvider if available, otherwise use default
  const finalCredentialProvider = config?.credentialProvider || defaultCredentialProvider

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
