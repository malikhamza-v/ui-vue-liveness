<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { classNames } from '@aws-amplify/ui'

import {
  FaceMatchState,
  clearOvalCanvas,
  drawStaticOval,
  FACE_MOVEMENT_CHALLENGE,
} from '../service'
import type {
  InstructionDisplayText,
  ErrorDisplayText,
  HintDisplayText,
  StreamDisplayText,
  CameraDisplayText,
} from '../displayText'

import { useLivenessActor, useLivenessSelector, useStreamUtils } from '../composables'
import {
  Hint,
  Overlay,
  selectErrorState,
  MatchIndicator,
  DefaultPhotosensitiveWarning,
  DefaultCancelButton,
  DefaultRecordingIcon,
} from '../shared'
import FaceLivenessErrorModal from '../shared/FaceLivenessErrorModal.vue'
import type { FaceLivenessDetectorComponents } from '../shared/DefaultStartScreenComponents'
import { LivenessClassNames } from '../types/classNames'
import { isDeviceUserFacing } from '../utils/device'
import CameraSelector from './CameraSelector.vue'
import {
  selectChallengeType,
  selectVideoConstraints,
  selectFaceMatchPercentage,
  selectFaceMatchState,
  selectSelectedDeviceId,
  selectSelectableDevices,
} from './selectors'

interface LivenessCameraModuleProps {
  isMobileScreen: boolean
  isRecordingStopped: boolean
  instructionDisplayText: Required<InstructionDisplayText>
  streamDisplayText: Required<StreamDisplayText>
  hintDisplayText: Required<HintDisplayText>
  errorDisplayText: Required<ErrorDisplayText>
  cameraDisplayText: Required<CameraDisplayText>
  components?: FaceLivenessDetectorComponents
  testId?: string
}

const props = defineProps<LivenessCameraModuleProps>()

const { cancelLivenessCheckText, recordingIndicatorText } = props.streamDisplayText

const { ErrorView = FaceLivenessErrorModal, PhotosensitiveWarning = DefaultPhotosensitiveWarning } =
  props.components ?? {}

const { state, send } = useLivenessActor()

const challengeType = useLivenessSelector(selectChallengeType)
const isFaceMovementChallenge = computed(() => challengeType.value === FACE_MOVEMENT_CHALLENGE.type)

const videoConstraints = useLivenessSelector(selectVideoConstraints)
const selectedDeviceId = useLivenessSelector(selectSelectedDeviceId)
const selectableDevices = useLivenessSelector(selectSelectableDevices)

const faceMatchPercentage = useLivenessSelector(selectFaceMatchPercentage)
const faceMatchState = useLivenessSelector(selectFaceMatchState)
const errorState = useLivenessSelector(selectErrorState)
const { videoRef, videoWidth, videoHeight, videoStream } = useStreamUtils()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const freshnessColorRef = ref<HTMLCanvasElement | null>(null)

const isCameraReady = ref<boolean>(false)
const isMetadataLoaded = ref<boolean>(false)
const isCameraUserFacing = ref<boolean>(true)

const isInitCamera = computed(() => state.value.matches('initCamera'))
const isInitWebsocket = computed(() => state.value.matches('initWebsocket'))
const isCheckingCamera = computed(() => state.value.matches({ initCamera: 'cameraCheck' }))
const isWaitingForCamera = computed(() =>
  state.value.matches({
    initCamera: 'waitForDOMAndCameraDetails',
  }),
)
const isWaitingForChallenge = computed(() =>
  state.value.matches({ recording: 'waitForChallengeEvent' }),
)
const isStartView = computed(
  () => state.value.matches('start') || state.value.matches('userCancel'),
)
const isDetectFaceBeforeStart = computed(() => state.value.matches('detectFaceBeforeStart'))
const isRecording = computed(() => state.value.matches('recording'))
const isCheckSucceeded = computed(() => state.value.matches('checkSucceeded'))
const isFlashingFreshness = computed(() =>
  state.value.matches({
    recording: 'flashFreshnessColors',
  }),
)

watch(
  () => isWaitingForChallenge.value,
  () => {
    if (isWaitingForChallenge.value) {
      send({ type: 'HANDLE_CHALLENGE' })
    }
  },
)

// Android/Firefox and iOS flip the values of width/height returned from
// getUserMedia, so we'll reset these with the videoRef
// element's intrinsic videoWidth and videoHeight attributes
const mediaWidth = ref(videoWidth.value)
const mediaHeight = ref(videoHeight.value)
const aspectRatio = computed(() =>
  mediaWidth.value && mediaHeight.value ? mediaWidth.value / mediaHeight.value : 0,
)

// Only mobile device camera selection for no light challenge
const hasMultipleDevices = computed(
  () => !!selectableDevices.value?.length && selectableDevices.value.length > 1,
)
const allowDeviceSelection = computed(
  () =>
    isStartView.value &&
    hasMultipleDevices.value &&
    (!props.isMobileScreen || isFaceMovementChallenge.value),
)

const showMatchIndicatorStates = [
  FaceMatchState.TOO_FAR,
  FaceMatchState.CANT_IDENTIFY,
  FaceMatchState.FACE_IDENTIFIED,
  FaceMatchState.OFF_CENTER,
]

const shouldShowCenteredLoader = computed(() => isInitCamera.value || isInitWebsocket.value)

// We don't show full screen camera on the pre check screen (isStartView/isWaitingForCamera)
const shouldShowFullScreenCamera = computed(
  () => props.isMobileScreen && !isStartView.value && !shouldShowCenteredLoader.value,
)

const checkCameraFacing = async () => {
  const isUserFacing = await isDeviceUserFacing(selectedDeviceId.value)
  isCameraUserFacing.value = isUserFacing
}

watch(selectedDeviceId, () => {
  checkCameraFacing()
})

const drawOval = () => {
  const shouldDrawOval =
    canvasRef.value &&
    videoRef.value &&
    videoStream.value &&
    isStartView.value &&
    isMetadataLoaded.value

  if (shouldDrawOval && canvasRef.value && videoStream.value) {
    drawStaticOval(canvasRef.value, videoRef.value!, videoStream.value)
  }
}

watch([videoRef, videoStream, isStartView, isMetadataLoaded], () => {
  nextTick(() => {
    drawOval()
  })
})

const updateColorModeHandler = (e: MediaQueryListEvent) => {
  if (e.matches) {
    nextTick(() => {
      drawOval()
    })
  }
}

let darkModePreference: MediaQueryList
let lightModePreference: MediaQueryList

onMounted(() => {
  darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
  lightModePreference = window.matchMedia('(prefers-color-scheme: light)')

  darkModePreference.addEventListener('change', updateColorModeHandler)
  lightModePreference.addEventListener('change', updateColorModeHandler)
})

onUnmounted(() => {
  if (darkModePreference) {
    darkModePreference.removeEventListener('change', updateColorModeHandler)
  }
  if (lightModePreference) {
    lightModePreference.removeEventListener('change', updateColorModeHandler)
  }
})

watch(
  [isCameraReady, () => props.isMobileScreen],
  () => {
    if (isCameraReady.value) {
      send({
        type: 'SET_DOM_AND_CAMERA_DETAILS',
        data: {
          videoEl: videoRef.value,
          canvasEl: canvasRef.value,
          freshnessColorEl: freshnessColorRef.value,
          isMobile: props.isMobileScreen,
        },
      })
    }

    if (videoRef.value) {
      mediaWidth.value = videoRef.value.videoWidth
      mediaHeight.value = videoRef.value.videoHeight
    }
  },
  { immediate: true },
)

watch(isDetectFaceBeforeStart, () => {
  if (isDetectFaceBeforeStart.value) {
    clearOvalCanvas({ canvas: canvasRef.value! })
  }
})

const photoSensitivityWarning = computed(() => {
  return !isFaceMovementChallenge.value
})

const handleMediaPlay = () => {
  isCameraReady.value = true
}

const handleLoadedMetadata = () => {
  isMetadataLoaded.value = true
}

const beginLivenessCheck = () => {
  send({
    type: 'BEGIN',
  })
}

const onCameraChange = async (e: Event) => {
  const target = e.target as HTMLSelectElement
  const newDeviceId = target.value

  const changeCamera = async () => {
    isMetadataLoaded.value = false
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        ...videoConstraints.value,
        deviceId: { exact: newDeviceId },
      },
      audio: false,
    })
    // [IGNORE]
    send({
      type: 'UPDATE_DEVICE_AND_STREAM',
      data: { newDeviceId, newStream },
    })
  }
  changeCamera()
}
</script>

<template>
  <!-- Checking camera permission loading state -->
  <div
    v-if="isCheckingCamera"
    :class="
      classNames(
        'amplify-flex',
        'amplify-flex--justify-content-center',
        LivenessClassNames.StartScreenCameraWaiting,
      )
    "
  >
    <div
      :class="
        classNames('amplify-loader', 'amplify-loader--large', LivenessClassNames.CenteredLoader)
      "
      data-testid="centered-loader"
    >
      <div class="amplify-loader__icon"></div>
    </div>
    <div
      :class="
        classNames(
          'amplify-text',
          'amplify-text--fontSize-large',
          'amplify-text--fontWeight-bold',
          `${LivenessClassNames.StartScreenCameraWaiting}__text`,
        )
      "
      data-testid="waiting-camera-permission"
    >
      {{ cameraDisplayText.waitingCameraPermissionText }}
    </div>
  </div>

  <template v-else>
    <!-- Debug Panel (Remove in production) -->
    <div
      style="
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        font-size: 12px;
        z-index: 1000;
        border-radius: 4px;
      "
    >
      <div><strong>📷 Debug Info:</strong></div>
      <div>State: {{ state.value }}</div>
      <div>Has Stream: {{ !!videoStream }}</div>
      <div>Stream Tracks: {{ videoStream?.getTracks()?.length || 0 }}</div>
      <div>Camera Ready: {{ isCameraReady }}</div>
      <div>Metadata Loaded: {{ isMetadataLoaded }}</div>
      <div>Video Ref: {{ !!videoRef }}</div>
      <div>Video srcObject: {{ !!videoRef?.srcObject }}</div>
      <div>Video readyState: {{ videoRef?.readyState }}</div>
      <div>Video videoWidth: {{ videoRef?.videoWidth }}</div>
      <div>Video videoHeight: {{ videoRef?.videoHeight }}</div>
      <div>Media Size: {{ mediaWidth }}x{{ mediaHeight }}</div>
      <div>Video Size: {{ videoWidth }}x{{ videoHeight }}</div>
      <div>Video Classes: {{ videoRef?.className }}</div>
    </div>

    <!-- Photosensitive warning -->
    <div v-if="photoSensitivityWarning" :style="{ visibility: isStartView ? 'visible' : 'hidden' }">
      <PhotosensitiveWarning
        :body-text="instructionDisplayText.photosensitivityWarningBodyText"
        :heading-text="instructionDisplayText.photosensitivityWarningHeadingText"
        :info-text="instructionDisplayText.photosensitivityWarningInfoText"
        :label-text="instructionDisplayText.photosensitivityWarningLabelText"
      />
    </div>

    <!-- Connecting loader -->
    <div v-if="shouldShowCenteredLoader" :class="LivenessClassNames.ConnectingLoader">
      <div
        :class="classNames('amplify-loader', 'amplify-loader--large', LivenessClassNames.Loader)"
        data-testid="centered-loader"
      >
        <div class="amplify-loader__icon"></div>
      </div>
      <div :class="LivenessClassNames.LandscapeErrorModalHeader">
        {{ hintDisplayText.hintConnectingText }}
      </div>
    </div>

    <!-- Main camera module -->
    <div
      :class="
        classNames(
          LivenessClassNames.CameraModule,
          shouldShowFullScreenCamera && `${LivenessClassNames.CameraModule}--mobile`,
        )
      "
      :data-testid="testId"
    >
      <Overlay
        horizontal="center"
        :vertical="isRecording && !isFlashingFreshness ? 'start' : 'space-between'"
        :class="LivenessClassNames.InstructionOverlay"
      >
        <!-- Recording indicator -->
        <DefaultRecordingIcon
          v-if="isRecording"
          :recording-indicator-text="recordingIndicatorText"
        />

        <!-- Cancel button -->
        <DefaultCancelButton
          v-if="!isStartView && !isWaitingForCamera && !isCheckSucceeded"
          :cancel-liveness-check-text="cancelLivenessCheckText"
        />

        <!-- Hint component -->
        <div
          :class="
            classNames(
              LivenessClassNames.Hint,
              shouldShowFullScreenCamera && `${LivenessClassNames.Hint}--mobile`,
            )
          "
        >
          <Hint :hint-display-text="hintDisplayText" />
        </div>

        <!-- Error modal -->
        <component
          v-if="errorState"
          :is="ErrorView"
          @retry="() => send({ type: 'CANCEL' })"
          :display-text="errorDisplayText"
        />

        <!-- Match indicator -->
        <MatchIndicator
          v-if="
            isRecording &&
            !isFlashingFreshness &&
            showMatchIndicatorStates.includes(faceMatchState!)
          "
          :percentage="Math.ceil(faceMatchPercentage!)"
        />
      </Overlay>

      <!-- Freshness canvas (hidden) -->
      <canvas ref="freshnessColorRef" :class="LivenessClassNames.FreshnessCanvas" hidden />

      <!-- Video anchor container -->
      <div
        :class="LivenessClassNames.VideoAnchor"
        :style="{
          aspectRatio: `${aspectRatio}`,
          position: 'relative',
          width: '100%',
          minHeight: '400px',
          backgroundColor: '#000',
        }"
      >
        <!-- Video element -->
        <video
          ref="videoRef"
          muted
          autoplay
          playsinline
          :width="mediaWidth"
          :height="mediaHeight"
          @canplay="handleMediaPlay"
          @loadedmetadata="handleLoadedMetadata"
          @error="(e) => console.error('❌ Video error:', e)"
          @loadstart="() => console.log('📷 Video loadstart')"
          @loadeddata="() => console.log('📷 Video loadeddata')"
          @play="() => console.log('📷 Video play')"
          @playing="() => console.log('📷 Video playing')"
          data-testid="video"
          :class="
            classNames(
              LivenessClassNames.Video,
              isCameraUserFacing && LivenessClassNames.UserFacingVideo,
              isRecordingStopped && LivenessClassNames.FadeOut,
            )
          "
          :style="{
            display: 'block',
            visibility: 'visible',
            opacity: '1',
            zIndex: '1',
          }"
          :aria-label="cameraDisplayText.a11yVideoLabelText"
        />

        <!-- Oval canvas overlay -->
        <div
          :class="
            classNames(
              LivenessClassNames.OvalCanvas,
              shouldShowFullScreenCamera && `${LivenessClassNames.OvalCanvas}--mobile`,
              isRecordingStopped && LivenessClassNames.FadeOut,
            )
          "
        >
          <canvas ref="canvasRef" />
        </div>

        <!-- Camera selector -->
        <CameraSelector
          v-if="allowDeviceSelection"
          @select="onCameraChange"
          :devices="selectableDevices!"
          :device-id="selectedDeviceId"
        />
      </div>
    </div>

    <!-- Start button -->
    <div v-if="isStartView" class="amplify-flex amplify-flex--justify-content-center">
      <button
        class="amplify-button amplify-button--variation-primary"
        type="button"
        @click="beginLivenessCheck"
      >
        {{ instructionDisplayText.startScreenBeginCheckText }}
      </button>
    </div>
  </template>
</template>
