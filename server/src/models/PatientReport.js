import mongoose from 'mongoose';

const patientReportSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  hospitalId: {
    type: String,
    required: true,
    index: true
  },
  reportHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  uploadedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  parsedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  strict: true
});

// Prevent updates and deletes (read-only collection)
// Allow creation but prevent modifications
patientReportSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate', 'findOneAndDelete', 'deleteOne', 'deleteMany'], function() {
  throw new Error('PatientReport is a read-only collection - updates and deletes are not allowed');
});

const PatientReport = mongoose.model('PatientReport', patientReportSchema);

export default PatientReport;

