import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  workingHours: {
    start: {
      type: String,
      required: true,
      default: '09:00'
    },
    end: {
      type: String,
      required: true,
      default: '17:00'
    }
  }
}, {
  timestamps: true
});

export const Doctor = mongoose.model('Doctor', doctorSchema);