import express, { Request, Response, Router, NextFunction } from "express";
import { UserCreateInterface, loginInterface } from "../RoutesInterface/UsersRoutesInterface";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import Joi from "joi";
// import { auth } from "../middleware/auth";
import client from "../database";
import bcrypt from "bcrypt";
// @route    POST /register
// @desc     Create a user
// @access   Public
const register = async (req: Request, res: Response, next: NextFunction) => {
  const {
    inventory_name,
    first_name,
    last_name,
    email,
    password,
  }: UserCreateInterface = req.body;
  try {
    const { error } = validateRegisterData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { rows } = await client.query("SELECT * FROM Users WHERE email=$1", [
      email,
    ]);
    
   
    if (rows.length > 0) {
      return res.status(404).send("User with this email already exists!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const { rows } = await client.query(
        "INSERT INTO users(inventory_name,email,first_name,last_name,password) VALUES($1,$2,$3,$4,$5) RETURNING user_id,inventory_name,first_name,last_name",
        [inventory_name, email, first_name, last_name, hashedPassword]
      );
      console.log(rows[0]);
      let user = rows[0];

      const token = jwt.sign(
        { user_id: user.user_id },
        process.env.SECRET_KEY,
        {
          expiresIn: 86400,
        }
      );
      res.status(201).cookie('token', token).json({
          success: true,
          token,
        });
    
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
const validateRegisterData = (data: UserCreateInterface): any => {
  const schema = Joi.object({
    inventory_name: Joi.string().alphanum().min(3).max(150).required(),
    first_name: Joi.string()
      .min(3)
      .max(150)
      .required(),
    last_name: Joi.string()
      .min(3)
      .max(150)
      .required(),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as loginInterface;
  const { error } = validateLoginData({ email });
  if (error) return res.status(404).send("Either wrong email or password.");

  try {
    const { rows } = await client.query("SELECT * from Users WHERE email=$1", [
      email,
    ]);

    if (rows.length == 0) {
      res.status(404).send("Either wrong email or password.");
    } else {
      const doesUserExist: boolean = await bcrypt.compare(
        password,
        rows[0].password
      );

      if (doesUserExist) {
        const token = jwt.sign(
          { user_id: rows[0].user_id, admin: rows[0].admin },
          process.env.SECRET_KEY!,
          {
            expiresIn: 86400,
          }
        );

        res.send({ user_id: rows[0].user_id, token, image: rows[0].image });
      } else {
        res.status(404).send("Either wrong email or password.");
      }
    }
  } catch (err) {
    next(err);
  }
}

const validateLoginData = (data: { email: string }): any => {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });

  return schema.validate(data);
};

export {
  register,
  login
}