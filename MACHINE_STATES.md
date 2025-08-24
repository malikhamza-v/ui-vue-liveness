# AWS Rekognition Liveness Machine States

This document outlines the state machine flow for the AWS Rekognition Face Liveness detection process.

## State Flow Sequence

The machine progresses through the following states in sequence:

### 1. Idle State
```
idle
```

**Purpose**: Initial state waiting for manual initialization
- Machine starts in idle state and waits for `INIT_WEBSOCKET` event
- No automatic processing occurs until manually triggered
- Use `send({ type: 'INIT_WEBSOCKET' })` to begin the liveness flow

### 2. WebSocket Initialization
```
initWebsocket
├── initializeLivenessStream
└── waitForSessionInfo
```

**Purpose**: Establish connection to AWS Rekognition streaming service
- Creates streaming client with AWS credentials
- Opens WebSocket connection
- Waits for session information from AWS (Challenge config, colors, etc.)

### 3. Pre-Recording Setup
```
start → detectFaceBeforeStart → checkFaceDetectedBeforeStart
```

**Purpose**: Ensure a single face is detected before starting recording
- Initializes face detection model (BlazeFace)
- Detects and validates single face presence
- Prevents starting with no face or multiple faces

### 4. Face Distance Validation
```
detectFaceDistanceBeforeRecording → checkFaceDistanceBeforeRecording
```

**Purpose**: Ensure face is at appropriate distance from camera
- Validates face is not too close or too far
- Uses challenge configuration thresholds
- Prevents poor quality recordings

### 5. Recording Phase
```
recording
├── ovalDrawing
├── checkFaceDetected
├── cancelOvalDrawingTimeout
├── checkRecordingStarted
├── ovalMatching
├── checkMatch
├── handleChallenge ←── [DEBUG_FORCE_HANDLE_CHALLENGE triggers here]
│   ├── delayBeforeFlash (for FaceMovementAndLightChallenge)
│   ├── flashFreshnessColors
│   └── success (for FaceMovementChallenge)
└── success
```

**Purpose**: The main recording and challenge execution phase
- **ovalDrawing**: Draws the face oval guide on canvas
- **ovalMatching**: Continuously matches face position to oval
- **handleChallenge**: Determines challenge type and executes it
  - **FaceMovementChallenge**: Goes directly to success
  - **FaceMovementAndLightChallenge**: Shows color flashes then success
- **flashFreshnessColors**: Displays color sequences for liveness validation

### 6. Upload and Completion
```
uploading
├── pending
├── waitForDisconnectEvent
└── getLivenessResult
```

**Purpose**: Finalize recording and get results
- Stops video recording
- Waits for WebSocket disconnection
- Calls completion callback

### 7. Error and Edge Case States
```
retryableTimeout → (retry or timeout)
permissionDenied → (retry camera access)
mobileLandscapeWarning → error
timeout → (final timeout state)
error → (final error state)  
userCancel → (restart flow)
```

## Challenge Types

### FaceMovementChallenge
- **Flow**: `handleChallenge` → `success`
- **Purpose**: Basic liveness check with head movement
- **Duration**: Immediate completion after face matching

### FaceMovementAndLightChallenge  
- **Flow**: `handleChallenge` → `delayBeforeFlash` → `flashFreshnessColors` → `success`
- **Purpose**: Enhanced liveness with color flash sequences
- **Duration**: ~1 second delay + color flash duration

## Manual Events

### INIT_WEBSOCKET
- **Purpose**: Manually start the liveness detection flow
- **Usage**: `send({ type: 'INIT_WEBSOCKET' })`
- **Effect**: Transitions from `idle` to `initWebsocket` state
- **Requirements**: Machine must be in `idle` state

### DEBUG_FORCE_HANDLE_CHALLENGE
- **Purpose**: Skip directly to challenge handling for testing
- **Usage**: `send({ type: 'DEBUG_FORCE_HANDLE_CHALLENGE' })`
- **Effect**: Forces transition to `recording.handleChallenge` state
- **Requirements**: Machine must have session information loaded

## State Transitions

Most transitions are automatic based on:
- **Guards**: Conditions that must be met (e.g., `hasParsedSessionInfo`)
- **Services**: Async operations that complete (e.g., face detection)
- **Timeouts**: Automatic transitions after delays
- **Events**: External triggers (e.g., user actions, WebSocket messages)

## Error Handling

The machine includes comprehensive error handling:
- **Connection timeouts**: WebSocket connection failures
- **Camera errors**: Permission denied, no devices
- **Face detection errors**: No face, multiple faces, wrong distance
- **Server errors**: AWS service errors
- **Runtime errors**: Unexpected failures

Each error transitions to appropriate error states with specific error messages and recovery options.