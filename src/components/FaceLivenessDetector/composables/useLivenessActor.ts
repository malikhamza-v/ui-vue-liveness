import { useActor } from '@xstate/vue'

import { useFaceLivenessDetector } from '../providers'

 
export function useLivenessActor() {
  const { service } = useFaceLivenessDetector()
  const actor = useActor(service)
  return actor
}
