<template>
  <div class="mb-6">
    <h4 class="text-lg font-semibold text-dark-body mb-2">
      Scan your face to verify your identity
    </h4>
    <p class="text-sm text-dark-body font-normal">
      Make sure your face is well-lit and fully visible
    </p>
  </div>

  <div class="mb-16 flex justify-center">
    <div class="relative w-full max-w-md h-80 rounded-lg overflow-hidden bg-black">
      <!-- Video Stream -->
      <canvas ref="freshnessColorRef" hidden class="!hidden" />

      <div
        :style="{
          aspectRatio: `${aspectRatio}`,
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
        }"
      >
        <video
          ref="videoRef"
          :style="getVideoStyles()"
          @canplay="handleMediaPlay"
          @loadedmetadata="handleAfterLoad"
          muted
          playsinline
          autoplay
          :width="mediaWidth"
          :height="mediaHeight"
        />

        <!-- Canvas for processing -->
        <canvas
          ref="canvasRef"
          class="absolute top-0 left-0 right-0 bottom-0 w-full h-full pointer-events-none"
          :style="{ zIndex: 2 }"
        />
      </div>

      <!-- Face Guide Overlay -->
      <div class="absolute inset-0 pointer-events-none" :style="{ zIndex: 3 }">
        <!-- Background tint with face cutout -->
        <svg
          class="absolute pointer-events-none"
          :style="{
            zIndex: 4,
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + 1px), calc(-50% - 3px)) scale(${getOverlayScale() * 1.25})`,
            width: '100%',
            height: '100%',
          }"
          viewBox="0 0 1282.91 828.81"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0,0v828.81h1282.91V0H0ZM789.82,366.28c-.31,12.44,1.1,36.84-6.43,70.11-19.67,86.94-20.75,128.14-52.62,164.77-12.38,14.22-36.54,50.48-87.64,50.48h-6.19c-51.11,0-75.27-36.26-87.64-50.48-31.87-36.62-32.95-77.83-52.62-164.77-7.53-33.27-6.11-57.67-6.43-70.11-4.21-166.87,110.06-172.25,146.69-175.29h6.19c35.03,1.99,150.9,8.41,146.69,175.29Z"
            fill="rgba(0, 0, 0, 0.8)"
            fill-rule="evenodd"
          />
        </svg>

        <!-- Dynamic face guide with centering detection -->
        <svg
          class="absolute pointer-events-none"
          :style="{
            zIndex: 5,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${getOverlayScale()})`,
            width: 'auto',
            height: '75%',
          }"
          viewBox="0 0 326.72 496.67"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Face outline - left half (starts with gap) -->
          <path
            d="M157.26,5.23C115.84,8.56.78,17.99,5.12,190.19c.33,13.15-1.16,38.92,6.79,74.07,20.78,91.85,21.92,135.38,55.59,174.07,12.84,14.76,37.7,51.99,89.76,53.3"
            fill="none"
            :stroke="getStrokeColor()"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="8 7"
            stroke-dashoffset="8"
            :class="{ 'animate-pulse': getStrokeColor() === '#F59E0B' }"
          />

          <!-- Face outline - right half (larger offset for bigger gap) -->
          <path
            d="M170.12,491.61c51.61-1.61,76.31-38.58,89.1-53.28,33.68-38.69,34.81-82.22,55.59-174.07,7.95-35.15,6.46-60.93,6.79-74.07C325.92,19.09,210.75,7.65,170.12,5.2"
            fill="none"
            :stroke="getStrokeColor()"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="8 7"
            stroke-dashoffset="4"
            :class="{ 'animate-pulse': getStrokeColor() === '#F59E0B' }"
          />
        </svg>

        <!-- Static background green lines (only when camera is active) -->
        <svg
          v-if="isActive"
          class="absolute pointer-events-none"
          :style="{
            zIndex: 999999,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${getOverlayScale()})`,
            width: 'auto',
            height: '75%',
          }"
          viewBox="0 0 326.72 496.67"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Left side background line -->
          <path
            d="M157.26,5.23C115.84,8.56.78,17.99,5.12,190.19c.33,13.15-1.16,38.92,6.79,74.07,20.78,91.85,21.92,135.38,55.59,174.07,12.84,14.76,37.7,51.99,89.76,53.3"
            fill="none"
            stroke="#22C55E"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            :style="{ opacity: leftLineVisible ? 1.0 : 0 }"
            class="transition-opacity duration-300"
          />

          <!-- Right side background line -->
          <path
            d="M170.12,491.61c51.61-1.61,76.31-38.58,89.1-53.28,33.68-38.69,34.81-82.22,55.59-174.07,7.95-35.15,6.46-60.93,6.79-74.07C325.92,19.09,210.75,7.65,170.12,5.2"
            fill="none"
            stroke="#22C55E"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            :style="{ opacity: rightLineVisible ? 1.0 : 0 }"
            class="transition-opacity duration-300"
          />
        </svg>

        <!-- Head movement progress indicators -->
        <svg
          class="absolute pointer-events-none"
          :style="{
            zIndex: 999999,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${getOverlayScale()})`,
            width: 'auto',
            height: '75%',
          }"
          viewBox="0 0 326.72 496.67"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Left turn indicator -->
          <path
            d="M157.26,5.23C115.84,8.56.78,17.99,5.12,190.19c.33,13.15-1.16,38.92,6.79,74.07,20.78,91.85,21.92,135.38,55.59,174.07,12.84,14.76,37.7,51.99,89.76,53.3"
            fill="none"
            stroke="#22C55E"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            :style="{ opacity: getLeftTurnOpacity() }"
            class="transition-opacity duration-100"
          />

          <!-- Right turn indicator -->
          <path
            d="M170.12,491.61c51.61-1.61,76.31-38.58,89.1-53.28,33.68-38.69,34.81-82.22,55.59-174.07,7.95-35.15,6.46-60.93,6.79-74.07C325.92,19.09,210.75,7.65,170.12,5.2"
            fill="none"
            stroke="#22C55E"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            :style="{ opacity: getRightTurnOpacity() }"
            class="transition-opacity duration-100"
          />
        </svg>
      </div>

      <!-- Camera Placeholder -->
      <div
        v-if="!isActive"
        class="absolute inset-0 flex items-center justify-center"
        :style="{ zIndex: 15 }"
      >
        <div class="text-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mx-auto mb-4"
            style="color: #ccc; opacity: 0.7"
          >
            <path
              d="M9 2C8.45 2 8 2.45 8 3V4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4H16V3C16 2.45 15.55 2 15 2H9ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
              fill="#CCC"
            />
          </svg>
        </div>
      </div>

      <!-- Guided prompts -->
      <div
        v-if="isActive && !showSuccess"
        class="absolute left-0 right-0 flex items-center justify-center"
        :style="{
          zIndex: 16,
          top: 0,
          height: `${50 - 75 / 2}%`,
        }"
      >
        <p v-if="!hasInitialized" class="text-sm font-medium animate-pulse text-orange-400">
          Initializing...
        </p>

        <p v-else-if="showFramePrompt" class="text-orange-500 text-sm font-medium animate-pulse">
          Place face in the frame
        </p>
        <p
          v-else-if="showLeftPrompt"
          class="text-slate-500 text-sm font-medium"
          style="color: #94969c"
        >
          {{ getLeftPromptText() }}
        </p>
        <p
          v-else-if="showRightPrompt"
          class="text-slate-500 text-sm font-medium"
          style="color: #94969c"
        >
          Look right →
        </p>
        <p v-else class="text-sm font-medium animate-pulse text-orange-400">Hold still...</p>
      </div>

      <!-- Success overlay - BLACK BACKGROUND ONLY -->
      <div v-if="showSuccess" class="absolute inset-0 bg-black" :style="{ zIndex: 5 }" />

      <!-- Green lines - ALWAYS ON TOP -->
      <svg
        v-if="showSuccess && leftLineVisible"
        class="absolute pointer-events-none"
        :style="{
          zIndex: 999999,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${getOverlayScale()})`,
          width: 'auto',
          height: '75%',
        }"
        viewBox="0 0 326.72 496.67"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M157.26,5.23C115.84,8.56.78,17.99,5.12,190.19c.33,13.15-1.16,38.92,6.79,74.07,20.78,91.85,21.92,135.38,55.59,174.07,12.84,14.76,37.7,51.99,89.76,53.3"
          fill="none"
          stroke="#22C55E"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
          :style="{ opacity: 1.0 }"
        />
      </svg>
      <svg
        v-if="showSuccess && rightLineVisible"
        class="absolute pointer-events-none"
        :style="{
          zIndex: 999999,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${getOverlayScale()})`,
          width: 'auto',
          height: '75%',
        }"
        viewBox="0 0 326.72 496.67"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M170.12,491.61c51.61-1.61,76.31-38.58,89.1-53.28,33.68-38.69,34.81-82.22,55.59-174.07,7.95-35.15,6.46-60.93,6.79-74.07C325.92,19.09,210.75,7.65,170.12,5.2"
          fill="none"
          stroke="#22C55E"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
          :style="{ opacity: 1.0 }"
        />
      </svg>

      <!-- Check icon - appears with success -->
      <div
        v-if="showSuccess"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
        :style="{ zIndex: 999999999 }"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="animate-pulse"
        >
          <circle cx="12" cy="12" r="10" fill="#22C55E" />
          <path
            d="m9 12 2 2 4-4"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- Success text with check icon -->
      <div
        v-if="showSuccess"
        class="absolute left-0 right-0 flex items-center justify-center"
        :style="{
          zIndex: 999999,
          top: 0,
          height: `${50 - 75 / 2}%`,
        }"
      >
        <div class="flex items-center gap-2">
          <p class="text-sm font-medium" style="color: #22c55e">Success!</p>
          <svg
            v-if="showCheckIcon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="animate-pulse"
          >
            <circle cx="12" cy="12" r="10" fill="#22C55E" />
            <path
              d="m9 12 2 2 4-4"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <!-- Debug YAW Display (remove in production) -->
      <!-- <div
                v-if="isActive && !showSuccess"
                class="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs font-mono"
                :style="{ zIndex: 999999 }"
            >
                <div>YAW: {{ yawPosition.toFixed(1) }}°</div>
                <div>Centered: {{ isFaceCentered ? 'Yes' : 'No' }}</div>
                <div>
                    Left Target: {{ leftTargetReached ? '✓' : '✗' }} ({{ TARGET_YAW_DEGREES }}°)
                </div>
                <div>
                    Right Target: {{ rightTargetReached ? '✓' : '✗' }} ({{ TARGET_YAW_DEGREES }}°)
                </div>
            </div> -->

      <div
        v-if="isActive"
        class="bg-green-300 rounded-full h-6 w-6 absolute bottom-2 right-2 z-10 flex items-center justify-center"
      >
        <span class="text-xs font-semibold">{{ countdown }}</span>
      </div>
    </div>
  </div>
  <div class="text-center">
    <p class="text-sm font-normal text-dark-body mb-6">
      Center your face within the oval. Keep still and look directly into the camera.
    </p>
    <button @click="startVerification">Start Verification</button>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed, watch } from 'vue'
import { useLivenessActor, useStreamUtils } from 'ui-vue-liveness'

const emits = defineEmits(['displayError'])

const props = defineProps({
  hasInitialized: {
    type: Boolean,
    default: false,
  },
  faceState: {
    type: Object,
    default: {},
  },
})

// Refs for video and canvas elements
// const videoRef = ref(null); // [info]: we will be using the videoRef provided by package
const canvasRef = ref(null)
const freshnessColorRef = ref(null)

// State management
const isActive = ref(false)
const showSuccess = ref(false)
const showCheckIcon = ref(false)
const leftLineVisible = ref(false)
const rightLineVisible = ref(false)
const headTrackingData = ref([])
const isLoading = ref(false)
const leftTargetReached = ref(false)
const rightTargetReached = ref(false)
const bothTargetsComplete = ref(false)
const isFaceCentered = ref(false)
const countdown = ref(20)
let countdownInterval = null

// YAW tracking constants
const TARGET_YAW_DEGREES = 20 // Target angle for left (-15) and right (+15)

// Animation frame for YAW tracking
let animationFrameId = null

const { state, send } = useLivenessActor()
const { videoRef, videoWidth, videoHeight } = useStreamUtils()

const mediaWidth = ref(videoWidth.value)
const mediaHeight = ref(videoHeight.value)
const aspectRatio = computed(() =>
  mediaWidth.value && mediaHeight.value ? mediaWidth.value / mediaHeight.value : 0,
)
const isUploading = computed(() => state?.value?.value?.uploading === 'waitForDisconnectEvent')

// Video recording state
let mediaRecorder = null
let recordedChunks = []
const isRecording = ref(false)

// Get video stream from the video element
const captureStream = () => {
  if (videoRef.value && videoRef.value.srcObject) {
    return videoRef.value.srcObject
  }
  return null
}

// Start video recording
const startVideoRecording = () => {
  const videoStream = captureStream()
  if (!videoStream) {
    console.log('No video stream available for recording')
    return
  }

  recordedChunks = []

  // Configure for AWS Rekognition compatibility: H.264 codec in MP4 container
  let options = { mimeType: 'video/mp4; codecs="avc1.424028"' } // H.264 baseline profile

  // Fallback options that are AWS Rekognition compatible
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/mp4; codecs="avc1.42E01E"' } // H.264 baseline profile alternative
  }
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/mp4' } // Generic MP4
  }
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/webm; codecs="vp8"' } // VP8 as last resort (may need server-side conversion)
  }

  mediaRecorder = new MediaRecorder(videoStream, options)

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  }

  mediaRecorder.onstop = () => {
    console.log('Video recording stopped')
  }

  mediaRecorder.start()
  isRecording.value = true
  console.log('Video recording started')
}

// Reset all yaw-related values
const resetYawValues = () => {
  leftTargetReached.value = false
  rightTargetReached.value = false
  bothTargetsComplete.value = false
  leftLineVisible.value = false
  rightLineVisible.value = false
  headTrackingData.value = []
  isFaceCentered.value = false
  isActive.value = false
  props.faceState.yawValues = {
    left: 0,
    right: 0,
  }
}

// Stop video recording
const stopVideoRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
    console.log('Stopped video recording')
    // Reset yaw values when recording stops
    resetYawValues()
  }
}

// Create video file from recorded chunks
const createVideoFile = () => {
  const blob = new Blob(recordedChunks, {
    type: 'video/mp4',
  })
  return new File([blob], `face-verification-${Date.now()}.mp4`, {
    type: 'video/mp4',
  })
}

// Get video file (exposed function)
const getVideoFile = () => {
  stopVideoRecording()
  return createVideoFile()
}

// Watch for hasInitialized to start recording
watch(
  () => props.hasInitialized,
  (newValue) => {
    if (newValue && !isRecording.value) {
      countdown.value = 20
      countdownInterval = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownInterval)
          countdownInterval = null
          emits('displayError', 'took too long')
        }
      }, 1000)

      console.log('hasInitialized became true, starting video recording...')
      startVideoRecording()
    }
  },
  { immediate: true },
)

// Face detection setup
const setupFaceDetection = async () => {
  try {
    send({ type: 'INIT_CAMERA' })
  } catch (error) {
    console.error('Error accessing camera:', error)
    isLoading.value = false
  }
}

// YAW tracking using parent component values
const startYawTracking = () => {
  const trackYaw = () => {
    if (!isActive.value || !videoRef.value) return

    try {
      // Use yaw values from parent component
      isFaceCentered.value = props.faceState.isCentered

      let processedYaw = 0
      let leftReached = false
      let rightReached = false

      // Always process yaw values when available, but only count targets when face is properly positioned
      if (props.faceState.yawValues) {
        // Check if left yaw reaches the threshold (negative TARGET_YAW_DEGREES)
        if (props.faceState.yawValues.left !== undefined) {
          // Only count as reached if face is centered and not too far
          if (props.faceState.isCentered && !props.faceState.isTooFar) {
            leftReached = props.faceState.yawValues.left >= TARGET_YAW_DEGREES
          }
        }
        // Check if right yaw reaches the threshold (positive TARGET_YAW_DEGREES)
        if (props.faceState.yawValues.right !== undefined) {
          // Only count as reached if face is centered and not too far
          if (props.faceState.isCentered && !props.faceState.isTooFar) {
            rightReached = props.faceState.yawValues.right >= TARGET_YAW_DEGREES
          }
        }

        // Update target states - once reached, stays true
        if (leftReached && !leftTargetReached.value) {
          leftTargetReached.value = true
          leftLineVisible.value = true
        }
        if (rightReached && !rightTargetReached.value) {
          rightTargetReached.value = true
          rightLineVisible.value = true
        }
      }

      // Check if both targets are complete
      const bothComplete =
        (leftTargetReached.value || leftReached) && (rightTargetReached.value || rightReached)
      if (bothComplete && !bothTargetsComplete.value) {
        bothTargetsComplete.value = true

        // Send HANDLE_CHALLENGE event after both targets are achieved
        setTimeout(() => {
          send({ type: 'HANDLE_CHALLENGE' })
        }, 500)
      }

      // Store tracking data
      const trackingPoint = {
        timestamp: Date.now(),
        yaw: processedYaw,
        leftTargetReached: leftTargetReached.value || leftReached,
        rightTargetReached: rightTargetReached.value || rightReached,
        bothComplete,
        faceCentered: isFaceCentered.value,
      }

      headTrackingData.value.push(trackingPoint)

      // Keep only last 50 readings for performance
      if (headTrackingData.value.length > 50) {
        headTrackingData.value = headTrackingData.value.slice(-50)
      }
    } catch (error) {
      console.error('YAW tracking error:', error)
    }

    if (isActive.value) {
      animationFrameId = requestAnimationFrame(trackYaw)
    }
  }

  trackYaw()
}

// Computed properties for dynamic styling and states
const getVideoStyles = () => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: 'scaleX(-1)', // Mirror video
  display: 'block',
  visibility: 'visible',
  opacity: '1',
  zIndex: '1',
})

const getOverlayScale = () => 1

const getStrokeColor = () => {
  if (!props.faceState.isCentered) {
    return headTrackingData.value.length > 0 ? '#F59E0B' : '#6B7280'
  }
  return '#FFFFFF'
}

const getLeftTurnOpacity = () => {
  if (!props.faceState.isCentered) return 0
  // Show progressive opacity based on actual yaw value
  if (props.faceState.yawValues?.left !== undefined) {
    const leftYaw = Math.abs(props.faceState.yawValues.left)
    return Math.min(1, leftYaw / TARGET_YAW_DEGREES)
  }
  return 0
}

const getRightTurnOpacity = () => {
  if (!props.faceState.isCentered) return 0
  // Show progressive opacity based on actual yaw value
  if (props.faceState.yawValues?.right !== undefined) {
    const rightYaw = Math.abs(props.faceState.yawValues.right)
    return Math.min(1, rightYaw / TARGET_YAW_DEGREES)
  }
  return 0
}

// Prompt states based on YAW tracking
const showFramePrompt = computed(() => {
  return !props.faceState.isCentered && headTrackingData.value.length > 0
})

const showLeftPrompt = computed(() => {
  if (showFramePrompt.value || showSuccess.value) return false

  // Show initial prompt when face is centered but no targets achieved
  if (props.faceState.isCentered && !leftTargetReached.value && !rightTargetReached.value) {
    return true // Show "Turn your head" initially
  }
  // Show "Look left" when right target achieved but left not yet
  else if (rightTargetReached.value && !leftTargetReached.value) {
    return true
  }
  return false
})

const showRightPrompt = computed(() => {
  if (showFramePrompt.value || showLeftPrompt.value || showSuccess.value) return false
  // Show "Look right" when left target achieved but right not yet
  return leftTargetReached.value && !rightTargetReached.value && props.faceState.isCentered
})

const getLeftPromptText = () => {
  if (props.faceState.isCentered && props.faceState.isTooFar) {
    return 'Too far'
  } else if (props.faceState.isCentered && !leftTargetReached.value && !rightTargetReached.value) {
    return '← Turn your head →'
  } else if (rightTargetReached.value && !leftTargetReached.value) {
    return '← Look left'
  }
  return ''
}

const handleMediaPlay = () => {
  isActive.value = true
  isLoading.value = false
  startYawTracking()

  send({
    type: 'SET_DOM_AND_CAMERA_DETAILS',
    data: {
      videoEl: videoRef.value,
      canvasEl: canvasRef.value,
      freshnessColorEl: freshnessColorRef.value,
      isMobile: true,
    },
  })

  if (videoRef.value) {
    mediaWidth.value = videoRef.value.videoWidth
    mediaHeight.value = videoRef.value.videoHeight

    send({
      type: 'BEGIN',
    })
  }
}

// Start verification function
const startVerification = () => {
  isLoading.value = true
  setupFaceDetection()
}

watch(
  () => isUploading.value,
  () => {
    if (isUploading.value) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }

      // Stop video recording when uploading starts
      stopVideoRecording()
    }
  },
)

// Lifecycle hooks
onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  if (countdownInterval) {
    clearInterval(countdownInterval)
  }

  // Stop video recording
  stopVideoRecording()

  // Clean up video stream
  if (videoRef.value && videoRef.value.srcObject) {
    videoRef.value.srcObject.getTracks().forEach((track) => track.stop())
  }

  isActive.value = false

  // Reset all yaw values on unmount
  resetYawValues()
})

// Expose function for parent component
defineExpose({
  getVideoFile,
})
</script>

<style></style>
