import mongoose from 'mongoose';

const cognitiveTwinStateSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  windowStart: {
    type: Date,
    required: true
  },
  windowEnd: {
    type: Date,
    required: true
  },
  averageStress: {
    type: Number
  },
  emotionalStability: {
    type: Number
  },
  cognitiveLoadAvg: {
    type: Number
  },
  energyTrend: [{
    type: Number
  }],
  flagsFromReports: [{
    type: String
  }],
  learningTrend: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

const CognitiveTwinState = mongoose.model('CognitiveTwinState', cognitiveTwinStateSchema);

export default CognitiveTwinState;

