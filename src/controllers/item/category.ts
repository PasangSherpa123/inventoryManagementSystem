import { RandomUUIDOptions } from "crypto";
import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface CategoryObjectInterface {
  category_name:String,
}

// @route    POST /api/v1/item/category
// @desc     Create a company
// @access   Private
const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const {
    category_name
  }: CategoryObjectInterface = req.body;
  try{
    const { error } = validateCategoryData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
      const { rows } = await client.query(
        "INSERT INTO category(category_name, user_id) VALUES($1,$2) RETURNING category_id, category_name",
        [category_name,req.user.user_id]
      );
      
      console.log(rows[0]);
      let category= rows[0];
      res.status(201).json({
          success: true,
          data: category
        });
    
    } catch (err) {
      next(err);
    }
  }catch (error) {
    next(error);
  }
};
const validateCategoryData = (data: CategoryObjectInterface): any => {
  const schema = Joi.object({
    category_name: Joi.string()
      .min(3)
      .max(150)
      .regex(/^[a-zA-Z0-9]+$/)
      .required()
  });

  return schema.validate(data);
};



export {
  createCategory
}