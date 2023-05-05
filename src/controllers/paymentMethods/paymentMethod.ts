import express, { Request, Response, Router, NextFunction } from "express";

import Joi from "joi";
import client from "../../database";

interface PaymentObjectInterface {
  type_of_payment: string,
  amount: number,
}
// @route    POST /api/v1/payment
// @desc     Create a supplier
// @access   Private
const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  const {
    type_of_payment,
    amount
  }: PaymentObjectInterface = req.body;
  try{
    const { error } = validateSupplierData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { rows } = await client.query("SELECT * FROM paymentMethod WHERE type_of_payment=$1 AND user_id=$2", [
      type_of_payment,
      req.user.user_id
    ]);
    
   
    if (rows.length > 0) {
      return res.status(404).send("Payment method with this name already exists!");
    }
    try {
      const { rows } = await client.query(
        "INSERT INTO paymentMethod(type_of_payment,amount,user_id) VALUES($1,$2,$3) RETURNING type_of_payment,amount",
        [type_of_payment,amount, req.user.user_id]
      );
      console.log(rows[0]);
      let payment= rows[0];
      res.status(201).json({
          success: true,
          payment: payment
        });
    
    } catch (err) {
      next(err);
    }
  }
  catch (err) {
    next(err);
  }
};


const validateSupplierData = (data: PaymentObjectInterface): any => {
  const schema = Joi.object({
    type_of_payment: Joi.string().min(4).max(150).required(),
      amount: Joi.number().default(0),
  });

  return schema.validate(data);
};

const getPayments = async (req: Request, res: Response, next: NextFunction) => {
   console.log('heloworld');
  try{
      const { rows } = await client.query("SELECT * FROM paymentMethod WHERE user_id=$1", [
          req.user.user_id
        ]);
        console.log('helloworld');
      if(rows.length <=0){
          res.status(404).json({
              success:false,
              data:"PaymentMethod is empty"
          });
      };
      let payment = rows;
      res.status(200).json({
          success:true,
          data:payment
      })

  }
  catch (err) {
    next(err);
  }
};



export {
  createPayment,
  getPayments
}