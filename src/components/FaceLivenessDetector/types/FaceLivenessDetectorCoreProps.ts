import type { FaceLivenessDetectorCoreProps as FaceLivenessDetectorPropsFromUi } from '../service';
import type { LivenessDisplayText } from '../displayText';
import type { FaceLivenessDetectorComponents } from './FaceLivenessDetectorProps';

export interface FaceLivenessDetectorCoreProps
  extends FaceLivenessDetectorPropsFromUi {
  components?: FaceLivenessDetectorComponents;
  displayText?: LivenessDisplayText;
}