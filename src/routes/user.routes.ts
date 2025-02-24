import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getUsers);
router.post("/", createUser);

export default router;
