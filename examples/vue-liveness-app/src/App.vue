<template>
  <div class="relative">
    <FaceLivenessDetectorCore
      v-if="!isLoading && !showOverlay && !isFetchingResults"
      :sessionId="verificationConfig.sessionID"
      :config="config"
      :region="verificationConfig.region"
      @error="handleError"
      @analysis-complete="onAnalysisComplete"
      @face-match-state="handleFaceMatchState"
    >
      <FaceLiveness
        :hasInitialized="hasInitialized"
        :faceState="faceState"
        @displayError="handleError"
      />
    </FaceLivenessDetectorCore>

    <template v-else-if="isLoading">
      <div class="flex justify-center items-center gap-2 h-full">
        <div
          class="w-6 h-6 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
        ></div>
        <span class="text-sm">Just a moment, we're setting things up</span>
      </div>
    </template>

    <template v-else-if="isFetchingResults">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
          <div
            class="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
          ></div>
          <span class="text-lg font-medium">Fetching the results...</span>
        </div>
      </div>
    </template>

    <div
      v-if="errorMessage"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 flex flex-col items-center gap-4 max-w-md mx-4">
        <div class="text-red-500 text-xl">⚠️</div>
        <div class="text-lg font-medium text-center text-red-600">Error</div>
        <div class="text-sm text-gray-700 text-center">{{ errorMessage }}</div>
        <button
          @click="handleTryAgain"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          🔄 Try Again
        </button>
      </div>
    </div>

    <VerificationOverlay
      :show="showOverlay"
      :result="verificationResult"
      @close="closeOverlay"
      @try-again="handleTryAgain"
    />
  </div>
</template>

<script setup>
import { FaceLivenessDetectorCore } from 'ui-vue-liveness'
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import VerificationOverlay from './components/VerificationOverlay.vue'
import FaceLiveness from './components/FaceLiveness.vue'

const isLoading = ref(true)
const showOverlay = ref(false)
const isFetchingResults = ref(false)
const verificationResult = ref(null)
const verificationConfig = ref({
  sessionID: '',
  region: '',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
})
const hasInitialized = ref(false)
const errorMessage = ref('')

const faceState = ref({
  isTooFar: false,
  isCentered: false,
  yawValues: {
    left: 0,
    right: 0,
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
  // try {
  //   console.log('analysis is complete')
  //   isFetchingResults.value = true
  //   const res = await axios.get(
  //     `${import.meta.env.VITE_BASE_URL}/api/face-verification/session/${verificationConfig.value.sessionID}/results`,
  //   )
  //   verificationResult.value = {
  //     confidence: res.data.confidence,
  //     isVerified: res.data.confidence > 60,
  //   }
  //   showOverlay.value = true
  // } catch (e) {
  //   console.error('[ERR]: Failed to get verification results', e)
  // } finally {
  //   isFetchingResults.value = false
  // }
}

const closeOverlay = () => {
  showOverlay.value = false
  verificationResult.value = null
}

const handleTryAgain = () => {
  showOverlay.value = false
  verificationResult.value = null
  createSession()
}

const handleFaceMatchState = (faceMatchState, yawData) => {
  if (!hasInitialized.value) {
    hasInitialized.value = true
  }
  if (faceMatchState === 'TOO FAR') {
    faceState.value.isTooFar = true
    faceState.value.isCentered = true
  } else if (faceMatchState === 'OFF CENTER') {
    faceState.value.isCentered = false
  } else if (faceMatchState === 'MATCHED') {
    faceState.value = {
      isTooFar: false,
      isCentered: true,
      yawValues: {
        left: yawData?.leftYaw,
        right: yawData?.rightYaw,
      },
    }
  }
}

onMounted(() => {
  createSession()
})
</script>

<style scoped></style>
