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
  UserLoginSchema,
} from "../validations/userValidation.js";
import { hasValidRole, isAuth } from "../middleware/auth.middleware.js";

const router = Router();
const userController = new UserController();

// Auth
router.post("/login", validate(UserLoginSchema, "body"), userController.login);

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

// User CRUD
router
  .route("/")
  .post(
    isAuth,
    hasValidRole(["ADMIN"]),
    validate(CreateUserSchema),
    userController.createUser
  )
  .get(
    isAuth,
    validate(GetAllUsersSchema, "query"),
    userController.getAllUsers
  );
router
  .route("/:id")
  .get(validate(UserIdParamSchema, "params"), userController.getUserById)
  .patch(
    isAuth,
    validate(UserIdParamSchema, "params"),
    validate(UpdateUserSchema, "body"),
    userController.updateUser
  )
  .delete(
    isAuth,
    hasValidRole(["ADMIN"]),
    validate(UserIdParamSchema, "params"),
    userController.deleteUser
  );

export default router;
