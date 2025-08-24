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

import type { LivenessRequestStream } from '@aws-sdk/client-rekognitionstreaming';

import type { VideoStream } from '../types';
import { createVideoEvent } from './utils';

interface RequestStream extends AsyncGenerator<LivenessRequestStream> {}
type GetRequestStream = () => RequestStream;

/**
 * Creates an async generator that reads over the provided stream and yielding stream results
 *
 * @param {VideoStream} stream target video stream
 * @returns {GetRequestStream} async request stream generator
 */
export function createRequestStreamGenerator(stream: VideoStream): {
  getRequestStream: GetRequestStream;
} {
  const reader = stream.getReader();

  return {
    getRequestStream: async function* () {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }

        if (value.type === 'sessionInfo') {
          yield { ClientSessionInformationEvent: value.data };
        } else {
          // Unless value.type is closeCode we never want to send a 0 size video event as it signals end of stream
          if (value.type === 'streamVideo' && value.data.size < 1) continue;
          yield { VideoEvent: await createVideoEvent(value) };
        }
      }
    },
  };
}
