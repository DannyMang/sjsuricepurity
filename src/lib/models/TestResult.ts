import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
  score: Number,
  answers: [Boolean],
  timestamp: { type: Date, default: Date.now }
});

export const TestResult = mongoose.models.TestResult || mongoose.model('TestResult', TestResultSchema); 