const asyncHandler = require('express-async-handler')
const AWS = require('aws-sdk')

const rekognition = new AWS.Rekognition({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const sts = new AWS.STS({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const createSession = asyncHandler(async (req, res) => {
  try {
    // Generate temporary credentials using STS
    const stsParams = {
      Name: 'AwsRekognition',
      DurationSeconds: 900, // 15 minutes
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'rekognition:StartFaceLivenessSession',
              'rekognition:GetFaceLivenessSessionResults',
            ],
            Resource: '*',
          },
        ],
      }),
    }

    const stsResponse = await sts.getFederationToken(stsParams).promise()

    const settings = {
      AuditImagesLimit: req.body.auditImagesLimit || 4,
    }

    const params = {
      Settings: settings,
      ClientRequestToken: req.body.clientRequestToken, // Optional: Idempotency token
    }

    const response = await rekognition.createFaceLivenessSession(params).promise()

    res.json({
      success: true,
      sessionId: response.SessionId,
      timestamp: new Date().toISOString(),
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: stsResponse.Credentials.AccessKeyId,
      secretAccessKey: stsResponse.Credentials.SecretAccessKey,
      sessionToken: stsResponse.Credentials.SessionToken,
    })
  } catch (error) {
    console.error('Error creating liveness session:', error)

    res.status(500).json({
      success: false,
      error: error.message,
      code: error.name || 'CreateSessionError',
      timestamp: new Date().toISOString(),
    })
  }
})

const getResults = asyncHandler(async (req, res) => {
  try {
    const { sessionId } = req.params

    const params = {
      SessionId: sessionId,
    }

    const response = await rekognition.getFaceLivenessSessionResults(params).promise()

    res.json({
      success: true,
      sessionId: sessionId,
      status: response.Status,
      confidence: response.Confidence,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error getting session results:', error)

    res.status(500).json({
      success: false,
      error: error.message,
      code: error.name || 'GetResultsError',
      sessionId: req.params.sessionId,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = { createSession, getResults }
