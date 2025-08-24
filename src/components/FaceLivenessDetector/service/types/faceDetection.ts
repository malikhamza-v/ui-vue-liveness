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

/**
 * The bounding box of a face.
 */
export interface Face {
  top: number;
  left: number;
  width: number;
  height: number;
  timestampMs: number;
  probability?: number;
  rightEye: Coordinate;
  leftEye: Coordinate;
  mouth: Coordinate;
  nose: Coordinate;
  rightEar: Coordinate;
  leftEar: Coordinate;
}

export type Coordinate = [number, number];

/**
 * The abstract class representing FaceDetection
 * to be implemented for different libraries.
 */
export abstract class FaceDetection {
  modelLoadingPromise!: Promise<void>;

  /**
   * Triggers the `loadModels` method and stores
   * the corresponding promise to be awaited later.
   */
  triggerModelLoading(): void {
    this.modelLoadingPromise = this.loadModels();
  }

  /**
   * Loads the face detection models.
   */
  abstract loadModels(): Promise<void>;

  /**
   * Detects the faces in the video element.
   * @param videoEl The video element to detect faces in.
   */
  abstract detectFaces(videoEl: HTMLVideoElement): Promise<Face[]>;
}
