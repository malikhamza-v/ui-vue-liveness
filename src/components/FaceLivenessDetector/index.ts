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