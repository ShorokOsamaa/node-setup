import { randomBytes, randomInt } from "crypto";
import UserData from "../persistance/user.data.js";
import {
  AuthResponse,
  CreateUserInput,
  HttpStatus,
  User,
  UserListResponse,
  UserPublic,
  UserQueryParams,
} from "../types/index.js";
import HttpError from "../utils/error.util.js";
import { comparePassword, hashPassword } from "../utils/hashing.util.js";
import { sendResetPasswordEmail } from "../utils/email.util.js";
import { signUser } from "../utils/auth.util.js";

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

  login = async (email: string, password: string) => {
    const user = await this.userData.findByEmail(email);
    if (!user) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
    const { token, expiresAt } = signUser(user);

    const userPublic: UserPublic = await this.userData.findById(user.id);
    const authResponse: AuthResponse = { token, user: userPublic, expiresAt };
    return authResponse;
  };

  updateUser = async (id: number, data: Partial<User>): Promise<UserPublic> => {
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
      data.passwordChangedAt = new Date();
    }
    const updatedUser: UserPublic = await this.userData.updateUser(id, data);
    return updatedUser;
  };

  deleteUser = async (id: number): Promise<void> => {
    const user = await this.userData.findById(id);
    await this.userData.deleteUser(user.id);
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
    const otp = randomInt(100000, 999999).toString();
    const expiryMinutes = 10; // Minutes
    const otpObject = await this.userData.initiatePasswordReset(
      user.email,
      otp,
      expiryMinutes
    );

    // SEND EMAIL
    console.log(`Password reset OTP for ${otpObject.email}: ${otp}`);

    await sendResetPasswordEmail(email, otp).catch((error: unknown) => {
      throw new HttpError(
        error instanceof HttpError
          ? error.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
        error instanceof Error ? error.message : "Failed to send OTP email"
      );
    });
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
      passwordChangedAt: new Date(),
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
