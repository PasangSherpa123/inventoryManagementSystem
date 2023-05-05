import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface CustomerObjectInterface {
  customer_name: string,
  customer_phone: string,
  amount_to_be_received: number
}
// @route    POST /api/v1/supplier
// @desc     Create a supplier
// @access   Private
const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const {
    customer_name,
    customer_phone,
    amount_to_be_received
  }: CustomerObjectInterface = req.body;
  try{
    const { error } = validateCustomerData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log("helloworld2");
    const { rows } = await client.query("SELECT * FROM customer WHERE customer_phone= $1AND user_id=$2", [
      customer_phone,
      req.user.user_id
    ]);
    if (rows.length > 0) {
      return res.status(404).send("Customer with this name already exists!");
    }
    try {
      const { rows } = await client.query(
        "INSERT INTO customer(customer_name,customer_phone,amount_to_be_received,user_id) VALUES($1,$2,$3,$4) RETURNING customer_name,customer_phone",
        [customer_name, customer_phone, amount_to_be_received, req.user.user_id]
      );
      console.log(rows[0]);
      let customer= rows[0];
      res.status(201).json({
          success: true,
          customer: customer
        });
    
    } catch (err) {
      next(err);
    }
  }
  catch (err) {
    next(err);
  }
};


const validateCustomerData = (data: CustomerObjectInterface): any => {
  const schema = Joi.object({
    customer_name: Joi.string().min(4).max(150).required(),
    customer_phone: Joi.string()
      .min(9)
      .max(10)
      .regex(/^[a-zA-Z0-9]+$/)
      .required(),
    amount_to_be_received: Joi.number().default(0),
  });

  return schema.validate(data);
};



const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
   
  try{
      const { rows } = await client.query("SELECT * FROM customer WHERE user_id=$1", [
          req.user.user_id
        ]);
      if(rows.length <=0){
          res.status(404).json({
              success:false,
              data:"Customer is empty"
          });
      };
      let customer = rows;
      res.status(200).json({
          success:true,
          data:customer
      })

  }
  catch (err) {
    next(err);
  }
};


export {
  createCustomer,
  getCustomers
}