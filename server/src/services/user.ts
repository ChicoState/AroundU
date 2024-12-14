import User from '@/models/User';
import bcrypt from 'bcryptjs';

const create = async (createUserParams: {
  username: string;
  password: string;
}) => {
  try {
    const { username, password } = createUserParams;
    const userData = {
      username,
      passwordHash: bcrypt.hashSync(password, 8),
    };
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const fetch = async (fetchUserParams: { username: string }) => {
  try {
    const { username } = fetchUserParams;
    const user = await User.find({ username });
    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export default {
  create,
  fetch,
};
