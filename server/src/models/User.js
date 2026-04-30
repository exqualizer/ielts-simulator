import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contactNo: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', UserSchema)

