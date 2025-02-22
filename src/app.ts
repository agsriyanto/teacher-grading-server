import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import assignmentRoutes from "./routes/assignment.routes";
import gradeRoutes from "./routes/grade.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/grades", gradeRoutes);

export default app;
