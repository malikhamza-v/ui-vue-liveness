<script setup>
import { FaceLivenessDetectorCore } from 'ui-vue-liveness'
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const isLoading = ref(true)
const verificationConfig = ref({
  sessionID: '',
  region: '',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
})

const config = computed(() => {
  return {
    credentialProvider: async () => verificationConfig.value.credentials,
  }
})

async function createSession() {
  try {
    isLoading.value = true
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/face-verification/create-session`,
    )

    verificationConfig.value = {
      sessionID: response.data.sessionId,
      region: response.data.region,
      credentials: {
        accessKeyId: response.data.accessKeyId,
        secretAccessKey: response.data.secretAccessKey,
        sessionToken: response.data.sessionToken,
      },
    }
  } catch (e) {
    console.error('[ERR]: at creating session', e)
  } finally {
    isLoading.value = false
  }
}

const handleError = (error) => {
  console.log('[ERR] error at FaceLivenessDetectorCore', error)
}

const onAnalysisComplete = async () => {
  try {
    console.log('analysis is complete')
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/face-verification/session/${verificationConfig.value.sessionID}/results`,
    )
    // if (parseInt(res.confidence) > 50) {
    //     const resCode = await submitFaceVerificationVideo();
    //     if (resCode == 200) {
    //         // Reset max tries to 2 on success
    //         setMaxTries(2);
    //         verificationStates.handle_success();
    //     } else {
    //         verificationStates.handle_error();
    //     }
    // } else {
    //     // Handle failed verification attempt
    //     const currentTries = getMaxTries();
    //     if (currentTries > 1) {
    //         // Decrement tries and continue with liveness check
    //         setMaxTries(currentTries - 1);
    //         verificationStates.handle_error();
    //     } else {
    //         // Max tries reached, submit without liveness
    //         try {
    //             await submitFaceVerificationVideo();
    //             setMaxTries(2);
    //             verificationStates.handle_success();
    //         } catch (error) {
    //             verificationStates.handle_error();
    //         }
    //     }
    // }
  } catch (e) {}
}

const handleFaceMatchState = (faceMatchState, yawData) => {
  // if (!hasInitialized.value) {
  //   hasInitialized.value = true
  // }
  // if (faceMatchState === 'TOO FAR') {
  //   faceState.value.isTooFar = true
  //   faceState.value.isCentered = true
  // } else if (faceMatchState === 'OFF CENTER') {
  //   faceState.value.isCentered = false
  // } else if (faceMatchState === 'MATCHED') {
  //   faceState.value = {
  //     isTooFar: false,
  //     isCentered: true,
  //     yawValues: {
  //       left: yawData?.leftYaw,
  //       right: yawData?.rightYaw,
  //     },
  //   }
  // }
}

onMounted(() => {
  createSession()
})
</script>

<template>
  <FaceLivenessDetectorCore
    v-if="!isLoading"
    :sessionId="verificationConfig.sessionID"
    :config="config"
    :region="verificationConfig.region"
    @error="handleError"
    @analysis-complete="onAnalysisComplete"
    @face-match-state="handleFaceMatchState"
  />

  <template v-else>
    <div class="flex justify-center items-center gap-2 h-full">
      <div
        class="w-6 h-6 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
      ></div>
      <span class="text-sm">Just a moment, we're setting things up</span>
    </div>
  </template>
</template>

<style scoped></style>
