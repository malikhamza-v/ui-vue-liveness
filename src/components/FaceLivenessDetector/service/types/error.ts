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

/**
 * The liveness error states
 */

export const LivenessErrorState = {
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  TIMEOUT: 'TIMEOUT',
  RUNTIME_ERROR: 'RUNTIME_ERROR',
  FRESHNESS_TIMEOUT: 'FRESHNESS_TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  CAMERA_FRAMERATE_ERROR: 'CAMERA_FRAMERATE_ERROR',
  CAMERA_ACCESS_ERROR: 'CAMERA_ACCESS_ERROR',
  FACE_DISTANCE_ERROR: 'FACE_DISTANCE_ERROR',
  MOBILE_LANDSCAPE_ERROR: 'MOBILE_LANDSCAPE_ERROR',
  MULTIPLE_FACES_ERROR: 'MULTIPLE_FACES_ERROR',
} as const;

export type ErrorState = keyof typeof LivenessErrorState;
