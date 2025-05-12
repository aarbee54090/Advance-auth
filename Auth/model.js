import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    plainPassword:{
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
    verificationCode: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Correct placement here
  }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
