import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: You do not have access" });
      return;
    }
    next();
  };
};
