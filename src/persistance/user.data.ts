import { Prisma, PrismaClient } from "@prisma/client";

import {
  HttpStatus,
  User,
  UserListResponse,
  UserPublic,
  UserQueryParams,
} from "../types/index.js";
import {
  CreateUserSchemaType,
  UserRoleSchema,
} from "../validations/userValidation.js";
import HttpError from "../utils/error.util.js";

class UserData {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  async count(where: Prisma.UserWhereInput = {}): Promise<number> {
    return this.prisma.user.count({ where });
  }

  async createUser(data: CreateUserSchemaType): Promise<UserPublic> {
    const user = await this.prisma.user.create({ data });
    return this.convertToUserPublicDTO(user);
  }

  async findByEmail(email: string): Promise<null | User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findById(id: number): Promise<UserPublic> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found");
    }

    return this.convertToUserPublicDTO(user);
  }

  async findByUsername(username: string): Promise<null | User> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async getAllUsers(params: UserQueryParams): Promise<UserListResponse> {
    const { limit, page, search } = params;

    const where: Prisma.UserWhereInput = { isDeleted: false };
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;
    const take = limit;
    const total = await this.prisma.user.count({ where });

    const users = await this.prisma.user.findMany({ skip, take, where });
    const usersList = users.map(this.convertToUserPublicDTO);

    return {
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      users: usersList,
    };
  }

  async updateUser(id: number, data: Partial<User>): Promise<UserPublic> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.convertToUserPublicDTO(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async initiatePasswordReset(
    email: string,
    otp: string,
    expiryMinutes: number
  ): Promise<UserPublic> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found");
    }
    const otpExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000); // OTP valid for 10 minutes
    const otpObject = await this.prisma.user.update({
      where: { email },
      data: { resetOtp: otp, otpExpiry },
    });
    return this.convertToUserPublicDTO(otpObject);
  }

  async verifyOtp(
    userId: number,
    otp: string,
    expiryMinutes: number,
    sessionToken: string
  ): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, "User not found");
    }
    if (user.resetOtp !== otp) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Invalid OTP");
    }
    if (user.otpExpiry && user.otpExpiry < new Date()) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "OTP has expired");
    }
    const newExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetOtp: null,
        otpExpiry: null,
        resetSessionToken: sessionToken,
        resetSessionExpiry: newExpiry,
      },
    });

    if (!updatedUser) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create reset session"
      );
    }

    return sessionToken;
  }

  private convertToUserPublicDTO(user: User): UserPublic {
    const parsedRole = UserRoleSchema.safeParse(user.role);
    if (!parsedRole.success) {
      console.error(`Invalid role value: ${user.role}`);
      throw new Error(`Invalid role value: ${user.role}`);
    }
    const userRole = parsedRole.data; // Convert to UserRole
    return {
      createdAt: user.createdAt,
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      role: userRole,
      updatedAt: user.updatedAt,
      username: user.username,
    };
  }
}

export default UserData;
