import mongoose, { Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// extended document means this Message will become document at mongodb
// this {mongoose.Schema<Message>} is a custom schema that we have just made above

const messageSchema: mongoose.Schema<Message> = new mongoose.Schema({
  // this  mongoose.Schema<Message> will provide typesafety if i try to write content type : number it will not allow me
  content: {
    // type: Number,   // error throw hoga
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  // this message field will a array of type {Message}
  message: Message[];
}

const userSchema: mongoose.Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    // to check that you enter valid email we use regex
    match: [
      /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/,
      "please enter valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  message: [messageSchema], // message is a field which is of type {messageSchema}
});

// first condition is when user model is already created
// and second when we are creating it for the first time
const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default userModel;