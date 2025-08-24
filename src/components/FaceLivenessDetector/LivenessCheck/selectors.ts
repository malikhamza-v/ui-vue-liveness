import { createLivenessSelector } from '../composables'

export const selectChallengeType = createLivenessSelector(
  (state) => state.context.parsedSessionInformation?.Challenge?.Name
)

export const selectVideoConstraints = createLivenessSelector(
  (state) => state.context.videoAssociatedParams?.videoConstraints
)

export const selectVideoStream = createLivenessSelector(
  (state) => state.context.videoAssociatedParams?.videoMediaStream
)

export const selectFaceMatchPercentage = createLivenessSelector(
  (state) => state.context.faceMatchAssociatedParams?.faceMatchPercentage
)

export const selectFaceMatchState = createLivenessSelector(
  (state) => state.context.faceMatchAssociatedParams?.faceMatchState
)

export const selectSelectedDeviceId = createLivenessSelector(
  (state) => state.context.videoAssociatedParams?.selectedDeviceId
)

export const selectSelectableDevices = createLivenessSelector(
  (state) => state.context.videoAssociatedParams?.selectableDevices
)

export const selectIsRecordingStopped = createLivenessSelector(
  (state) => state.context.isRecordingStopped
)