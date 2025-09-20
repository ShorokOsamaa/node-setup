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
}

export default UserController;
