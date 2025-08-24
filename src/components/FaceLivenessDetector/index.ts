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

export { default as FaceLivenessDetector } from './FaceLivenessDetector.vue';
export { default as FaceLivenessDetectorCore } from './FaceLivenessDetectorCore.vue';
export type {
  AwsCredentialProvider,
  AwsTemporaryCredentials,
  AwsCredentials,
  ErrorState,
} from './service';
export {
  FACE_MOVEMENT_CHALLENGE,
  FACE_MOVEMENT_AND_LIGHT_CHALLENGE,
  SUPPORTED_CHALLENGES,
} from './service';

// Export all types that are needed for the component props
export type { FaceLivenessDetectorProps } from './types/FaceLivenessDetectorProps';
export type { FaceLivenessDetectorCoreProps } from './types/FaceLivenessDetectorCoreProps';
