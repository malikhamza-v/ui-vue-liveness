import { inject } from 'vue';
import type {
  LivenessInterpreter,
  FaceLivenessDetectorProps,
} from '../service';

interface FaceLivenessDetectorContextType {
  componentProps: FaceLivenessDetectorProps;
  service: LivenessInterpreter;
}

// Import the injection key
import { FaceLivenessDetectorProviderKey } from './FaceLivenessDetectorProvider.vue';

export function useFaceLivenessDetector(): FaceLivenessDetectorContextType {
  const context = inject<FaceLivenessDetectorContextType>(FaceLivenessDetectorProviderKey);
  
  if (!context) {
    throw new Error(
      'useFaceLivenessDetector must be used within a FaceLivenessDetectorProvider'
    );
  }

  return context;
}