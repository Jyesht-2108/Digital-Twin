import mongoose from 'mongoose';

const dailyQuestionSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    tone: {
      type: String,
      required: true
    }
  }],
  generatedFrom: {
    stressLevel: {
      type: Number
    },
    energyLevel: {
      type: Number
    },
    notes: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Compound index for { patientId, date }
dailyQuestionSchema.index({ patientId: 1, date: 1 });

const DailyQuestion = mongoose.model('DailyQuestion', dailyQuestionSchema, 'dailyquestions');

export default DailyQuestion;

