/**
 * Copyright 2025 [name of copyright owner]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
