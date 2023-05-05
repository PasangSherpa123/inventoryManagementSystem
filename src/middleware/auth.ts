import jwt from "jsonwebtoken";
import { Response, NextFunction, Request } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.header("x-auth-token");

  if (token == undefined || !token)
    return res.status(403).send("You cannot perform this action.");

  try {
    const decode = jwt.verify(token!, process.env.SECRET_KEY!);
    // console.log("Decode is ",decode)
    req.user = decode;
    next();
  } catch (err) {
    console.log("The error is ",err)
    return res.status(403).send("You cannot perform this action.");
  }
};
