import { isObject } from '@aws-amplify/ui'
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

  console.log('🎥 useMediaStreamInVideo: Initializing with dimensions', { height, width })

  watch(
    [stream, videoRef],
    ([newStream, videoElement]) => {
      console.log('🎥 useMediaStreamInVideo: Stream/VideoRef changed', {
        hasStream: !!newStream,
        hasVideoElement: !!videoElement,
        streamTracks: newStream?.getTracks()?.length || 0
      })

      if (newStream && videoElement) {
        console.log('🎥 useMediaStreamInVideo: Setting srcObject on video element')
        
        // Wait for next tick to ensure DOM is ready
        nextTick(() => {
          if (videoElement && newStream) {
            try {
              videoElement.srcObject = newStream
              console.log('✅ useMediaStreamInVideo: Successfully set srcObject')
              
              // Force video to load and play
              videoElement.load()
              videoElement.play().then(() => {
                console.log('✅ useMediaStreamInVideo: Video playing successfully')
              }).catch((error) => {
                console.error('❌ useMediaStreamInVideo: Error playing video:', error)
              })
              
            } catch (error) {
              console.error('❌ useMediaStreamInVideo: Error setting srcObject:', error)
            }
          }
        })

        const settings = newStream.getTracks()?.[0]?.getSettings()
        if (settings) {
          console.log('🎥 useMediaStreamInVideo: Updated video dimensions from track settings', settings)
          videoHeight.value = settings.height
          videoWidth.value = settings.width
        }
      } else if (!newStream) {
        console.log('🎥 useMediaStreamInVideo: No stream available')
      } else if (!videoElement) {
        console.log('🎥 useMediaStreamInVideo: No video element available')
      }
    },
    { immediate: true, flush: 'post' }
  )

  onUnmounted(() => {
    console.log('🎥 useMediaStreamInVideo: Cleaning up stream')
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
