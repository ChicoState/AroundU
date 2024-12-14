import { ObjectId } from 'mongoose';

type UserData = {
  username: string;
  passwordHash: string;
};

type UserModel = Document &
  UserData & {
    _id: string | ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

export type { UserModel, UserData };
