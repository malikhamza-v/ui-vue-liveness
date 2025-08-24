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

import { STATIC_VIDEO_CONSTRAINTS } from '../utils/helpers'
import { onUnmounted, ref, watch, nextTick, type Ref } from 'vue'

export interface UseMediaStreamInVideo {
  videoRef: Ref<HTMLVideoElement | null>
  videoHeight: Ref<number | undefined>
  videoWidth: Ref<number | undefined>
}

export function useMediaStreamInVideo(stream: Ref<MediaStream | undefined>): UseMediaStreamInVideo {
  const height = (STATIC_VIDEO_CONSTRAINTS.height as ConstrainULongRange).ideal
  const width = (STATIC_VIDEO_CONSTRAINTS.width as ConstrainULongRange).ideal

  const videoRef = ref<HTMLVideoElement | null>(null)
  const videoHeight = ref<ConstrainULongRange['ideal']>(height)
  const videoWidth = ref<ConstrainULongRange['ideal']>(width)

  watch(
    [stream, videoRef],
    ([newStream, videoElement]) => {
      if (newStream && videoElement) {
        // Wait for next tick to ensure DOM is ready
        nextTick(() => {
          if (videoElement && newStream) {
            try {
              videoElement.srcObject = newStream

              // Force video to load and play
              videoElement.load()
              videoElement.play()
            } catch (error) {
              console.error('❌ useMediaStreamInVideo: Error setting srcObject:', error)
            }
          }
        })

        const settings = newStream.getTracks()?.[0]?.getSettings()
        if (settings) {
          videoHeight.value = settings.height
          videoWidth.value = settings.width
        }
      } else if (!newStream) {
        console.error('🎥 useMediaStreamInVideo: No stream available')
      } else if (!videoElement) {
        console.error('🎥 useMediaStreamInVideo: No video element available')
      }
    },
    { immediate: true, flush: 'post' },
  )

  onUnmounted(() => {
    if (stream.value) {
      stream.value.getTracks().forEach((track) => {
        stream.value!.removeTrack(track)
        track.stop()
      })
    }
  })

  return {
    videoRef,
    videoHeight,
    videoWidth,
  }
}
