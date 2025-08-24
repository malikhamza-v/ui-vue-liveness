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

export { default as CancelButton } from './CancelButton.vue'
export { default as ToastWithLoader } from './ToastWithLoader.vue'
export { default as Toast } from './Toast.vue'
export { default as RecordingIcon } from './RecordingIcon.vue'
export { default as Overlay } from './Overlay.vue'
export { default as MatchIndicator } from './MatchIndicator.vue'
export { default as LivenessIconWithPopover } from './LivenessIconWithPopover.vue'
export { default as LandscapeErrorModal } from './LandscapeErrorModal.vue'
export * from './FaceLivenessErrorModal.vue'
export { default as Hint } from './Hint.vue'
export { default as DefaultRecordingIcon } from './DefaultRecordingIcon.vue'
export * from './DefaultStartScreenComponents'
export { default as DefaultPhotosensitiveWarning } from './DefaultPhotosensitiveWarning.vue'
export { default as DefaultCancelButton } from './DefaultCancelButton.vue'

// Selectors
import { createLivenessSelector } from '../composables'

export const selectErrorState = createLivenessSelector(
  (state) => state.context.errorState
)
