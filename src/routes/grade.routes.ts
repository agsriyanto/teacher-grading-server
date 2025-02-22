import { Router } from "express";
import { submitGrade, getStudentGrades } from "../controllers/grade.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.post("/", authenticate, authorize(["TEACHER"]), submitGrade);
router.get("/", authenticate, getStudentGrades);

export default router;
 