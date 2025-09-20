import { Router } from "express";

import UserController from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  CreateUserSchema,
  GetAllUsersSchema,
} from "../validations/userValidation.js";

const router = Router();
const userController = new UserController();

router
  .route("/")
  .post(validate(CreateUserSchema), userController.createUser)
  .get(validate(GetAllUsersSchema, "query"), userController.getAllUsers);
// router.get("/:id", userController.getUserById);
// router.patch("/:id", validateUpdateUser, userController.updateUser);
// router.delete("/:id", userController.deleteUser);

export default router;
