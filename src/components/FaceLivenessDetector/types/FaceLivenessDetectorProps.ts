import type { FaceLivenessDetectorProps as FaceLivenessDetectorPropsFromUi } from '../service';
import type { LivenessDisplayText } from '../displayText';

export interface FaceLivenessDetectorComponents {
  PhotosensitiveWarning?: any;
}

export interface FaceLivenessDetectorProps
  extends FaceLivenessDetectorPropsFromUi {
  components?: FaceLivenessDetectorComponents;
  displayText?: LivenessDisplayText;
}