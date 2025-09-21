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

  updateUser = async (
    id: number,
    data: Partial<CreateUserInput>
  ): Promise<UserPublic> => {
    if (data.email) {
      const existingUser = await this.userData.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new HttpError(HttpStatus.CONFLICT, "Email already exists");
      }
    }
    if (data.username) {
      const existingUsername = await this.userData.findByUsername(
        data.username
      );
      if (existingUsername && existingUsername.id !== id) {
        throw new HttpError(HttpStatus.CONFLICT, "Username already exists");
      }
    }
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    const updatedUser: UserPublic = await this.userData.updateUser(id, data);
    return updatedUser;
  };

  getAllUsers = async (params: UserQueryParams): Promise<UserListResponse> => {
    const users: UserListResponse = await this.userData.getAllUsers(params);
    return users;
  };

  getUserById = async (id: number): Promise<UserPublic> => {
    const user: UserPublic = await this.userData.findById(id);

    return user;
  };
}

export default UserService;
