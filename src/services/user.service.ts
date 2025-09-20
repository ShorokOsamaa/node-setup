import UserData from "../persistance/user.data.js";
import {
  CreateUserInput,
  HttpStatus,
  UserListResponse,
  UserPublic,
  UserQueryParams,
} from "../types/index.js";
import HttpError from "../utils/error.util.js";
import { hashPassword } from "../utils/hashing.util.js";

class UserService {
  private userData = new UserData();

  createUser = async (data: CreateUserInput): Promise<UserPublic> => {
    const { email, firstName, lastName, password, role, username } = data;

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
      firstName,
      lastName,
      password: hashedPassword,
      role,
      username,
    };

    const user: UserPublic = await this.userData.createUser(userData);
    return user;
  };

  getAllUsers = async (params: UserQueryParams): Promise<UserListResponse> => {
    const users: UserListResponse = await this.userData.getAllUsers(params);
    return users;
  };
}

export default UserService;
