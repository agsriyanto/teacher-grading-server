import { Request, Response } from "express";

import prisma from "../db";
import { Subject } from "../enums";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Role } from "../enums";

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

    if (student.role !== Role.STUDENT) {
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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { subject } = req.query;
    const user = req?.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, role: true },
    });

    if (!freshUser) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    const allowedSubjects = Object.values(Subject);
    if (subject && !allowedSubjects.includes(subject as Subject)) {
      res.status(400).json({ error: "Invalid subject" });
      return;
    }

    const whereCondition: any = {
      ...(subject && { subject: subject as string }),
      ...(freshUser.role === Role.STUDENT && { studentId: freshUser.id }), // Ensure up-to-date role
    };

    const assignments = await prisma.assignment.findMany({
      where: whereCondition,
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};