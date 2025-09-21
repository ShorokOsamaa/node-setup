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

  async updateUser(
    id: number,
    data: Partial<CreateUserSchemaType>
  ): Promise<UserPublic> {
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
