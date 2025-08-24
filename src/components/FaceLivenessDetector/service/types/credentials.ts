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

import type { CredentialsAndIdentityId } from 'aws-amplify/auth';

export type AwsCredentials = CredentialsAndIdentityId['credentials'];

export interface IdentityProvider<IdentityT extends AwsCredentials> {
  (identityProperties?: Record<string, any>): Promise<IdentityT>;
}

/**
 * @deprecated `AwsTemporaryCredentials` has been replaced with `AwsCredentials`.
 *
 * The `AwsTemporaryCredentials` type may be removed in a future major version of _@aws-amplify/ui-react-liveness_.
 */
export interface AwsTemporaryCredentials extends AwsCredentials {
  readonly sessionToken?: string;
  readonly expiration?: Date;
}

export type AwsCredentialProvider = IdentityProvider<AwsCredentials>;
