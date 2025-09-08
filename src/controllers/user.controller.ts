import UserService from "../services/user.service.js";
import { CreateUserInput } from "../types/index.js";
import { Request, Response } from "express";
import { ApiResponse, HttpStatus, UserPublic } from "../types/index.js";

class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response) => {
    const data: CreateUserInput = req.body;
    const newUser = await this.userService.createUser(data);

    const response: ApiResponse<UserPublic> = {
      success: true,
      data: newUser,
      message: "User created successfully",
    };
    return res.status(HttpStatus.CREATED).json(response);
  };
}

export default UserController;
