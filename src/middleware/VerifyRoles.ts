import { NextFunction, Request, Response } from "express";
import { RequestWithUserRole } from "./VerifyJWT";

const VerifyRoles = (...allowedRoles: string[]) => {
  return (req: RequestWithUserRole, res: Response, next: NextFunction) => {
    if (!req.user?.role) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const role = req.user.role;
    const result = rolesArray.includes(role);
    if (!result) return res.sendStatus(401);
    next();
  };
};

export default VerifyRoles;
