import mongoose from 'mongoose';

const cognitiveEntrySchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  questionId: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  recordedAt: {
    type: Date,
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  sentimentScore: {
    type: Number
  },
  emotion: {
    type: String
  },
  stressLevel: {
    type: Number
  },
  energyLevel: {
    type: Number
  },
  cognitiveLoad: {
    type: Number
  },
  explainers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: false
});

// Compound index for { patientId, createdAt }
cognitiveEntrySchema.index({ patientId: 1, createdAt: 1 });

const CognitiveEntry = mongoose.model('CognitiveEntry', cognitiveEntrySchema);

export default CognitiveEntry;

