import { UserModel } from '@aroundu/shared';
import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema<UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<UserModel>('User', UserSchema);
export default User;
