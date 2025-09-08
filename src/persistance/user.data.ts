import { PrismaClient } from "@prisma/client";
import {
  CreateUserSchemaType,
  UserRoleSchema,
  UserRoleType,
} from "../validations/userValidation.js";
import { UserPublic, User } from "../types/index.js";
import HttpError from "../utils/error.util.js";

class UserData {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  private convertToUserPublicDTO(user: User): UserPublic {
    const parsedRole = UserRoleSchema.safeParse(user.role);
    if (!parsedRole.success) {
      console.error(`Invalid role value: ${user.role}`);
      throw new Error(`Invalid role value: ${user.role}`);
    }
    const userRole = parsedRole.data as UserRoleType; // Convert to UserRole
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: userRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // private convertToUserPublicDTO(user: User): UserPublic {
  //   const {
  //     id,
  //     email,
  //     username,
  //     firstName,
  //     lastName,
  //     role,
  //     createdAt,
  //     updatedAt,
  //   } = user;
  //   return {
  //     id,
  //     email,
  //     username,
  //     firstName,
  //     lastName,
  //     role,
  //     createdAt,
  //     updatedAt,
  //   };
  // }

  createUser = async (data: CreateUserSchemaType): Promise<UserPublic> => {
    const user = await this.prisma.user.create({ data });
    return this.convertToUserPublicDTO(user);
  };

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}

export default UserData;
