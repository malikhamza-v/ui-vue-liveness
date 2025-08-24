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

import { SignatureV4 } from '@smithy/signature-v4';
import type {
  HttpRequest as HttpRequest,
  RequestPresigningArguments,
} from './types';

import { REQUEST_EXPIRY } from '../constants';

export class Signer extends SignatureV4 {
  public presign(
    request: HttpRequest,
    options?: Omit<RequestPresigningArguments, 'expiresIn'>
  ): Promise<HttpRequest> {
    return super.presign(request, {
      ...options,
      expiresIn: REQUEST_EXPIRY,
      // `headers` that should not be signed. Liveness WebSocket
      // request omits `headers` except for required `host` header. Signature
      // could be a mismatch if other `headers` are signed
      unsignableHeaders: new Set(
        Object.keys(request.headers).filter((header) => header !== 'host')
      ),
    });
  }
}
