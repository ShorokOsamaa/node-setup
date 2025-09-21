import { Router } from "express";

import UserController from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  CreateUserSchema,
  GetAllUsersSchema,
  PasswordResetConfirmSchema,
  PasswordResetRequestSchema,
  PasswordResetVerifySchema,
  UpdateUserSchema,
  UserIdParamSchema,
} from "../validations/userValidation.js";

const router = Router();
const userController = new UserController();

// // Auth
// router.post('/register', UserController.register);
// router.post('/login', UserController.login);

// Password Reset
router.post(
  "/forgot-password",
  validate(PasswordResetRequestSchema, "body"),
  userController.forgotPassword
);
router.post(
  "/verify-otp",
  validate(PasswordResetVerifySchema),
  userController.verifyOtp
);
router.post(
  "/reset-password",
  validate(PasswordResetConfirmSchema),
  userController.resetPassword
);

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
  )
  .delete(validate(UserIdParamSchema, "params"), userController.deleteUser);

export default router;
