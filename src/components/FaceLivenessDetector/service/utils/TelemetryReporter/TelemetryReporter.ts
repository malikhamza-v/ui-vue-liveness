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

import type {
  StartFaceLivenessSessionCommandInput,
  StartFaceLivenessSessionCommandOutput,
} from '@aws-sdk/client-rekognitionstreaming';
import type { HttpRequest } from '@smithy/protocol-http';
import type {
  BuildHandler,
  BuildHandlerArguments,
  BuildHandlerOutput,
} from '@smithy/types';

const DEFAULT_ATTEMPT_COUNT_TIMEOUT = 300000; // 5 minutes / 300000 ms

// Telemetry data is for internal use only and should not be depended upon or used by the customer
export class TelemetryReporter {
  static attemptCount = 0;
  static timestamp = Date.now();

  static getAttemptCountAndUpdateTimestamp(): number {
    const timeSinceLastAttempt = Date.now() - TelemetryReporter.timestamp;
    if (timeSinceLastAttempt > DEFAULT_ATTEMPT_COUNT_TIMEOUT) {
      TelemetryReporter.attemptCount = 1;
    } else {
      TelemetryReporter.attemptCount += 1;
    }

    TelemetryReporter.timestamp = Date.now();

    return TelemetryReporter.attemptCount;
  }
}

export const createTelemetryReporterMiddleware =
  (attemptCount: number, preCheckViewEnabled: boolean) =>
  (
    next: BuildHandler<
      StartFaceLivenessSessionCommandInput,
      StartFaceLivenessSessionCommandOutput
    >
  ) =>
  async (
    args: BuildHandlerArguments<StartFaceLivenessSessionCommandInput>
  ): Promise<BuildHandlerOutput<StartFaceLivenessSessionCommandOutput>> => {
    (args.request as HttpRequest).query['attempt-count'] =
      attemptCount.toString();
    (args.request as HttpRequest).query['precheck-view-enabled'] =
      preCheckViewEnabled ? '1' : '0';

    const result = await next(args);
    return result;
  };
