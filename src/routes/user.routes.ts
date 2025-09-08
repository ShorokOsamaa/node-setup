import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { validateCreateUser } from "../middleware/validate.middleware.js";

const router = Router();
const userController = new UserController();

router.post("/", validateCreateUser, userController.createUser);
// router.get("/", userController.getUsers);
// router.get("/:id", userController.getUserById);
// router.patch("/:id", validateUpdateUser, userController.updateUser);
// router.delete("/:id", userController.deleteUser);

export default router;
