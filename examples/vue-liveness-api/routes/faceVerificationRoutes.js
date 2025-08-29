const express = require("express");
const {
  createSession,
  getResults,
} = require("../controllers/faceVerificationController");

const router = express.Router();
router.route("/create-session").post(createSession);
router.route("/session/:sessionId/results").get(getResults);

module.exports = router;