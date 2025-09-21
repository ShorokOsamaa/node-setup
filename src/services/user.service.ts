import { randomBytes, randomInt } from "crypto";
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

  deleteUser = async (id: number): Promise<void> => {
    const user = await this.userData.findById(id);
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found");
    }
    await this.userData.deleteUser(id);
  };

  forgotPassword = async (email: string): Promise<void> => {
    const user = await this.userData.findByEmail(email);
    if (!user) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "User with this email not found"
      );
    }

    // GENERATE OTP
    const otp = randomInt(100000, 999999) + "";
    const expiryMinutes = 10; // Minutes
    const otpObject = await this.userData.initiatePasswordReset(
      user.email,
      otp,
      expiryMinutes
    );
    if (!otpObject) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to set OTP"
      );
    }

    // SEND EMAIL
    console.log(`Password reset OTP for ${email}: ${otp}`);
    // In production, integrate with an email service to send the OTP
  };

  verifyOtp = async (email: string, otp: string): Promise<string> => {
    const user = await this.userData.findByEmail(email);
    if (!user) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "User with this email not found"
      );
    }
    if (user.resetOtp !== otp) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Invalid OTP");
    }
    if (user.otpExpiry && user.otpExpiry < new Date()) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "OTP has expired");
    }

    // OTP is valid
    const expiryMinutes = 10;
    const sessionToken = randomBytes(32).toString("hex");
    const resetSessionToken = await this.userData.verifyOtp(
      user.id,
      otp,
      expiryMinutes,
      sessionToken
    );

    if (!resetSessionToken) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create reset session"
      );
    }
    return resetSessionToken;
  };

  resetPassword = async (
    email: string,
    newPassword: string,
    resetToken: string
  ): Promise<void> => {
    const user = await this.userData.findByEmail(email);
    if (!user) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "User with this email not found"
      );
    } else if (user.resetSessionToken !== resetToken) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Invalid reset token");
    } else if (
      user.resetSessionExpiry &&
      user.resetSessionExpiry < new Date()
    ) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Reset session has expired");
    }
    const hashedPassword = await hashPassword(newPassword);
    await this.userData.updateUser(user.id, {
      password: hashedPassword,
      resetOtp: null,
      otpExpiry: null,
      resetSessionToken: null,
      resetSessionExpiry: null,
    });
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
