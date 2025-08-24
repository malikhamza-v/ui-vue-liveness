import { fetchAuthSession } from 'aws-amplify/auth';
import type { AwsCredentialProvider, AwsCredentials } from '../../types';

const isValidCredentialsProvider = (
  credentialsProvider?: AwsCredentialProvider
): credentialsProvider is AwsCredentialProvider =>
  typeof credentialsProvider === 'function';

// the return interface of `fetchAuthSession` includes `credentials` as
// optional, but `credentials` is always returned. If `fetchAuthSession`
// is called for an unauthenticated end user, values of `accessKeyId`
// and `secretAccessKey` are `undefined`
const isCredentials = (
  credentials?: AwsCredentials | Record<keyof AwsCredentials, undefined>
): credentials is AwsCredentials =>
  !!(credentials?.accessKeyId && credentials?.secretAccessKey);

/**
 * Resolves the `credentials` param to be passed to `RekognitionStreamingClient` which accepts either:
 * - a `credentials` object
 * - a `credentialsProvider` callback
 *
 * @param credentialsProvider optional `credentialsProvider` callback
 * @returns {Promise<AwsCredentials | AwsCredentialProvider>} `credentials` object or valid `credentialsProvider` callback
 */
export async function resolveCredentials(
  credentialsProvider?: AwsCredentialProvider
): Promise<AwsCredentials | AwsCredentialProvider> {
  console.log('🔑 resolveCredentials: Called with', {
    hasCredentialsProvider: !!credentialsProvider,
    credentialsProviderType: typeof credentialsProvider
  })

  const hasValidCredentialsProvider =
    isValidCredentialsProvider(credentialsProvider);

  console.log('🔑 resolveCredentials: Validation result', {
    hasValidCredentialsProvider
  })

  // provided `credentialsProvider` is not valid
  if (credentialsProvider && !hasValidCredentialsProvider) {
    console.error('❌ resolveCredentials: Invalid credentialsProvider')
    throw new Error('Invalid credentialsProvider');
  }

  if (hasValidCredentialsProvider) {
    console.log('✅ resolveCredentials: Using provided credentialsProvider')
    return credentialsProvider;
  }

  console.log('⚠️ resolveCredentials: Falling back to fetchAuthSession')
  try {
    const result = (await fetchAuthSession()).credentials;
    console.log('===check results', result)
    if (isCredentials(result)) {
      return result;
    }

    throw new Error('Missing credentials');
  } catch (e) {
    const { message } = e as Error;
    console.error('❌ resolveCredentials: Failed to get credentials from fetchAuthSession:', message)
    throw new Error(`Invalid credentials: ${message}`);
  }
}
