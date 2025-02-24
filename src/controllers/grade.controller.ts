import { Request, Response } from "express";
import prisma from "../db";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Role } from "../enums";

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

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (req.user.role === Role.STUDENT) {
      if (!studentId || req.user.id !== studentId) {
        res
          .status(403)
          .json({ error: "Forbidden: You can only view your own grades" });
        return;
      }
    }

    const whereCondition =
      req.user.role === Role.STUDENT
        ? { assignment: { studentId: studentId } }
        : {};

    const grades = await prisma.grade.findMany({
      where: whereCondition,
      include: {
        assignment: {
          include: {
            student: { select: { id: true, name: true, email: true } },
          },
        },
        teacher: { select: { name: true, email: true } },
      },
    });

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
