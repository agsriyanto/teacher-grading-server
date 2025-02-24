import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { Role } from "../enums";

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access denied, no token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = { id: user.id, role: user.role as Role };
    next();
  } catch (error) {
    console.error({error});
    res.status(401).json({ error: "Invalid token" });
  }
};
