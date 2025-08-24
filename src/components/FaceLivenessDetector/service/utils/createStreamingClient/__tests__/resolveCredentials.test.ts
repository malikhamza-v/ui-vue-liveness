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

import * as AuthModule from 'aws-amplify/auth';

import { resolveCredentials } from '../resolveCredentials';
import { AwsCredentialProvider, AwsCredentials } from '../../../types';

const fetchAuthSessionSpy = jest.spyOn(AuthModule, 'fetchAuthSession');

const credentials: AwsCredentials = {
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
};

describe('resolveCredentials', () => {
  it('behaves as expected when provided a `credentialsProvider` param', async () => {
    const credentialsProvider: AwsCredentialProvider = async () =>
      Promise.resolve(credentials);

    const result = await resolveCredentials(credentialsProvider);
    expect(result).toBe(credentialsProvider);
  });

  it('it throws when provided an invalid `credentialsProvider` param', () => {
    // @ts-expect-error intentional invalid return
    const credentialsProvider: AwsCredentialProvider = 'credentials';

    expect(
      async () => await resolveCredentials(credentialsProvider)
    ).rejects.toThrow('Invalid credentialsProvider');
  });

  it('behaves as expected when not provided a `credentialsProvider` param', async () => {
    fetchAuthSessionSpy.mockResolvedValueOnce({ credentials });
    const result = await resolveCredentials();

    expect(result).toStrictEqual(credentials);
  });

  it('behaves as expected when `fetchAuthSession` returns `undefined` values for `accessKeyId` and `secretAccessKey`', async () => {
    fetchAuthSessionSpy.mockResolvedValueOnce({
      // @ts-expect-error
      // `fetchAuthSessionSpy` returns `undefined` values for `accessKeyId` and `secretAccessKey`
      // when called without an authenitcated end user
      credentials: { accessKeyId: undefined, secretAccessKey: undefined },
    });

    expect(async () => await resolveCredentials()).rejects.toThrow(
      'Missing credentials'
    );
  });
});
