import mongoose from 'mongoose'

const TestSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    section: { type: String, required: true, enum: ['listening', 'reading', 'writing', 'speaking'], index: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    durationSec: { type: Number, required: true },
    results: { type: mongoose.Schema.Types.Mixed, required: true },
    /** Updated whenever the user clicks "Save score" for this section. */
    savedAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: true },
)

TestSessionSchema.index({ userId: 1, section: 1, createdAt: -1 })

export const TestSession = mongoose.model('TestSession', TestSessionSchema)

