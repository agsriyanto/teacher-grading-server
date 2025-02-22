import { Request, Response } from "express";
import prisma from "../db";
import { AuthRequest } from "../middlewares/auth.middleware";

export const submitGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { grade, feedback, teacherId, assignmentId } = req.body;

    const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    if (teacher.role !== "TEACHER") {
      res.status(403).json({ error: "Only teachers can grade assignments" });
      return;
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    const newGrade = await prisma.grade.create({
      data: { grade, feedback, teacherId, assignmentId },
    });

    res.status(201).json({ message: "Grade submitted", grade: newGrade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStudentGrades = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const studentId = req.query.studentId as string;
    console.log({req})

    if (req.user?.role === "STUDENT" && req.user.id !== studentId) {
      res
        .status(403)
        .json({ error: "Forbidden: You can only view your own grades" });
      return;
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    const grades = await prisma.grade.findMany({
      where: { assignment: { studentId } },
      include: {
        assignment: true,
        teacher: { select: { name: true, email: true } },
      },
    });

    if (grades.length === 0) {
      res.status(404).json({ error: "No grades found for this student" });
      return;
    }

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
