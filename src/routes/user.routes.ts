import { Router } from "express";

import UserController from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  CreateUserSchema,
  GetAllUsersSchema,
  UpdateUserSchema,
  UserIdParamSchema,
} from "../validations/userValidation.js";

const router = Router();
const userController = new UserController();

router
  .route("/")
  .post(validate(CreateUserSchema), userController.createUser)
  .get(validate(GetAllUsersSchema, "query"), userController.getAllUsers);
router
  .route("/:id")
  .get(validate(UserIdParamSchema, "params"), userController.getUserById)
  .patch(
    validate(UserIdParamSchema, "params"),
    validate(UpdateUserSchema, "body"),
    userController.updateUser
  );
// router.delete("/:id", userController.deleteUser);

export default router;
