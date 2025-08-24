import { useLivenessSelector } from './useLivenessSelector'
import { useMediaStreamInVideo, type UseMediaStreamInVideo } from './useMediaStreamInVideo'
import { selectVideoStream } from '../LivenessCheck/selectors'
import type { Ref } from 'vue'

export interface UseStreamUtils extends UseMediaStreamInVideo {
  videoStream: Ref<MediaStream | undefined>
}

export function useStreamUtils(): UseStreamUtils {
  const videoStream = useLivenessSelector(selectVideoStream)
  const mediaStreamUtils = useMediaStreamInVideo(videoStream)
  
  return {
    ...mediaStreamUtils,
    videoStream,
  }
}