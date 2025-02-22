import { Request, Response } from "express";
import prisma from "../db";

export const submitAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject, title, content, studentId } = req.body;

    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    if (student.role !== "STUDENT") {
      res.status(403).json({ error: "Only students can submit assignments" });
      return;
    }

    const assignment = await prisma.assignment.create({
      data: { subject, title, content, studentId },
    });

    res.status(201).json({ message: "Assignment submitted", assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { subject } = req.query;

    const allowedSubjects = ["English", "Math"];
    if (subject && !allowedSubjects.includes(subject as string)) {
      res.status(400).json({ error: "Subject must be 'English' or 'Math'" });
      return;
    }

    const assignments = await prisma.assignment.findMany({
      where: subject ? { subject: subject as string } : {},
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
