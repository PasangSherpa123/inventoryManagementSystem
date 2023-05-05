import { RandomUUIDOptions } from "crypto";
import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface CompanyObjectInterface {
  company_name:String,
}

// @route    POST /api/v1/item/company
// @desc     Create a company
// @access   Private
const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  const {
    company_name
  }: CompanyObjectInterface = req.body;
  try{
    const { error } = validateCompanyData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
      const { rows } = await client.query(
        "INSERT INTO company(company_name, user_id) VALUES($1,$2) RETURNING company_id, company_name",
        [company_name,req.user.user_id]
      );
      
      console.log(rows[0]);
      let company= rows[0];
      res.status(201).json({
          success: true,
          data: company
        });
    
    } catch (err) {
      next(err);
    }
  }catch (error) {
    next(error);
  }
};
const validateCompanyData = (data: CompanyObjectInterface): any => {
  const schema = Joi.object({
    company_name: Joi.string()
      .min(3)
      .max(150)
      .required()
  });

  return schema.validate(data);
};



export {
  createCompany
}