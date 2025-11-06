import CognitiveEntry from '../models/CognitiveEntry.js';

/**
 * Create a new cognitive entry (patient response)
 * POST /api/cognitive-entries
 */
export const createCognitiveEntry = async (req, res, next) => {
  try {
    const { patientId, questionId, questionText, rawText } = req.body;

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing required field: patientId'
      });
    }

    if (!questionId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing required field: questionId'
      });
    }

    if (!questionText) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing required field: questionText'
      });
    }

    if (!rawText) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Missing required field: rawText'
      });
    }

    // Create new cognitive entry with recordedAt = current time
    const cognitiveEntry = new CognitiveEntry({
      patientId,
      questionId,
      questionText,
      rawText,
      recordedAt: new Date()
    });

    // Save to database
    const savedEntry = await cognitiveEntry.save();

    // Return saved entry
    return res.status(201).json({
      success: true,
      data: savedEntry
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }

    // Pass other errors to error handler
    next(error);
  }
};

