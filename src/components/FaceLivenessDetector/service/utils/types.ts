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

import type {
  ClientSessionInformationEvent,
  LivenessRequestStream,
} from '@aws-sdk/client-rekognitionstreaming';

export interface RequestStream extends AsyncGenerator<LivenessRequestStream> {}
export interface VideoStream extends ReadableStream<StreamResult> {}

export type StreamResultType =
  | 'closeCode'
  | 'sessionInfo'
  | 'streamStop'
  | 'streamVideo';

export type StreamResult<T extends StreamResultType = StreamResultType> =
  T extends 'closeCode'
    ? { type: T; data: { closeCode: number } }
    : T extends 'streamVideo'
    ? { type: T; data: Blob }
    : T extends 'sessionInfo'
    ? { type: T; data: ClientSessionInformationEvent }
    : T extends 'streamStop'
    ? { type: T; data?: never }
    : never;
