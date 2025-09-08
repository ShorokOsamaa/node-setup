import UserData from "../persistance/user.data.js";
import { CreateUserInput, HttpStatus, UserPublic } from "../types/index.js";
import HttpError from "../utils/error.util.js";
import { hashPassword } from "../utils/hashing.util.js";

class UserService {
  private userData = new UserData();

  createUser = async (data: CreateUserInput): Promise<UserPublic> => {
    const { email, username, firstName, lastName, password, role } = data;

    const existingUser = await this.userData.findByEmail(email);
    if (existingUser) {
      throw new HttpError(HttpStatus.CONFLICT, "Email already exists");
    }
    const existingUsername = await this.userData.findByUsername(username);
    if (existingUsername) {
      throw new HttpError(HttpStatus.CONFLICT, "Username already exists");
    }

    const hashedPassword = await hashPassword(password);

    const userData: CreateUserInput = {
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    };

    const user: UserPublic = await this.userData.createUser(userData);
    return user;
  };
}

export default UserService;
