import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface SupplierObjectInterface {
  supplier_name: string,
  supplier_phone: string,
  amount_to_be_paid: number
}
// @route    POST /api/v1/supplier
// @desc     Create a supplier
// @access   Private
const createSupplier = async (req: Request, res: Response, next: NextFunction) => {
  const {
    supplier_name,
    supplier_phone,
    amount_to_be_paid
  }: SupplierObjectInterface = req.body;
  try{
    const { error } = validateSupplierData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { rows } = await client.query("SELECT * FROM supplier WHERE supplier_phone=$1 AND user_id=$2", [
      supplier_phone,
      req.user.user_id
    ]);
    
   
    if (rows.length > 0) {
      return res.status(404).send("Supplier with this phone number already exists!");
    }
    try {
      const { rows } = await client.query(
        "INSERT INTO supplier(supplier_name,supplier_phone,amount_to_be_paid,user_id) VALUES($1,$2,$3,$4) RETURNING supplier_name,supplier_phone",
        [supplier_name, supplier_phone, amount_to_be_paid, req.user.user_id]
      );
      console.log(rows[0]);
      let supplier= rows[0];
      res.status(201).json({
          success: true,
          supplier: supplier
        });
    
    } catch (err) {
      next(err);
    }
  }
  catch (err) {
    next(err);
  }
};


const validateSupplierData = (data: SupplierObjectInterface): any => {
  const schema = Joi.object({
    supplier_name: Joi.string().min(4).max(150).required(),
    supplier_phone: Joi.string()
      .min(9)
      .max(10)
      .regex(/^[a-zA-Z0-9]+$/)
      .required(),
    amount_to_be_paid: Joi.number().default(0),
  });

  return schema.validate(data);
};



const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
   
  try{
      const { rows } = await client.query("SELECT * FROM supplier WHERE user_id=$1", [
          req.user.user_id
        ]);
      if(rows.length <=0){
          res.status(404).json({
              success:false,
              data:"Supplier is empty"
          });
      };
      let supplier = rows;
      res.status(200).json({
          success:true,
          data:supplier
      })

  }
  catch (err) {
    next(err);
  }
};


export {
  createSupplier,
  getSuppliers
}