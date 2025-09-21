import { Request, Response } from "express";

import UserService from "../services/user.service.js";
import {
  CreateUserInput,
  UserListResponse,
  UserQueryParams,
} from "../types/index.js";
import { ApiResponse, HttpStatus, UserPublic } from "../types/index.js";

class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response) => {
    const data: CreateUserInput = req.validatedBody as CreateUserInput;
    const newUser = await this.userService.createUser(data);

    const response: ApiResponse<UserPublic> = {
      data: newUser,
      message: "User created successfully",
      success: true,
    };
    return res.status(HttpStatus.CREATED).json(response);
  };

  getAllUsers = async (req: Request, res: Response) => {
    const data: UserQueryParams = req.validatedQuery as UserQueryParams;
    console.log("Query Params:", data);

    const users = await this.userService.getAllUsers(data);
    const response: ApiResponse<UserListResponse> = {
      data: users,
      message: "Users retrieved successfully",
      success: true,
    };
    return res.status(HttpStatus.OK).json(response);
  };

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: number };

    const user: UserPublic = await this.userService.getUserById(id);
    const response: ApiResponse<UserPublic> = {
      data: user,
      message: "User retrieved successfully",
      success: true,
    };
    return res.status(HttpStatus.OK).json(response);
  };

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: number };
    const data: Partial<CreateUserInput> =
      req.validatedBody as Partial<CreateUserInput>;
    const updatedUser: UserPublic = await this.userService.updateUser(id, data);

    const response: ApiResponse<UserPublic> = {
      data: updatedUser,
      message: "User updated successfully",
      success: true,
    };
    return res.status(HttpStatus.OK).json(response);
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: number };
    await this.userService.deleteUser(id);
    const response: ApiResponse<null> = {
      data: null,
      message: "User deleted successfully",
      success: true,
    };
    return res.status(HttpStatus.OK).json(response);
  };
}

export default UserController;
