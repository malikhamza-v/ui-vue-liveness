# ui-vue-liveness

A Vue 3 component library for face liveness detection using AWS Rekognition Streaming.

## Installation

```bash
npm install ui-vue-liveness
```

## Features

- 🎯 **Face Liveness Detection** - Real-time face verification using AWS Rekognition
- 🖥️ **Vue 3 Support** - Built for Vue 3 with Composition API
- 📱 **Mobile Friendly** - Responsive design with mobile camera support
- 🎨 **Customizable** - Flexible theming and component customization
- 🔒 **Secure** - AWS integration with secure credential handling
- 🌐 **TypeScript** - Full TypeScript support with type definitions

## Quick Start

### Basic Usage

```vue
<template>
  <FaceLivenessDetector
    :sessionId="sessionId"
    :region="awsRegion"
    :onAnalysisComplete="handleAnalysisComplete"
    :onError="handleError"
  />
</template>

<script setup lang="ts">
import { FaceLivenessDetector } from 'ui-vue-liveness'
import 'ui-vue-liveness/styles.css'

const sessionId = 'your-session-id'
const awsRegion = 'us-east-1'

const handleAnalysisComplete = async () => {
  console.log('Liveness detection completed!')
  // Fetch results from AWS Rekognition GetFaceLivenessSessionResults API
}

const handleError = (error) => {
  console.error('Liveness detection error:', error)
}
</script>
```

### Advanced Usage with Custom Configuration

```vue
<template>
  <FaceLivenessDetector
    :sessionId="sessionId"
    :region="awsRegion"
    :onAnalysisComplete="handleAnalysisComplete"
    :onUserCancel="handleUserCancel"
    :onError="handleError"
    :disableStartScreen="false"
    :config="livenessConfig"
    :components="customComponents"
    :displayText="customDisplayText"
  />
</template>

<script setup lang="ts">
import { FaceLivenessDetector } from 'ui-vue-liveness'
import type { FaceLivenessDetectorProps } from 'ui-vue-liveness'
import 'ui-vue-liveness/styles.css'

const livenessConfig = {
  binaryPath: 'https://your-cdn.com/wasm/',
  faceModelUrl: 'https://your-cdn.com/model.json'
}

const customComponents = {
  PhotosensitiveWarning: YourCustomWarningComponent
}

const customDisplayText = {
  cameraMinSpecificationsHeadingText: 'Camera Requirements',
  goodFitCaptionText: 'Good lighting detected'
  // ... other customizable text
}

// ... rest of component logic
</script>
```

## Core Components

### FaceLivenessDetector

The main component that provides an easy-to-use interface with AWS Amplify integration.

**Props:**
- `sessionId` (string, required) - Session ID from AWS CreateStreamingLivenessSession API
- `region` (string, required) - AWS region for the Rekognition service
- `onAnalysisComplete` (function, required) - Callback when analysis completes
- `onUserCancel` (function, optional) - Callback when user cancels
- `onError` (function, optional) - Error handling callback
- `disableStartScreen` (boolean, optional) - Skip the start screen
- `config` (object, optional) - Advanced configuration options
- `components` (object, optional) - Custom component overrides
- `displayText` (object, optional) - Custom text and labels

### FaceLivenessDetectorCore

Lower-level component for advanced use cases requiring custom credential providers.

**Additional Props:**
- `config.credentialProvider` (function, required) - Custom AWS credential provider

## Composables

### useLivenessActor

Access the XState actor for advanced state management:

```typescript
import { useLivenessActor } from 'ui-vue-liveness'

const { state, send } = useLivenessActor()
```

### useLivenessSelector

Select specific state values:

```typescript
import { useLivenessSelector } from 'ui-vue-liveness'

const isRecording = useLivenessSelector((state) => state.matches('recording'))
```

### useMediaStreamInVideo

Handle media stream in video elements:

```typescript
import { useMediaStreamInVideo } from 'ui-vue-liveness'

const { videoRef, stream } = useMediaStreamInVideo()
```

## Styling

Import the default styles:

```typescript
import 'ui-vue-liveness/styles.css'
```

Or customize with your own CSS by targeting the component classes.

## AWS Setup

1. Create a liveness session using AWS Rekognition:

```javascript
import { RekognitionClient, CreateStreamingLivenessSessionCommand } from '@aws-sdk/client-rekognition'

const client = new RekognitionClient({ region: 'us-east-1' })
const command = new CreateStreamingLivenessSessionCommand({})
const response = await client.send(command)
const sessionId = response.SessionId
```

2. Pass the `sessionId` to the component
3. Handle the `onAnalysisComplete` callback to fetch results

## Browser Compatibility

- Chrome 78+
- Firefox 72+
- Safari 14+
- Edge 79+

Requires WebRTC support and camera permissions.

## TypeScript Support

This package includes comprehensive TypeScript definitions. Import types as needed:

```typescript
import type { 
  FaceLivenessDetectorProps,
  FaceLivenessDetectorCoreProps,
  AwsCredentials,
  ErrorState
} from 'ui-vue-liveness'
```

## License

MIT

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Support

For issues and feature requests, please visit our [GitHub Issues](https://github.com/yourusername/ui-vue-liveness/issues).