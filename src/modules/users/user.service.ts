import { User } from "./user.model";
import { TUser } from "./user.interface";
const createNewUser = async (user: Partial<TUser>): Promise<TUser> => {
  const { userName, email, password } = user;
  const newUser = new User({
    userName,
    email,
    password,
  });

  const result = await newUser.save();
  return result;
};

export const UserServices = { createNewUser };
