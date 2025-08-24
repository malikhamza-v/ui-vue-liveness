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
import { AwsCredentialIdentity, HttpRequest } from '@smithy/types';

import { REQUEST_EXPIRY } from '../../constants';
import { Signer } from '../Signer';

const signatureV4PresignSpy = jest
  .spyOn(SignatureV4.prototype, 'presign')
  .mockImplementation();

const credentials: AwsCredentialIdentity = {
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
};

describe('Signer.presign', () => {
  let signer: Signer;

  beforeEach(() => {
    signer = new Signer({
      region: 'region',
      credentials,
      sha256: jest.fn(),
      service: 'rekognition',
    });
    signatureV4PresignSpy.mockClear();
  });

  it('calls SignatureV4.presign with the expected value of expiresIn', () => {
    const request = { headers: { host: 'host' } } as unknown as HttpRequest;
    const unxpectedOptions = { expiresIn: 60 };

    // @ts-expect-error `expiresIn` is omitted from `signer.presign` options
    signer.presign(request, unxpectedOptions);

    const unsignableHeaders = new Set();
    const expectedOptions = { expiresIn: REQUEST_EXPIRY, unsignableHeaders };

    expect(signatureV4PresignSpy).toHaveBeenCalledWith(
      request,
      expectedOptions
    );
    expect(signatureV4PresignSpy).not.toHaveBeenCalledWith(
      request,
      unxpectedOptions
    );
  });

  it('filters host headers from unsignableHeaders passed to SignatureV4.presign', () => {
    const request = {
      headers: { host: 'host', notHost: 'notHost' },
    } as unknown as HttpRequest;

    signer.presign(request);

    const unsignableHeaders = new Set(['notHost']);
    const expectedOptions = { unsignableHeaders, expiresIn: REQUEST_EXPIRY };

    expect(signatureV4PresignSpy).toHaveBeenCalledWith(
      request,
      expectedOptions
    );
  });
});
