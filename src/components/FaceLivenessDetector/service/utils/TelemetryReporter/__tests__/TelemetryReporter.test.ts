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

import {
  createTelemetryReporterMiddleware,
  TelemetryReporter,
} from '../TelemetryReporter';

describe('getAttemptCountAndUpdateTimestamp', () => {
  let localStore: any;

  beforeEach(() => {
    localStore = {};

    Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
      return key in localStore ? localStore[key] : null;
    });
    Storage.prototype.setItem = jest
      .fn()
      .mockImplementation((key, value) => (localStore[key] = value + ''));
    Storage.prototype.clear = jest
      .fn()
      .mockImplementation(() => (localStore = {}));
  });

  it('returns an attempt count of 1 on intitial call ', async () => {
    expect(TelemetryReporter.getAttemptCountAndUpdateTimestamp()).toBe(1);
  });

  it('returns an attempt count of 1 if timestamp is greater than 5 minutes ago', async () => {
    TelemetryReporter.timestamp = Date.now() - 600000;
    TelemetryReporter.attemptCount = 5;

    expect(TelemetryReporter.getAttemptCountAndUpdateTimestamp()).toBe(1);
  });

  it('returns an attempt count of 3 if timestamp is less than 5 minutes ago and count was at 2', async () => {
    TelemetryReporter.attemptCount = 2;
    expect(TelemetryReporter.getAttemptCountAndUpdateTimestamp()).toBe(3);
  });
});

describe('telemetryReporterMiddleware', () => {
  it('appends attempt count and pre check view enabled to query params', async () => {
    const middlewareResponse = await createTelemetryReporterMiddleware(
      1,
      true
    )(async (args) => {
      return {
        output: { SessionId: 'foobar', $metadata: {}, args },
        response: {},
      };
    })({
      request: { query: {} },
      input: {
        SessionId: '',
        VideoWidth: '',
        VideoHeight: '',
        ChallengeVersions: '',
      },
    });
    const query = (middlewareResponse.output as any).args.request.query;
    expect(query['attempt-count']).toBe('1');
    expect(query['precheck-view-enabled']).toBe('1');
  });
});
