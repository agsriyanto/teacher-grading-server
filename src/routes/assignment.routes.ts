import { Router } from "express";
import { submitAssignment, getAssignments } from "../controllers/assignment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.post("/", authenticate, authorize(["STUDENT"]), submitAssignment);
router.get("/", authenticate, getAssignments);

export default router;
